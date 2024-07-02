import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Session } from 'src/app/Modules/admin/models/session';
import { OtSessionData } from '../../../models/otSessionData';
import { TherapistService } from '../../../therapist.service';
import { Wallet } from 'src/app/Modules/admin/models/wallet';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { User } from 'src/app/Modules/admin/models/user';

@Component({
  selector: 'app-ot-session-data',
  templateUrl: './ot-session-data.component.html',
  styleUrls: ['./ot-session-data.component.scss']
})
export class OtSessionDataComponent implements OnInit, OnDestroy {

otSessionForm = this.fb.group({
  session_master_id : this.activatedRoute.snapshot.params['id'],
  sensoryModulation : this.fb.group({
    threshold :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    arousal :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    })
  }),
  proprioceptiveDiscrimination : this.fb.group({
    remarks: '',
    key:'',
    prompt:''
  }),
  vestibularDiscrimination  : this.fb.group({
    remarks: '',
    key:'',
    prompt:''
  }),
  tactileDiscrimination : this.fb.group({
    toolManipulation :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    visionOccluded :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    })
  }),
  visual : this.fb.group({
    acuity :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    eyeStrain :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    quickLocalisation :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    generalEyeMovements :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    dissociation :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    perceptual :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    })
  }),
  postural : this.fb.group({
    muscleTone :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    reflex :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    endurance :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    posturalControl :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    gait :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    })
  }),
  bilateralIntegration : this.fb.group({
    midlineCrossing :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    symmetrical :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    asymmetrical :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    reciprocal :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    })
  }),
  praxis : this.fb.group({
    ideation :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    motorPlanning :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    execution :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    })
  }),
  grossMotor : this.fb.group({
    remarks: '',
    key:'',
    prompt:''
  }),
  fineMotor : this.fb.group({
    strength :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    grip :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    isolationWrist :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    isolationFingers :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    })
  }),
  auditoryAndLanguage : this.fb.group({
    articulation :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
    followingInstructions :this.fb.group({
      remarks: '',
      key:'',
      prompt:''
    }),
  }),
  adl : this.fb.group({
    remarks: '',
    key:'',
    prompt:''
  }),
  emotional : this.fb.group({
    remarks: '',
    key:'',
    prompt:''
  }),
})

  keys =[
    {name:'Maximal Support',value:'20'},
    {name:'Moderate Support',value:'40'},
    {name:'Min Support / More Inconsistency',value:'60'},
    {name:'Min Support / Less Inconsistency',value:'80'},
    {name:'Mastered',value:'100'}
  ]

  prompts = [
    {name:'Full physical',value:'1'},
    {name:'Partial Physical',value:'2'},
    {name:'Model',value:'3'},
    {name:'Visual',value:'4'},
    {name:'Verbal',value:'5'},
    {name:'Gestural',value:'6'},
    {name:'Natural Cue',value:'7'}
  ]

  constructor(private fb: FormBuilder, private therapistService: TherapistService,private _snackBar: MatSnackBar,
     private activatedRoute: ActivatedRoute, private adminService : AdminService, private router: Router) { }

     @HostListener('window:beforeunload', ['$event'])
     unloadNotification($event: any): void {
       this.onSubmit();
     }
  // user :any;
  isEdit = false;
  roomId : '';
  ot: any;
  submitButtonState = false;

  otData : OtSessionData[]= []

  ngOnInit(): void {
    this.getWallet()
    this.getUser();
  }


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

  submitS: Subscription;
  cashOutS: Subscription;
  onSubmit(){
    this.submitButtonState = true;
    this.submitS = this.therapistService.saveOtForm(this.otSessionForm.getRawValue()).subscribe((res)=>{
      this.ot = res;
      this.otData = this.ot
      this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.ot.session_master_id)
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
            sessionMasterId : this.activatedRoute.snapshot.params['id']
          }

          this.cashOutS = this.adminService.addCashOut(this.clientId, data).subscribe((res)=>{
            let feeData = {
              sessionMasterId: this.activatedRoute.snapshot.params['id'],
              sessionType: this.sessionMaster.sessionStatus,
              recievedBy: this.sessionMaster.session_id.therapistName._id,
              collectedAmount: amountPayed,
              paymentMode: 'Wallet',
              remarks: 'Amount deducted from Wallet',
            }

              this.adminService.payFees(feeData).subscribe((res)=>{
                let data = {feeStatus : true}
                this.updateFeeStatus(data,this.activatedRoute.snapshot.params['id'])
              })
            },(error=>{
              console.log(error)
              alert(error)
            }))
        }else{
          this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.ot.session_master_id)
        }
      }else{
        this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.ot.session_master_id)
      }
      this.clearControls()
   },(error=>{
    console.log(error)
    alert(error)
    }))
  }

  feeS: Subscription;
  updateFeeStatus(data : any, id : String){
    this.adminService.updateFeeStatus(data,id).subscribe((status)=>{})
  }

  clearControls(){
    this.otSessionForm.reset()
    this.otSessionForm.setErrors(null)
    Object.keys(this.otSessionForm.controls).forEach(key=>{this.otSessionForm.get(key).setErrors(null)})
  }

}

