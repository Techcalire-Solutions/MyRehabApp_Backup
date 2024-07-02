import { SessionMaster } from '../../../models/sessionMaster';
import { Wallet } from '../../../../admin/models/wallet';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Session } from 'src/app/Modules/admin/models/session';
import { BtSessionData } from '../../../models/btSessionData';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { User } from 'src/app/Modules/admin/models/user';
import { ThemePalette } from '@angular/material/core';
import { Activity } from '../../../models/activity';

@Component({
  selector: 'app-bt-session-data',
  templateUrl: './bt-session-data.component.html',
  styleUrls: ['./bt-session-data.component.scss']
})
export class BtSessionDataComponent implements OnInit, OnDestroy {

  constructor(private fb : FormBuilder, private route : ActivatedRoute, private therapistService : TherapistService, private _snackBar: MatSnackBar,
    private adminService : AdminService, private router: Router,
    private activatedRoute: ActivatedRoute,) { }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

  btSessionForm = this.fb.group({
    session_master_id : this.route.snapshot.params['id'],
    sitting : [''],
    remarksSitting : [''],
    eyeContact : [''],
    remarksEyeContact : [''],
    attention : [''],
    remarksAttention : [''],
    mood : [''],
    remarksMood : [''],
    activities : [''],
    remarksActivities : [''],
    comprehensionInstructions : [''],
    remarksComprehensionInstructions : [''],
    responseInstructions : [''],
    remarksResponseInstructions :[''],
    waiting : [''],
    remarksWaiting : [''],
    compliance : [''],
    remarksCompliance : [''],
    behaviour : [''],
    remarksBehaviour : [''],
    communication : [''],
    remarksCommunication :[''],
    throwThings : [''],
    remarksThrowThings : [''],
    tearsThings : [''],
    remarksTearsThings : [''],
    angryProne : [''],
    remarksAngryProne : [''],
    selfInjurious : [''],
    remarksSelfInjurious : [''],
    repetitive : [''],
    remarksRepetitive : [''],
    tantrums : [''],
    remarksTantrums : [''],
    climbsFurniture : [''],
    remarksClimbsFurniture : [''],
    disruptiveBehaviour : [''],
    remarksDisruptiveBehaviour : ['']
    });

  walletSubscription: Subscription;
  ngOnInit(): void {
    this.getWallet();
    this.getUser();
    if (this.toggleStatus) {
      const activityStatus = 'Completed'
    }
    // this.addActivity()
  }

  submitButtonState = false;
  async ngOnDestroy(){
    if(this.submitButtonState == false){
       this.onSubmit();
    }
    if(this.submitS){
      this.submitS.unsubscribe();
    }
    if(this.cashOutS){
      this.cashOutS.unsubscribe();
    }
    if(this.feeS){
      this.feeS.unsubscribe();
    }
    this.sessionS.unsubscribe();
    this.sessionMS.unsubscribe();
    this.walletS.unsubscribe();
    this.submit?.unsubscribe();
    this.adminS?.unsubscribe ();
  }

  keys =[
    {name:'Poor',value:'1'},
    {name:'Some Attempt',value:'2'},
    {name:'Emerging',value:'3'},
    {name:'Good',value:'4'},
    {name:'Excellent',value:'5'}
  ]

  grades =[
    {name:'Never',value:'1'},
    {name:'Rarely',value:'2'},
    {name:'Occasional',value:'3'},
    {name:'Sometimes',value:'4'},
    {name:'Always',value:'5'}
  ]

  session : any[] = [];
  clientId : any
  wallet : Wallet
  sessionMaster : any
  sessionS: Subscription;
  sessionMS: Subscription;
  walletS: Subscription;
  getWallet(){
    this.sessionS = this.adminService.getSession().
    pipe(map((session:Session[])=>session.filter((x)=>x._id==this.route.snapshot.params['sessionId']))).
    subscribe((y)=>{
      if(y.length === 0){
        this.sessionS = this.adminService.getLeaveSession().
        pipe(map((session:LeaveSession[])=>session.filter((x)=>x._id==this.route.snapshot.params['sessionId']))).
        subscribe((y)=>{
          if(y.length === 0){
            this.sessionS = this.therapistService.getCompensation().
            pipe(map((session:CompensationSession[])=>session.filter((x)=>x._id==this.route.snapshot.params['sessionId']))).
            subscribe((y)=>{
              this.session = y
              this.clientId = this.session[0].clientName._id
            })
          }else{
            this.session = y
            this.clientId = this.session[0].clientName._id
          }
        })
      }else{
        this.session = y
        this.clientId = this.session[0].clientName._id
      }

      //get wallet
      this.walletS = this.adminService.getWalletByClient(this.clientId).subscribe((res)=>{
        this.wallet = res

        //get session master
        this.sessionMS = this.therapistService.getSessionMasterbyId(this.route.snapshot.params['id']).subscribe((res)=>{
          this.sessionMaster = res
        })
      })
    })
  }

  user : any
  therapist : User[] = []
  currentUser : any
  userId : String
  adminS: Subscription;
  getUser(){
    let token = localStorage.getItem('token')
      this.user = JSON.parse(token)?.username

      this.adminS = this.adminService.getTherapist().subscribe((res)=>{
        this.therapist = res

        this.currentUser = this.therapist.find(x => x.name == this.user)

        if(this.currentUser){
          this.userId = this.currentUser._id
        }
      })
  }

