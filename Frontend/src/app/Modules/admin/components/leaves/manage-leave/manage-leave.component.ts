import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';
import { Leaves } from '../../../models/leaves';
import { CalendarOptions,EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { AddLeaveDialogueComponent } from '../add-leave-dialogue/add-leave-dialogue.component';
import { EditLeaveDialogueComponent } from '../edit-leave-dialogue/edit-leave-dialogue.component';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddLeaveSessionDialogueComponent } from '../add-leave-session-dialogue/add-leave-session-dialogue.component';
import { LeaveSession } from '../../../models/leaveSession';
import { EditLeaveSessionDialogueComponent } from '../edit-leave-session-dialogue/edit-leave-session-dialogue.component';
import { Slot } from '../../../models/slot';
import { User } from '../../../models/user';
import { AddLmcDialogueComponent } from '../add-lmc-dialogue/add-lmc-dialogue.component';
import { Lmc } from '../../../models/lmc';
import { EditLmcDialogueComponent } from '../edit-lmc-dialogue/edit-lmc-dialogue.component';
import { LmcSessionComponent } from '../lmc-session/lmc-session.component';


@Component({
  selector: 'app-manage-leave',
  templateUrl: './manage-leave.component.html',
  styleUrls: ['./manage-leave.component.scss']
})
export class ManageLeaveComponent implements OnInit, OnDestroy {

  @ViewChild('fullcalendar', { static: true }) fullcalendar: any;

  leaveForm = this.fb.group({
    clientId : ['', Validators.required],
    fromDate : [''],
    toDate : ['']
  })

