import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { Session } from 'src/app/Modules/admin/models/session';
import { SessionMaster } from '../../../models/sessionMaster';
import { StSessionData } from '../../../models/stSessionData';
import { StSkill } from '../../../models/stSkill';
import { TherapistService } from '../../../therapist.service';
import { Wallet } from 'src/app/Modules/admin/models/wallet';
import { Subscription } from 'rxjs';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { User } from 'src/app/Modules/admin/models/user';
import { MatDialog } from '@angular/material/dialog';
import { Category } from 'src/app/Modules/admin/models/category';
import { SeGoal } from '../../../models/seGoal';
import { ThemePalette } from '@angular/material/core';
import { Location } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { Activity } from '../../../models/activity';
@Component({
  selector: 'app-st-session-data',
  templateUrl: './st-session-data.component.html',
  styleUrls: ['./st-session-data.component.scss']
})

export class StSessionDataComponent implements OnInit, OnDestroy {
  stSessionForm = this.fb.group({
    session_master_id : this.activatedRoute.snapshot.params['id'],
    preLinguistic : this.fb.group({
      joinAttention: '',
      imitation:'',
      remarks:''
    }),

    linguistic : this.fb.group({
      lexicalItems: '',
      advancedConcepts:'',
      syntacticStructures:'',
      pragmaticSkills:'',
      remarks:''
    }),

    communication : this.fb.group({
      functional: '',
      gestrual:'',
      aac:'',
      assistive:'',
      remarks:''
    }),

    cognition : this.fb.group({
      basicSkills: '',
      advancedSkills:'',
      remarks:''
    }),

    play : this.fb.group({
      parallel: '',
      symbolic:'',
      constructive:'',
      pretend:'',
      physical: '',
      exploratory:'',
      sensoryStimulating:'',
      associative:'',
      onlooker:'',
      remarks:''
    }),

    articulation : this.fb.group({
      auditoryDescrimination: '',
      phonology:'',
      placement:'',
      generalization:'',
      wordLevel: '',
      phraseLevel:'',
      remarks:''
    }),

    oroMotor : this.fb.group({
      opt: '',
      hypoSensitive:'',
      mixedSensitive:'',
      hyperSensitive:'',
      sucking:'',
      blowing: '',
      chewing:'',
      remarks:''
    }),

    fluency : this.fb.group({
      fluencyShaping: '',
      fluencyModification:'',
      generalization:'',
      maintenance:'',
      remarks:''
    }),

    voice : this.fb.group({
      respiratory: '',
      resonance:'',
      pitch:'',
      loudness:'',
      relaxationExercises: '',
      strengtheningExercises:'',
      remarks:''
    })
  })

  stDataForm = this.fb.group({
    id : '',
    stDatas : this.fb.array([])
  })

  constructor(private fb: FormBuilder , private _snackBar: MatSnackBar, private therapistService: TherapistService,
    private activatedRoute: ActivatedRoute, private adminService : AdminService, private router: Router,
    private location: Location) { }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

  ngOnInit(): void {
    this.getUser()
    this.getWallet()
  

  }

