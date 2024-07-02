import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { Session } from 'src/app/Modules/admin/models/session';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/auth/models/User';
import { TherapistService } from '../../therapist.service';
import { DatePipe } from '@angular/common';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { Slot } from 'src/app/Modules/admin/models/slot';
import { GroupSession } from 'src/app/Modules/admin/models/groupSession';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { Leaves } from 'src/app/Modules/admin/models/leaves';
import { TherapistLeave } from '../../models/therapistLeave';
import { Fees } from '../../models/fees';
import { AssessmentMaster } from '../../models/assessmentMaster';

@Component({
  selector: 'app-therapist-daily-session',
  templateUrl: './therapist-daily-session.component.html',
  styleUrls: ['./therapist-daily-session.component.scss']
})
export class TherapistDailySessionComponent implements OnInit, OnDestroy {

  datePipe = new DatePipe('en-US')

  assessmentColumns: string[] = ['slotName', 'clientName','manage'];
  sessionColumns: string[] = ['slotName', 'clientName','manage'];
  leaveColumns: string[] = ['slotName', 'clientName','therapistName','sessionType','manage'];

  weekDay : String;
  date : any;
  therapist : any;
  therapistId : string;
  constructor(private fb: FormBuilder, public authService:AuthService, private _http:AdminService, private therapistService: TherapistService, private _snackBar: MatSnackBar, private router: Router) {
    let day = new Date().toLocaleString('default',{weekday:'long'})
    this.weekDay = day
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    let token = localStorage.getItem('token')
    this.therapist = JSON.parse(token)?.username
    this.therapistId = JSON.parse(token)?.id
  }

  ngOnDestroy(): void {
    this.assessmentSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
    this.leaveSubscripion?.unsubscribe();
    this.groupSub?.unsubscribe();
    this.compSub?.unsubscribe();
    this.leaveSub?.unsubscribe();
    if(this.sessionS){
      this.sessionS.unsubscribe();
    }
    if(this.aSessionS){
      this.aSessionS.unsubscribe();
    }
    this.feesSub?.unsubscribe();
    this.assessmentMS?.unsubscribe();
  }

  assessmentSubscription: Subscription;
  sessionSubscription: Subscription;
  leaveSubscripion: Subscription;
  groupSub: Subscription;
  compSub: Subscription;
  leaveSub: Subscription;
  ngOnInit(): void {
    this.getAssessmentSessions();
    this.getSessions();
    this.getLeaveSessions();
    this.getGroupSessions();
    this.getCompensationSessions();
    this.getTherapistLeave();
    this.getFees();
    this.getCategory();
  }

  catSub: Subscription;
  therapyabbreviation: String;
  getCategory(){
    this.catSub = this._http.getTherapistById(this.therapistId).subscribe(res=>{
      this.therapyabbreviation = res.therapyCategory.abbreviation
    })
  }

  assessments : Assessment[] = [];
  wlSub: Subscription;
  getAssessmentSessions(){
    this.assessmentSubscription = this._http.getAssessmentSession().pipe(map((assessment : Assessment[])=>assessment.filter((y)=>
    this.datePipe.transform(y.assessmentDate, 'yyyy-MM-dd') == this.date).filter((thp)=>{
      return thp.therapistName.name == this.therapist
    }))).subscribe((x)=>{
        this.assessments = x;
        for(let i = 0; i <this.assessments.length; i++){
          this.wlSub = this._http.getWlByAssessment(this.assessments[i]._id).subscribe(res=>{
            if (res) this.assessments[i]['wl'] = true; // Add a boolean variable to the session object
            else this.assessments[i]['wl'] = false; // Add a boolean variable to the session object
          })
        }
      })
  }

  sessions : Session[] = [];
  selectedSessions : Session[] = [];
  getSessions(){
    this.sessionSubscription =  this._http.getSession().pipe(map((session : Session[])=>session.filter((y)=>
    this.datePipe.transform(y.date, 'yyyy-MM-dd') == this.date).filter((thp)=>{
      return thp.therapistName.name == this.therapist})
      )).subscribe((x)=>{
        this.sessions = x;
        for(let i = 0; i <this.sessions.length; i++){
          this.wlSub = this._http.getWlBySession(this.sessions[i]._id).subscribe(res=>{
            if (res) this.sessions[i]['wl'] = true; // Add a boolean variable to the session object
            else this.sessions[i]['wl'] = false; // Add a boolean variable to the session object
          })
        }
        this.selectedSessions = this.sessions.filter(x=> x.status == false)
      })
  }

