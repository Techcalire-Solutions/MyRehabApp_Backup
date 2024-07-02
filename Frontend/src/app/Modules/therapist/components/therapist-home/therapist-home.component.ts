import { filter } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin/admin.service';
//import { Category } from '../../models/category';
import { FormBuilder, Validators } from '@angular/forms';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Slot } from 'src/app/Modules/admin/models/slot';
import { Category } from 'src/app/Modules/admin/models/category';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/admin/models/user';
import { Session } from 'src/app/Modules/admin/models/session';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { Subscription, map, combineLatest, pipe } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Leaves } from 'src/app/Modules/admin/models/leaves';
import { Lmc } from 'src/app/Modules/admin/models/lmc';
import { TherapistService } from '../../therapist.service';


@Component({
  selector: 'app-therapist-home',
  templateUrl: './therapist-home.component.html',
  styleUrls: ['./therapist-home.component.scss']
})
export class TherapistHomeComponent implements OnInit {

  therapist: any;
  date: any;
  weekDay: any;
  constructor(private adminService: AdminService, private datePipe: DatePipe, private therapistService: TherapistService) {
    let token = localStorage.getItem('token')
    this.therapist = JSON.parse(token)?.username

    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    let day = new Date().toLocaleString('default',{weekday:'long'})
    this.weekDay = day
  }

  ngOnDestroy() {
    this.sessionSub.unsubscribe()
    this.assessmentSub.unsubscribe()
    this.sessionMasterSub.unsubscribe()
    this.assessmentMasterSub.unsubscribe()
    this.leaveSessionSub.unsubscribe()
    this.leaveSub.unsubscribe()
  }

  ngOnInit(): void {
    this.sessionSub = this.getSessions()
    this.assessmentSub = this.getAssessments()
    this.getLeaves()
    this.sessionMasterSub = this.getSessionMaster()
    this.assessmentMasterSub = this.getAssessmentMaster()
    this.leaveSessionSub = this.getLeaveSessions()
  }

  sessionSub : Subscription
  sessions : Session[] = [];
  selectedSessions : Session[] = [];
  sessionCount: number = 0;
  getSessions(){
    return this.adminService.getSession()
    .pipe(map((session : Session[])=>session.filter((y)=>
            y.slotName.weekDay==this.weekDay).filter((thp)=>{
            return thp.therapistName.name == this.therapist})
      )).subscribe((x)=>{
        this.sessions = x;

        this.selectedSessions = this.sessions.filter(x => x.status == false)
        this.sessionCount = this.selectedSessions.length
      })
  }

  assessments: Assessment[] = []
  assessmentCount: number = 0;
  assessmentSub: Subscription;
  getAssessments(){
    return this.adminService.getAssessmentSession()
    .pipe(map((assessment : Assessment[])=>assessment
    .filter((y)=> this.datePipe.transform(y.assessmentDate, 'yyyy-MM-dd') == this.date)
    .filter((thp)=>{ return thp.therapistName.name == this.therapist
    }))).subscribe((x)=>{
        this.assessments = x;
        this.assessmentCount = this.assessments.length;
      })
  }

  leaveSub : Subscription;
  leave : any[] = [];
  leaveCount : number = 0;
  getLeaves(){
    this.leaveSub = combineLatest(
      this.adminService.getLeave().pipe(
        map((x: Leaves[]) =>
          x.filter((y) => this.datePipe.transform(y.fromDate, 'yyyy-MM-dd')<= this.date &&
                          this.datePipe.transform(y.toDate, 'yyyy-MM-dd')>= this.date)

        )
      ),
      this.adminService.getLmc()
      .pipe(map((x: Lmc[]) =>
          x.filter((y) => this.datePipe.transform(y.date, 'yyyy-MM-dd') == this.date)
        )
      )
    ).subscribe(([s, z]) => {

      const pending = [...s, ...z];
      this.leave = pending
      this.leaveCount = this.leave.length
    })
  }

  sessionMasterSub: Subscription;
  completedSessionCount: number = 0;
  getSessionMaster(){
    return this.therapistService.getSessionMaster()
    .pipe(map((x) => x.filter(s => s.therapistName === this.therapist &&
                                  this.datePipe.transform(s.date, 'yyyy-MM-dd') == this.date
                              )))
    .subscribe((res)=>{
      this.completedSessionCount = res.length
    })
  }

  assessmentMasterSub: Subscription;
  completedAssessmentCount: number = 0;
  getAssessmentMaster(){
    return this.therapistService.getAssessmentMaster()
    .pipe(map((x) => x.filter(s => s.therapistName === this.therapist &&
                                  this.datePipe.transform(s.date, 'yyyy-MM-dd') == this.date
                              )))
    .subscribe((res)=>{
      this.completedAssessmentCount = res.length
    })
  }

  leaveSessionSub: Subscription;
  leaveSessionCount: number = 0;
  getLeaveSessions(){
    return this.adminService.getLeaveSession()
    .pipe(map((x)=> x.filter(s=>
                             s.therapistName.name == this.therapist &&
                             this.datePipe.transform(s.assessmentDate, 'yyyy-MM-dd') == this.date)))
    .subscribe((res)=>{
      this.leaveSessionCount = res.length
    })
  }
}
