import { CashOut } from './../../../../admin/models/wallet';

import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { Session } from 'src/app/Modules/admin/models/session';
import { SeGoal } from '../../../models/seGoal';
import { SessionMaster } from '../../../models/sessionMaster';
import { TherapistService } from '../../../therapist.service';
import { Wallet } from 'src/app/Modules/admin/models/wallet';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { User } from 'src/app/Modules/admin/models/user';
import { AddGoalSeComponent } from '../add-goal-se/add-goal-se.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-se-session-data',
  templateUrl: './se-session-data.component.html',
  styleUrls: ['./se-session-data.component.scss']
})
export class SeSessionDataComponent implements OnInit, OnDestroy {
  seSessionForm = this.fb.group({
    session_master_id : this.activatedRoute.snapshot.params['id'],
    seDatas: this.fb.array([])
  });

  constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private _http: AdminService, private router: Router, private dialog: MatDialog) {}

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

  ngOnInit(): void {
    this.getSessionMaster()
    this.getWallet()
    this.getUser()
  }

  submitButtonState = false;
  async ngOnDestroy(){
    if(this.submitButtonState == false){
      await this.onSubmit();
    }
    if(this.cashOutS){
      this.cashOutS.unsubscribe();
    }
    if(this.feeS){
      this.feeS.unsubscribe();
    }
    if(this.goalSS){
      this.goalSS.unsubscribe();
    }
    this.sessionS?.unsubscribe();
    this.sessionMS?.unsubscribe();
    this.walletS?.unsubscribe();
    this.sMS?.unsubscribe();
    this.clientS?.unsubscribe();
    this.goalS?.unsubscribe();
    this.adminS?.unsubscribe();
    this.submit?.unsubscribe();
  }
  seGoals : SeGoal[] = [];

  seSessionData()  {
    return this.seSessionForm.get("seDatas") as FormArray
  }

  newSeData() {
    return this.fb.group({
      goal: '',
      activities: '',
      response: '',
      notes: '',
      status: false
    })
  }

  addGoal() {
    this.seSessionData().push(this.newSeData());
  }

  removeGoal(i:number) {
    this.seSessionData().removeAt(i);
  }

  user : any
  therapist : User[] = []
  currentUser : any
  userId : String
  adminS: Subscription;
  getUser(){
    let token = localStorage.getItem('token')
      this.user = JSON.parse(token)?.username

      this.adminS = this._http.getTherapist().subscribe((res)=>{
        this.therapist = res

        this.currentUser = this.therapist.find(x => x.name == this.user)

        if(this.currentUser){
          this.userId = this.currentUser._id
        }
      })
  }

  sM : any;
  sessionM : SessionMaster[] = [];
  sessionId :any;
  c : any;
  client : Client[] = [];
  clientId : any;
  sMS: Subscription;
  clientS: Subscription;
  goalS: Subscription;
  getSessionMaster(): void{
    this.sMS = this.therapistService.getSessionMaster().pipe(map((session:SessionMaster[])=>session.filter((x)=>x._id==this.activatedRoute.snapshot.params['id']))).
    subscribe(async (y)=>{
      this.sM = y
      //wait this.getSessionId(y[0].session_id._id)
      this.sessionM = this.sM
      if(this.sessionM[0].session_id){
        this.clientId = this.sessionM[0].session_id.clientName
        this.sessionId = y[0].session_id._id
      }else if(this.sessionM[0].leave_session_id){
        this.clientId = this.sessionM[0].leave_session_id.clientName
        this.sessionId = y[0].leave_session_id._id
      }else if(this.sessionM[0].compensation_session_id){
        this.clientId = this.sessionM[0].compensation_session_id.clientName
        this.sessionId = y[0].compensation_session_id._id
      }

      this.clientS = this._http.getClients().pipe(map((client:Client[])=>client.filter((x)=>x._id==this.clientId))).subscribe((y)=>{
        this.c = y
        this.client = this.c
      })

      this.goalS = this.therapistService.filteredSeGoalBySessionId(this.sessionId).subscribe((goal)=>{
        this.seGoals = goal;
      })
    })
  }


  session : any[] = [];
  clientIdWallet : any
  wallet : Wallet
  sessionMaster : any
  sessionS: Subscription;
  sessionMS: Subscription;
  walletS: Subscription;
  getWallet(){
    this.sessionS = this._http.getSession().
    pipe(map((session:Session[])=>session.filter((x)=>x._id==this.activatedRoute.snapshot.params['sessionId']))).
    subscribe((y)=>{
      if(y.length === 0){
        this.sessionS = this._http.getLeaveSession().
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
      this.walletS = this._http.getWalletByClient(this.clientId).subscribe((res)=>{
        this.wallet = res

        //get session master
        this.sessionMS = this.therapistService.getSessionMasterbyId(this.activatedRoute.snapshot.params['id']).subscribe((res)=>{
          this.sessionMaster = res
        })
      })
    })
  }



  se: any;
  submitS: Subscription;
  cashOutS: Subscription;
  submit: Subscription;
  onSubmit(){
    this.submitButtonState = true;
    this.submitS = this.therapistService.saveSeForm(this.seSessionForm.getRawValue()).subscribe((res)=>{
      this.se = res;

      let data = {status : this.se.seDatas[0].status}
      this.updateSeGoalStatus(data, this.se.seDatas[0].goal)

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
          this.cashOutS = this._http.addCashOut(this.clientId, data).subscribe((res)=>{
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
              this.submit = this._http.payFees(feeData).subscribe((res)=>{
                this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.se.session_master_id)
                // this.updateFeeStatus(data,this.route.snapshot.params['id'])
              })
            },(error=>{
              alert(error)
            }))
        }else{
          this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.se.session_master_id)
        }
      }else{
        this.router.navigateByUrl('/therapist/viewcompletedsessions/addtask/' + this.se.session_master_id)
      }

      this._snackBar.open("Submitted","" ,{duration:3000})
      //this.clearControls()
   },(error=>{
    alert(error)
  }))
  }

  goalSS: Subscription;
  updateSeGoalStatus(data,id){
    this.therapistService.updateSeGoalStatus(data,id).subscribe((status)=>{
    })
  }

  feeS: Subscription;
  updateFeeStatus(data : any, id : String){
    this._http.updateFeeStatus(data,id).subscribe((status)=>{
    })
  }

  clearControls(){
    this.seSessionForm.get('seDatas').reset()
    this.seSessionForm.setErrors(null)
    Object.keys(this.seSessionForm.controls).forEach(key=>{this.seSessionForm.get(key).setErrors(null)})
  }

  addSeGoal(){
    const dialogRef = this.dialog.open(AddGoalSeComponent, {
      data: { status: "true", sessionId: this.sessionId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSessionMaster();
    });
  }
}

