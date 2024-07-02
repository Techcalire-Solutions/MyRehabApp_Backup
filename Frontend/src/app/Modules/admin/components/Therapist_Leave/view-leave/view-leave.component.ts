import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventInput, CalendarOptions } from '@fullcalendar/core';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { TherapistLeave } from 'src/app/Modules/therapist/models/therapistLeave';
import { AdminService } from '../../../admin.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EmergencyLeaveComponent } from '../emergency-leave/emergency-leave.component';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { CompensationSessionComponent } from 'src/app/Modules/therapist/components/Therapist_Leave/compensation-session/compensation-session.component';
@Component({
  selector: 'app-view-leave',
  templateUrl: './view-leave.component.html',
  styleUrls: ['./view-leave.component.scss']
})
export class ViewLeaveComponent implements OnInit {

constructor(
      private formBuilder: FormBuilder,
      private adminService: AdminService,
      private authService: AuthService,
      private dialog: MatDialog,
      private _snackBar: MatSnackBar
    ) {
      const token: any = localStorage.getItem('token');
      let user = JSON.parse(token);
      this.userId = user.id;
    }

    ngOnInit() {
      this.getLeaveList();
    }
  //----------------------------------------------------------CALENDER FUNCTIONS----------------------------------------------------------------------
    calendarEvents: EventInput[] = [];
    @ViewChild('fullcalendar', { static: true }) fullcalendar: any;

    calendarOptions: CalendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: this.calendarEvents, // Placeholder for initial events
      eventDidMount: this.eventDidMount,
      displayEventTime: false,
    };

    eventDidMount(info: any) {
      // Customize the background color of the event
      info.el.style.backgroundColor = info.event.backgroundColor;
      info.el.style.borderColor = info.event.borderColor;
      info.el.style.color = info.event.color;
    }
    leaves: TherapistLeave[] = [];
    getLeaveList() {
      this.adminService.getTherapistLeave().subscribe(
        (res) => {
          this.leaves = res;
          const leaves = res.filter((e) => e.status.toLowerCase() === 'approved');

          this.calendarEvents = leaves.map((event) => ({
            title: event.therapistId.name,
            start: event.fromDate,
            end: event.toDate,
            backgroundColor: 'green',
            borderColor: 'green',
            color: 'white',
          }));

          this.renderCalendarEvents();

          const emergencyLeave = this.leaves.filter(
            (e) => e.status.toLowerCase() === 'emergency'
          );

          const emergencyEvents = emergencyLeave.map((event) => ({
            title: event.therapistId.name,
            start: event.fromDate,
            end: event.toDate,
            backgroundColor: 'red',
            borderColor: 'red',
            color: 'white',
          }));

          this.calendarEvents = this.calendarEvents.concat(emergencyEvents);
          this.renderCalendarEvents();
        },
        (error) => {
          console.error('Error fetching leaves from MongoDB:', error);
        }
      );
    }



    renderCalendarEvents() {
      const calendarApi = this.fullcalendar.getApi();
      calendarApi.removeAllEvents(); // Clear existing events from the calendar
      for (let i = 0; i < this.calendarEvents.length; i++) {
        calendarApi.addEvent(this.calendarEvents[i]);
      }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    fromDate: any;
    toDate: any;
    clientName: any;

    displayedColumns: string[] = [
      'userId',
      'leaveType',
      'reason',
      'fromDate',
      'toDate',
      'status',
      'action',
      'manage'
    ];

    userId!: number;



    approveLeave(id: string) {
      let data: any = {
        status: 'Approved',
      };
      this.adminService.updateTherapistLeaveStatus(data,id).subscribe((res) => {
        let task = res;
        this.getLeaveList();
      });
    }

    rejectLeave(id: any) {
      let data: any = {
        status: 'Rejected',
      };
      this.adminService.updateTherapistLeaveStatus( data,id).subscribe((res) => {
        let task = res;
        this.getLeaveList();
      });
    }

    addEmergency() {
      const dialogRef = this.dialog.open(EmergencyLeaveComponent, {
        data: {
          status: this.isEdit,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this._snackBar.open('Leave Added successfully...',"" ,{duration:3000});
          this.getLeaveList();
        }
      });
    }

    isEdit = false;
    editRow(id: number) {
      this.isEdit = true;
      const dialogRef = this.dialog.open(EmergencyLeaveComponent, {
        data: {
          status: this.isEdit,
          id: id,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this._snackBar.open('Leave updated successfully...',"" ,{duration:3000});
          this.getLeaveList();
        }
      });
    }

    delete: Subscription;
    deleteRow(_id: string) {
      if (!_id) {
        console.error("Invalid _id provided");
        return;
      }
      const dialogRef = this.dialog.open(DeleteDialogueComponent, {
        width: '250px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.delete = this.adminService.deleteTherapistLeave(_id).subscribe((res)=>{
            this.getLeaveList()
            this._snackBar.open("Leave deleted successfully...","" ,{duration:3000})
          },(error=>{
            console.log(error)
            this._snackBar.open(error.error.message,"" ,{duration:3000})
          }))
          this.getLeaveList()
        }})
    }

    addCompensationSession(id: string){
      const dialogRef = this.dialog.open(CompensationSessionComponent, {
        width: '500px',
        data: {
          id : id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getLeaveList()
      })
    }
  }
