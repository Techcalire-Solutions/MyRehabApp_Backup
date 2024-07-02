import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { Category } from 'src/app/Modules/admin/models/category';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { Leaves } from 'src/app/Modules/admin/models/leaves';
import { Room } from 'src/app/Modules/admin/models/room';
import { Session } from 'src/app/Modules/admin/models/session';
import { Slot } from 'src/app/Modules/admin/models/slot';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/auth/models/User';
import { AssessmentMaster } from 'src/app/Modules/therapist/models/assessmentMaster';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { ParentService } from '../../parent.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-parent-dashboard',
  templateUrl: './parent-dashboard.component.html',
  styleUrls: ['./parent-dashboard.component.scss']
})
export class ParentDashboardComponent implements OnInit {

  datePipe = new DatePipe('en-US')
  weekDay : String;
  date : any;
  userId : string;
  user : String;
  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar,
    public authService: AuthService, private therapistService: TherapistService, private parentService: ParentService) {
    let day = new Date().toLocaleString('default',{weekday:'long'})
    this.weekDay = day
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  }

  ngOnDestroy(): void {
    this.sessionSubscription.unsubscribe()
    this.assessmentSubscription.unsubscribe()
  }

  clientId: string;
  clientSub: Subscription;
  getClient(){
    this.clientSub = this.parentService.getClientLogin(this.userId).subscribe(client=>{
      this.clientId = client.clientId._id;
      this.sessionSubscription = this.getSessions()
      this.assessmentSubscription = this.getAssessments()
      this.taskSubscription = this.getTasks()
    })
  }

  categoryService$ : Observable<Category[]>
  therapistService$ : Observable<User[]>
  slotSubscription: Subscription;
  taskSubscription: Subscription;
  sessionSubscription: Subscription;
  clientSubscription: Subscription;
  assessmentSubscription: Subscription;
  leaveSubscription: Subscription;
  leaveSessionSubscription: Subscription;
  ngOnInit(): void {
    let token = localStorage.getItem('token')
    this.userId = JSON.parse(token)?.id
    this.user = JSON.parse(token)?.username
    this.getClient()
  }

  session : SessionMaster[] = [];
  sessionNumber : number
  getSessions(){
    return this.therapistService.getSessionMaster().subscribe((session)=>{
      this.session = session
      this.sessionNumber = this.session.filter(x=>
        (x.sessionStatus.toLowerCase() ==='session' && x.session_id.clientName._id === this.clientId) ||
        (x.sessionStatus.toLowerCase() ==='compensationsession' && x.compensation_session_id.clientName._id === this.clientId) ||
        (x.sessionStatus.toLowerCase() === 'leavesession' && x.leave_session_id.clientName._id === this.clientId)
        ).length
    })
  }

  tasks : Task[] = [];
  pending : number = 0;
  completed : number = 0;
  reviewedTasks: any = [];
  getTasks(){
    return this.parentService.getTask().subscribe((x)=>{
      this.tasks = x.filter(t=>t.sessionMasterId.session_id.clientName._id === this.clientId)
      for(let i=0; i<this.tasks.length;i++){
        this.pending = this.tasks[i].tasks.filter(t => t.status.toLowerCase() === 'pending' || t.status.toLowerCase() === 'openend').length
        this.completed = this.tasks[i].tasks.filter(t => t.status.toLowerCase() === 'done' || t.status.toLowerCase() === 'reviewed').length
        this.reviewedTasks = this.tasks[i].tasks.filter(t => t.status.toLowerCase() === 'reviewed')
      }
    })
  }

  isImageEnlarged: boolean[] = [];
  enlargeImage(index: number, isEnlarged: boolean): void {
    this.isImageEnlarged[index] = isEnlarged;
  }

  //tiles
  assessment : AssessmentMaster[] = [];
  assessmentNumber : number
  getAssessments(){
    return this.therapistService.getAssessmentMaster().subscribe((session)=>{
      this.assessment = session.filter(x=> x.assessment_id.clientName._id === this.clientId)
      this.assessmentNumber = this.assessment.length
    })
  }
}
