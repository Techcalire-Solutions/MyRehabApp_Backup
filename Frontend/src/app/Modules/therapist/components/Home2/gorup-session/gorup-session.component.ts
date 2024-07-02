import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { Client } from 'src/app/Modules/admin/models/client';
import { Room } from 'src/app/Modules/admin/models/room';
import { Session } from 'src/app/Modules/admin/models/session';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/auth/models/User';
import { TherapistService } from '../../../therapist.service';
import { EndSessionDialogueComponent } from '../end-session-dialogue/end-session-dialogue.component';
import { GroupSession } from 'src/app/Modules/admin/models/groupSession';
import { GroupSessionDialogComponent } from '../group-session-dialog/group-session-dialog.component';
import { GroupMaster } from '../../../models/groupMaster';

@Component({
  selector: 'app-gorup-session',
  templateUrl: './gorup-session.component.html',
  styleUrls: ['./gorup-session.component.scss']
})
export class GorupSessionComponent implements OnInit {

  dailySessionForm = this.fb.group({
  });

  displayedColumns: string[] = ['date', 'session_id','manage'];


  assessments : Assessment[] = [];
  rooms: Room []=[]

  selectedSessions: Session []=[]
  clients: Client []=[]


  therapist : any;
  datepipe: any;

  constructor(private fb: FormBuilder ,private adminService:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    private router: Router,  public authService:AuthService, private therapistService: TherapistService, public dialog:MatDialog,
    private datePipe: DatePipe) {
      let token = localStorage.getItem('token')
      this.therapist = JSON.parse(token)?.username
  }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
    this.groupSub.unsubscribe();
    this.clientSub.unsubscribe();
    this.groupSub.unsubscribe();
  }

  id : any;
  therapyabbreviation: String;
  currentTherapist: User[]=[]
  infoSubscription: Subscription;
  clientSub: Subscription;
  ngOnInit(): void {

    this.id =(this.activatedRoute.snapshot.params['id'])

    this.infoSubscription = this.getInfo()
    this.getGroupMaster()

    this.clientSub = this.adminService.getClients().subscribe((clients)=>{
      this.clients = clients
    })
  }

  clearControls(){
    this.dailySessionForm.reset()
  }

  session: GroupSession[]=[];
  leaveSessionStart = false;
  clientId : any;
  getInfo(){
    return this.adminService.getGroupSession().pipe(map((session:GroupSession[])=>session
    .filter((x)=>x._id == this.id)
    )).subscribe((y)=>{
        this.session = y
    })
  }

  viewClient(id: String){
     let client = this.clients.find((x)=>{
     return  x._id === id;
    })
    this.router.navigateByUrl('therapist/clientinfo/' +id)
  }

  sessionMasteId : any;
  concession : any
  startSession(id: String){
    const dialogRef = this.dialog.open(GroupSessionDialogComponent, {
      width: '500px',
      data: {
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getGroupMaster()
    })
  }

  groupSub: Subscription;
  groupMaster:GroupMaster[]
  sessionCount: GroupMaster[]
  getGroupMaster(){
    this.groupSub = this.adminService.getGroupMaster().subscribe(res=>{
      this.groupMaster = res;

      let currentDate = this.datePipe.transform(Date.now(), 'yyyy/MM/dd')

      this.sessionCount = this.groupMaster.filter(x=>{
        let sessionDate = this.datePipe.transform(x.date,'yyyy/MM/dd')
        return sessionDate == currentDate 
      })
    })
  }

  getData(id: string){
    this.router.navigateByUrl('/therapist/viewgroupsession/' + id);
  }

  endSession(){
    const dialogRef = this.dialog.open(EndSessionDialogueComponent, {
      width: '600px',
      data: {
        sessionId : this.activatedRoute.snapshot.params['id'],
        slotId : this.session[0].slotName,
        clientId : this.session[0].clientName
      }
    });
  }
}