  constructor(private fb: FormBuilder, private adminService: AdminService, public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  displayedColumns : String[] = ['clientId', 'fromDate', 'toDate', 'slotId','action','manage']
  displayedColumnsLmc : String[] = ['clientId', 'date', 'slotId','action', 'manage']

  ngOnDestroy() {
    this.leaveSubscription.unsubscribe()
    this.leaveSessionSubscription.unsubscribe()
    this.lmcSubscription.unsubscribe()
    if(this.clientS){
      this.clientS.unsubscribe()
    }
    if(this.deleteLS){
      this.deleteLS.unsubscribe()
    }
    if(this.deleteS){
      this.deleteS.unsubscribe()
    }
    if(this.deleteLSS){
      this.deleteLSS.unsubscribe()
    }
  }


  leaveSessionSubscription : Subscription
  completedLeaveSessionSubscription : Subscription
  ngOnInit(): void {
    this.leaveSubscription = this.getLeaves()
    this.leaveSessionSubscription = this.getLeaveSessions()
    this.completedLeaveSessionSubscription = this.getLeaveSessionsCompleted()
    this.lmcSubscription = this.getLmc()
  }

  calendarEvents: EventInput[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: this.calendarEvents, // Placeholder for initial events
    eventDidMount: this.eventDidMount,
    displayEventTime: false
  };

  fromDate : any;
  toDate : any;
  clientName : any;
  clientS: Subscription;
  addEventDialogue(){
    const dialogRef = this.dialog.open(AddLeaveDialogueComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.clientS = this.adminService.getClientInfo(result.clientId).subscribe((client)=>{
          this.clientName = client.firstName
          this.fromDate = result.fromDate
          this.toDate = result.toDate

          const calendarApi = this.fullcalendar.getApi();
          const newEvent: EventInput = {
            title: this.clientName,
            start: this.fromDate,
            end: this.toDate
          };
        calendarApi.addEvent(newEvent);
        })
        this.getLmc()
        this.getLeaves()
      }
    })
  }

  date: any
  client : any;
  addLmcDialogue(){
    const dialogRef = this.dialog.open(AddLmcDialogueComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.clientS = this.adminService.getClientInfo(result.clientId).subscribe((client)=>{
          this.clientName = client.firstName
          this.date = result.date

          const calendarApi = this.fullcalendar.getApi();
          const newEvent: EventInput = {
            title: this.clientName,
            start: this.date,
          };
        calendarApi.addEvent(newEvent);
        })
        this.getLmc()
        this.getLeaves()
      }
    })
  }

  eventDidMount(info) {
    // Customize the background color of the event
    info.el.style.backgroundColor = info.event.backgroundColor;
    info.el.style.borderColor = info.event.borderColor;
    info.el.style.color = info.event.color;
  }

  leaveSubscription: Subscription;
  leaves: Leaves[] = [];
  slots: any[] = [];
  getLeaves() {
    return this.adminService.getLeave().subscribe((res: any[]) => {
      let leave = res.filter(leave => leave.status.toLowerCase() != 'requested');
      this.leaves = res

      this.calendarEvents = leave.map(event => ({
        title: event.clientId.firstName,
        start: event.fromDate,
        end: event.toDate,
        backgroundColor: 'red',
        borderColor: 'red',
        color: 'white'
      }));

      this.renderCalendarEvents();
    }, error => {
      console.error('Error fetching leaves from MongoDB:', error);
    });
  }

  approveLeave(id: string) {
    let data: any = {
      status: 'Accepted',
    };
    this.adminService.updateLeaveStatus(data,id).subscribe((res) => {
      let task = res;
      this.getLeaves();
    });
  }

  rejectLeave(id: any) {
    let data: any = {
      status: 'Rejected',
    };
    this.adminService.updateLeaveStatus( data,id).subscribe((res) => {
      let task = res;
      this.getLeaves();
    });
  }

  lmcSubscription: Subscription;
  lmc: Lmc[] = [];
  slotId: any;
  getLmc() {
    return this.adminService.getLmc().subscribe((res: any[]) => {
      this.lmc = res;
      console.log(this.lmc);
      const lmcEvents = res.map(event => ({
        title: event.clientId.firstName,
        start: event.date,
        backgroundColor: 'orange',
        borderColor: 'orange'
      }));
      this.calendarEvents = this.calendarEvents.concat(lmcEvents);

      this.renderCalendarEvents();
    }, error => {
      console.error('Error fetching LMC events from MongoDB:', error);
    });
  }

  renderCalendarEvents() {
    const calendarApi = this.fullcalendar?.getApi();
    calendarApi.removeAllEvents(); // Clear existing events from the calendar
    for (let i = 0; i < this.calendarEvents.length; i++) {
      calendarApi.addEvent(this.calendarEvents[i]);
    }
  }


  editLeave(id: String){
    const dialogRef = this.dialog.open(EditLeaveDialogueComponent, {
      width: '500px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.getLeaves()
        this.getLmc()
      }
    })
  }

  editLmc(id: String){
    const dialogRef = this.dialog.open(EditLmcDialogueComponent, {
      width: '500px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.getLeaves()
        this.getLmc()
      }
    })
  }

  deleteS: Subscription;
  deleteLeave(id: String){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this.deleteS = this.adminService.deleteLeave(id).subscribe((user)=>{
          this.getLeaves()
          this._snackBar.open("Leave deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  // editLmc(id: String){
  //   const dialogRef = this.dialog.open(EditLeaveDialogueComponent, {
  //     width: '500px',
  //     data: {id: id}
  //   });
  //   dialogRef.afterClosed().subscribe(result =>{
  //     if(result){
  //       this.getLeaves()
  //       this.getLmc()
  //     }
  //   })
  // }

  deleteLS:Subscription;
  deleteLmc(id: String){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this.deleteLS = this.adminService.deleteLmc(id).subscribe((user)=>{
          this.getLeaves()
          this.getLmc()
          this._snackBar.open("LMC deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })

  }

  addLeaveSession(id : string) {
    const dialogRef = this.dialog.open(AddLeaveSessionDialogueComponent, {
      width: '500px',
      data: {
        id : id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getLeaveSessions()
    })
  }

  addLmcSession(id : string) {
    const dialogRef = this.dialog.open(LmcSessionComponent, {
      width: '500px',
      data: {
        id : id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getLeaveSessions()
    })
  }



  displayedColumnsLeaveSession: string[] = ['date', 'slotName','clientName', 'therapistName', 'sessionType', 'manage'];

  leaveSessions : LeaveSession[] = []
  getLeaveSessions(){
    return this.adminService.getLeaveSession().subscribe((x)=>{
      this.leaveSessions = x.filter(x=>x.status == false)
    })
  }

  displayedColumnsLeaveSessionCompleted: string[] = ['date', 'slotName','clientName', 'therapistName', 'sessionType', 'manage'];

  leaveSessionsComplete : LeaveSession[]
  getLeaveSessionsCompleted(){
    return this.adminService.getLeaveSession().subscribe((x)=>{
      this.leaveSessionsComplete = x.filter(x=>x.status == true)
    })
  }

  isEdit = false;
  aSessionId : '';
  slot : Slot
  therapist : User
  editSession(id: any){
    const dialogRef = this.dialog.open(EditLeaveSessionDialogueComponent, {
      width: '500px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.getLeaves()
        this.getLmc()
      }
    },(error=>{
      console.log(error)
      alert(error.error.message)
    }))
  }

  deleteLSS: Subscription;
  deleteSession(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        let lSession = this.leaveSessions.find(x => x._id ==id)

        this.deleteLSS = this.adminService.deleteLeaveSession(id).subscribe((session)=>{
          this.getLeaveSessions()
          this._snackBar.open("Leave Session deleted successfully...","" ,{duration:3000})

        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        })
      )}
    })
  }

}