  submitButtonState = false;
  async ngOnDestroy(){
    if(this.submitButtonState == false){
      await this.onSubmit();
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
    this.adminS?.unsubscribe();
  }

  keys =[
    {name:'Poor',value:'1'},
    {name:'Some Attempt',value:'2'},
    {name:'Emerging',value:'3'},
    {name:'Good',value:'4'},
    {name:'Excellent',value:'5'}
  ]

  oroKeys =[
    {name : 'Yes'},
    {name : 'No'}
  ]

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

  session : any[] = [];
  clientId : any
  wallet : Wallet
  sessionMaster : any
  sessionS: Subscription;
  sessionMS: Subscription;
  walletS: Subscription;
  getWallet(){
    this.sessionS = this.adminService.getSession().
    pipe(map((session:Session[])=>session.filter((x)=>x._id==this.activatedRoute.snapshot.params['sessionId']))).
    subscribe((y)=>{
      if(y.length === 0){
        this.sessionS = this.adminService.getLeaveSession().
        pipe(map((session:LeaveSession[])=>session.filter((x)=>x._id==this.activatedRoute.snapshot.params['sessionId']))).
        subscribe((y)=>{
          if(y.length === 0){
            this.sessionS = this.therapistService.getCompensation().
            pipe(map((session:CompensationSession[])=>session.filter((x)=>x._id==this.activatedRoute.snapshot.params['sessionId']))).
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
        this.sessionMS = this.therapistService.getSessionMasterbyId(this.activatedRoute.snapshot.params['id']).subscribe((res)=>{
          this.sessionMaster = res
        })
      })
    })
  }

  st: any;
  stData: StSessionData[] = [];
  submitS: Subscription;
  cashOutS: Subscription;
  submit: Subscription;

  isNextStepEnabled: boolean = false;


  onSubmit(){
    this.isNextStepEnabled = true;

    this.submitS = this.therapistService.saveStForm(this.stSessionForm.getRawValue()).subscribe((res)=>{
      this.st = res;
      this.stData = this.st


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
            sessionMasterId : this.activatedRoute.snapshot.params['id']
          }
          this.cashOutS = this.adminService.addCashOut(this.clientId, data).subscribe((res)=>{
            let feeData = {
              sessionMasterId: this.activatedRoute.snapshot.params['id'],
              sessionType: this.sessionMaster.sessionStatus,
              recievedBy: this.userId,
              collectedAmount: amountPayed,
              paymentMode: 'Wallet',
              remarks: 'Deducted from Wallet',
              amountToBeCollected: amountPayed,
              dateAndTime: this.sessionMaster.date
            }
            this.submit = this.adminService.payFees(feeData).subscribe((res)=>{
              // this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.st.session_master_id)
              // this.updateFeeStatus(data,this.route.snapshot.params['id'])
            })
            },(error=>{
              console.log(error)
              alert(error)
            }))
        }else{
          // this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.st.session_master_id)
          // this._snackBar.open("Submitted","" ,{duration:3000})
        }
      }else{
        // this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.st.session_master_id)
      }
      this.clearControls()
   },(error=>{
    alert(error)
    }))
  }

  feeS: Subscription;
  updateFeeStatus(data : any, id : String){
    this.feeS = this.adminService.updateFeeStatus(data,id).subscribe((status)=>{
    })
  }

  clearControls(){
    this.stSessionForm.reset()
    this.stSessionForm.setErrors(null)
    Object.keys(this.stSessionForm.controls).forEach(key=>{this.stSessionForm.get(key).setErrors(null)})
  }



  // constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
  //   private activatedRoute: ActivatedRoute, private _http: AdminService, private router: Router, private dialog: MatDialog) {}

  // ngOnInit(): void {
  //   this.getClient()
  //   this.getCategory()
  // }

  // submitButtonState = false;
  // async ngOnDestroy(){
  //   this.clientSub?.unsubscribe();
  //   this.catSub?.unsubscribe();
  //   this.submit?.unsubscribe();
  // }

  // --------activity--------------------
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

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

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


    // onToggleChange(event: any) {
    //   this.toggleStatus = event.checked;

 
    //   const activityDetailsArray = this.activityForm.get('activityDetails') as FormArray;

   
    //   if (activityDetailsArray && activityDetailsArray.length === 0) {
    //     this.activityForm.get('activityStatus')?.setValue('Nothing Assigned');
    //   } else if (!this.toggleStatus) {

    //     this.activityForm.get('activityStatus')?.setValue('Assigned');
    //   } else {

    //     this.activityForm.get('activityStatus')?.setValue('Completed');
    //   }
    // }

    onToggleChange(event: any) {
      this.toggleStatus = event.checked;
    
      if (this.toggleStatus) {
        this.activityForm.get('activityStatus')?.setValue(true); // Set as true for Completed
      } else {
        const activityDetailsArray = this.activityForm.get('activityDetails') as FormArray;
        if (activityDetailsArray && activityDetailsArray.length === 0) {
          this.activityForm.get('activityStatus')?.setValue(false); // Set as false for Nothing Assigned
        } else {
          this.activityForm.get('activityStatus')?.setValue(false); // Set as false for Assigned
        }
      }
    }
    
    




  eachActivityToggle :boolean = false;
  onNewActivityToggleChange(event: any, index: number) {
    const formGroup = this.activity().at(index) as FormGroup;
    if (formGroup) {
      // Check if the toggle is checked
      if (event.checked) {
        formGroup.get('status')?.setValue('Done');
      } else {
        formGroup.get('status')?.setValue('No');
      }
    }
  }





}
