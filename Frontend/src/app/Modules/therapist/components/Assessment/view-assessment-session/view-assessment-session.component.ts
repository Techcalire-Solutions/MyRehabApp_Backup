import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { Client } from 'src/app/Modules/admin/models/client';
import { Session } from 'src/app/Modules/admin/models/session';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { EndAssessmentDialogueComponent } from '../../Home2/end-assessment-dialogue/end-assessment-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';

@Component({
  selector: 'app-view-assessment-session',
  templateUrl: './view-assessment-session.component.html',
  styleUrls: ['./view-assessment-session.component.scss']
})
export class ViewAssessmentSessionComponent implements OnInit, OnDestroy {

  sessionColumns: string[] = ['slotName', 'clientName','therapistName','status','manage'];


  therapist : any;
  constructor(private fb: FormBuilder, public authService:AuthService, private _http:AdminService, private therapistService: TherapistService,
    private _snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private activatedRoute: ActivatedRoute) {
      let token = localStorage.getItem('token')
      this.therapist = JSON.parse(token)?.username
  }
  ngOnDestroy(): void {
    this.sessionS.unsubscribe();
  }

  sessionSubscription: Subscription;
  ngOnInit(): void {
     this.getSessions();
  }

  weekDays =[
    {name: 'Sunday', abbreviation: 'SUN'},
    {name: 'Monday', abbreviation: 'MON'},
    {name: 'Tuesday', abbreviation: 'TUE'},
    {name: 'Wednesday', abbreviation: 'WED'},
    {name: 'Thursday', abbreviation: 'THU'},
    {name: 'Friday', abbreviation: 'FRI'},
    {name: 'Saturday', abbreviation: 'SAT'},
  ];

  clients : Client[] = [];
  viewClient(id){
      let client = this.clients.find((x)=>{
      return  x._id === id;
    })
    this.router.navigateByUrl('therapist/clientinfo/' +id)
  }

  sessions : any[] = [];
  sessionS : Subscription;
  getSessions(){
    this.sessionS = combineLatest(
      this._http.getAssessmentSession()
      .pipe(map((x: Assessment[]) =>
          x.filter((y) => y.status === false )
        )
      ),
      this._http.getLeaveSession().pipe(
        map((x: LeaveSession[]) =>
          x.filter((y) => y.sessionType === 'Assessment' )
        )
      ),
      this.therapistService.getCompensation().pipe(
        map((x: CompensationSession[]) =>
          x.filter((y) => y.sessionType === 'Assessment' )
        )
      )
      ).subscribe(([s, z, x]) => {

        this.sessions = [...s, ...z, ...x];
        this.selectedSessions = this.sessions
        this.filtered = this.selectedSessions
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;

    if (this.filterValue) {
      this.filtered = this.selectedSessions.filter(element => {
        return (
          element.clientName.firstName.toLowerCase().includes(filterValue) ||
          element.clientName.emergencyNumber.toString().includes(filterValue) ||
          element.therapistName.name.toLowerCase().includes(filterValue) ||
          element.slotName.slotName.toLowerCase().includes(filterValue)
        );
      });
    } else {
      this.getSessions();
    }
  }

  selectedSessions : Assessment[] = [];
  getSessionByDay(weekDay: any){
    this.selectedSessions = this.sessions.filter(x=>x.slotName.weekDay == weekDay)
    this.filtered = this.selectedSessions
  }

  dailySession(id){
        this.router.navigateByUrl('therapist/dailysessiondata/'+id)
  }

  completeAssessment(clientId: string, slotId:string, sessionId: string){
    const dialogRef = this.dialog.open(EndAssessmentDialogueComponent, {
      width: '600px',
      data: {
        assessmentId : sessionId,
        slotId : slotId,
        clientId : clientId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getSessions()
    })
  }
}