  bt: any;
  btData: BtSessionData[] = [];
  submitS: Subscription;
  cashOutS: Subscription;
  submit: Subscription;
  isNextStepEnabled: boolean = false;
  onSubmit(){
    this.isNextStepEnabled = true;
    this.submitButtonState = true;
    this.therapistService.saveBtForm(this.btSessionForm.getRawValue()).subscribe((res)=>{
      this.bt = res;
      this.btData = this.bt
      this._snackBar.open("Submitted","" ,{duration:3000})

      if(this.wallet){
         //check wallet is enough for fees
        let walletAmount : any
        let sessionFee : any
        let concession : any
        let amountPayed : any

        walletAmount = this.wallet.balanceAmount
        sessionFee = this.sessionMaster.sessionFee
        concession = this.sessionMaster.concession
        amountPayed = sessionFee - concession

        if(walletAmount >= amountPayed){
          let data = {
            amount : amountPayed,
            sessionMasterId : this.route.snapshot.params['id']
          }
          this.cashOutS = this.adminService.addCashOut(this.clientId, data).subscribe((res)=>{
            let data = {feeStatus : true}
            let feeData = {
              sessionMasterId: this.route.snapshot.params['id'],
              sessionType: this.sessionMaster.sessionStatus,
              recievedBy: this.userId,
              collectedAmount: amountPayed,
              paymentMode: 'Wallet',
              remarks: 'Deducted from Wallet',
              amountToBeCollected: amountPayed,
              dateAndTime: this.sessionMaster.date
            }
            this.submit = this.adminService.payFees(feeData).subscribe((res)=>{
              // this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.bt.session_master_id)
              // this.updateFeeStatus(data,this.route.snapshot.params['id'])
            })
            },(error=>{

              alert(error)
            }))
        }else{
          // this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.bt.session_master_id)
        }
      }else {
        // this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.bt.session_master_id)
      }
      this.clearControls()
   },(error=>{
    console.log(error)
    alert(error.error.message)
    }))
  }

  feeS: Subscription;
  updateFeeStatus(data : any, id : String){
    this.feeS = this.adminService.updateFeeStatus(data,id).subscribe((status)=>{

    })
  }

  clearControls(){
    this.btSessionForm.reset()
    this.btSessionForm.setErrors(null)
    Object.keys(this.btSessionForm.controls).forEach(key=>{this.btSessionForm.get(key).setErrors(null)})
  }
  //------------------------------------Activity starts--------------------------------------------------------
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  activities = [
    { value: '1', name: 'Puzzle activities' },
    { value: '2', name: 'Two puzzle activities' },
    { value: '3', name: 'Peg board activates' },
    { value: '4', name: 'Focusing on breathing' },
    { value: '5', name: 'Grounding technique' },
    { value: '6', name: 'Sorting' },
    { value: '7', name: 'Matching – Colour patterns, shapes, designs, and shadows image' },
    { value: '8', name: 'Spot the difference game' },
    { value: '9', name: 'Find the odd one' },
    { value: '10', name: 'Stacking Cups' },
    { value: '11', name: 'Building blocks' },
    { value: '12', name: 'Prewriting Skills – Drawing lines, Circles, triangles' },
    { value: '13', name: 'Tracing – (With one hand or both hands or with pencils)' },
    { value: '14', name: 'Lacing' },
    { value: '15', name: 'Scissor skills' },
    { value: '16', name: 'Copy the pattern' },
    { value: '17', name: 'Complete the figure' },
    { value: '18', name: 'Dot joining activates' },
    { value: '19', name: 'Rote counting' },
    { value: '20', name: 'String Beading' },
    { value: '21', name: 'Recreating patterns using blocks, beads, dominos' },
    { value: '22', name: 'Worksheets' }
  ];



  activityForm = this.fb.group({
    sessionMasterId: this.activatedRoute.snapshot.params['id'],
    activityDetails: this.fb.array([]),
    activityStatus: [false]




  });








  activity()  {
    return this.activityForm.get("activityDetails") as FormArray
  }

  newActivity() {
    return this.fb.group({
      activity: [''],
      response:[''],
      status:[false]


    })
  }


  addActivity() {
    this.activity().push(this.newActivity());
  }

  removeActivity(i:number) {
    this.activity().removeAt(i);
  }
  // clientActivity: Activity[]=[]
  toggleStatus: boolean = false;
  activityId: string = '';

   actv :any
  onActivitySubmit() {

    const form = { ...this.activityForm.value };
    this.therapistService.addActivity(form).subscribe(res  => {
     this.actv = res

      this._snackBar.open("Activity added successfully...", "", { duration: 1000 });
      this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.actv.sessionMasterId)

  })


  }



    cancel(){
      history.back();

    }










  //----------------------edit activity----------------------------------------------------------------
  activityData :Activity
  editActivity() {
    const sessionId = this.route.snapshot.params['id'];

    this.therapistService.getActivitybyId(sessionId).subscribe((bt: Activity) => {
  
      try {
        this.activityForm.patchValue({
      
        });

        if (bt.activityDetails && bt.activityDetails.length > 0) {
       
        }

        const activityDetailsArray = this.activityForm.get('activityDetails') as FormArray;
        activityDetailsArray.clear();

        // Loop through the received activityDetails and add them to the form array
        if (bt.activityDetails && Array.isArray(bt.activityDetails)) {
          bt.activityDetails.forEach(detail => {
            activityDetailsArray.push(this.fb.group({
              activity: [detail.activity || ''],
              response: [detail.response || '']
            }));
          });
        }

  
      } catch (error) {
        console.error('Error while patching form:', error);
      }
    });
  }








editSubmit(){
  let data = {
    activityStatus: this.activityForm.get('activityStatus').value

  }
  this.therapistService.editActivity(data,this.route.snapshot.params['id']).subscribe((res)=>{

  })
}



}