  leaveSession : LeaveSession[] = [];
  leaveSlot : Slot[] = [];
  getLeaveSessions(){
    this.leaveSubscripion = this._http.getLeaveSession().pipe(map((session : LeaveSession[])=>session.filter((y)=>
    this.datePipe.transform(y.assessmentDate, 'yyyy-MM-dd') == this.date).filter((thp)=>{
      return thp.therapistName.name == this.therapist
    }))).subscribe((x)=>{
        this.leaveSession = x;
      })
  }

  groupSessions : GroupSession[]=[];
  validSessions : GroupSession[]=[];
  completedSessions : GroupSession[]=[];
  getGroupSessions() {
    this.groupSub = this._http.getGroupSession().pipe(
      map(sessions =>
        sessions.filter(session =>
          session.slotName.weekDay === this.weekDay &&
          session.therapistName.some(therapist => therapist.therapistId.name === this.therapist)
        )
      )
    ).subscribe(s => {
      this.groupSessions = s;
    });
  }

  compensationSession : CompensationSession[] = [];
  compensationColumns: string[] = ['clientName','therapistName', 'slotName','sessionType','manage'];
  getCompensationSessions(){
    this.compSub = this.therapistService.getCompensation().pipe(map((session : CompensationSession[])=>session.filter((y)=>
    this.datePipe.transform(y.date, 'yyyy-MM-dd') == this.date).filter((thp)=>{
      return thp.therapistName.name == this.therapist
    }))).subscribe((x)=>{
        this.compensationSession = x;
      })
  }


  slotName: String
  sessionS: Subscription;
  dailySession(id){
    if(this.leave.length > 0){
      return alert('Therapist on leave')
    }
    this.sessionS = this._http.getSessionById(id).subscribe(res=>{


      this.slotName = res.slotName._id


      this._http.getLeaveSessionBySlotId(this.slotName).subscribe(res=>{
        if(this.datePipe.transform(res?.assessmentDate, 'yyyy-MM-dd') === this.date){
          return alert("Client is in Leave, please check for the leave sessions")
        }
        this.router.navigateByUrl('therapist/dailysessiondata/'+id)
      })
    })
  }

  groupSession(id){
    if(this.leave.length > 0){
      return alert('Therapist on leave')
    }
    this.router.navigateByUrl('therapist/groupsession/'+id)
  }

  fees : Fees
  feesSub: Subscription;
  getFees(){
    this.feesSub = this.therapistService.getFees().subscribe((res)=>{
      this.fees = res
    })
  }

  aSessionS: Subscription;
  assessmentMS: Subscription;
  sessionMasterId: String;
  assessementSession(id: String){
    if(this.leave.length > 0){
      return alert('Therapist on leave')
    }
    this.aSessionS = this._http.getAssessmentById(id).subscribe(res=>{
      this.slotName = res.slotName._id

      this._http.getLeaveSessionBySlotId(this.slotName).subscribe(res=>{

        if(this.datePipe.transform(res?.assessmentDate, 'yyyy-MM-dd') === this.date){
          return alert("Client is in Leave, please check for the leave sessions")
        }
        else{
          this.router.navigateByUrl('therapist/assessmentsessiondata/'+id)
        }
      })
    })
  }

  leaveSessionSession(id){
    if(this.leave.length > 0){
      return alert('Therapist on leave')
    }
    this.router.navigateByUrl('therapist/dailysessiondata/'+id)
  }

  leaveSessionAssessment(id){
    if(this.leave.length > 0){
      return alert('Therapist on leave')
    }
    this.router.navigateByUrl('therapist/assessmentsessiondata/'+id)
  }

  leave: TherapistLeave[] = [];
  getTherapistLeave(){
    this.leaveSub = this._http.getTherapistLeave().subscribe(data =>{
        this.leave = data.filter(leave =>{
          const id = leave.therapistId._id
          const status = leave.status
          const from = this.datePipe.transform(leave.fromDate, 'yyyy-MM-dd')
          const to = this.datePipe.transform(leave.toDate, 'yyyy-MM-dd')

          return id === this.therapistId && status.toLowerCase() != 'rejected' && status.toLowerCase() != 'requested'  &&
          from <= this.date && to >= this.date
        })
    })
  }
}


