import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../../admin.service';
import { Assessment } from '../../../models/assessment';
import { Client } from '../../../models/client';
import { Slot } from '../../../models/slot';
import { User } from '../../../models/user';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AddAssessmentDialogueComponent } from '../add-assessment-dialogue/add-assessment-dialogue.component';
import { AddLeaveDialogueComponent } from '../../leaves/add-leave-dialogue/add-leave-dialogue.component';
import { EditAssessmentDialogueComponent } from '../edit-assessment-dialogue/edit-assessment-dialogue.component';
import { TherapistLeave } from 'src/app/Modules/therapist/models/therapistLeave';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit,OnDestroy {

  @ViewChild('fullcalendar', { static: true }) fullcalendar: any;

  calendarEvents: EventInput[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: this.calendarEvents, // Placeholder for initial events
    eventDidMount: this.eventDidMount,
    displayEventTime: false,
  };

  eventDidMount(info) {
    // Customize the background color of the event
    info.el.style.backgroundColor = info.event.backgroundColor;
    info.el.style.borderColor = info.event.borderColor;
    info.el.style.color = info.event.color;
  }

  displayedColumns: string[] = ['date', 'slotName','clientName', 'therapistName', 'manage'];

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.assessmentSubscription.unsubscribe();
    if(this.delete){
      this.delete.unsubscribe();
    }
    if(this.clientS){
      this.clientS.unsubscribe();
    }
  }

  assessmentSubscription: Subscription;
  ngOnInit(): void {
    this.getAssessmentSessions()
    this.getLeaveList()
    this.getAssessment()
  }
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  search = ''

  getAssessment(){
    this._http.getPaginatedAssessment( this.currentPage, this.pageSize).subscribe((res : any)=>{
      this.assessments = res.items ;
      this.totalItems = res.count;
      this.filtered = res.items;
    })

 }

  fromDate : any;
  toDate : any;
  clientName : any;
  clientS: Subscription;

  addEventDialogue(){
    const dialogRef = this.dialog.open(AddAssessmentDialogueComponent, {
      width: '800px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.getAssessmentSessions()
      this.getAssessment()
      if(result){
        this.clientS = this._http.getClientInfo(result.clientName).subscribe((client)=>{
          this.clientName = client.firstName
          this.fromDate = result.assessmentDate

          const calendarApi = this.fullcalendar.getApi();
          const newEvent: EventInput = {
            title: this.clientName,
            start: this.fromDate,
          };
        calendarApi.addEvent(newEvent);
        })
      }
    })
  }

  assessments: Assessment[] =[]
  dataSource : MatTableDataSource<any>
  getAssessmentSessions(){
    this.assessmentSubscription = this._http.getAssessmentSession().subscribe((res : any)=>{
      this.calendarEvents = res.map(event => ({
        title: event.clientName.firstName,
        start: event.assessmentDate, // Convert to Date object // Ensure the date format matches FullCalendar's expected format
      }));

      this.renderCalendarEvents();

    },error => {
      console.error('Error fetching events from MongoDB:', error);
    })
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAssessment()
  }

  renderCalendarEvents() {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.removeAllEvents(); // Clear existing events from the calendar
    for (let i = 0; i < this.calendarEvents.length; i++) {
      calendarApi.addEvent(this.calendarEvents[i]);
    }
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.assessments.filter(element =>
      element.slotName.slotName.toLowerCase().includes(filterValue)
      || element.clientName.firstName.toLowerCase().includes(filterValue)
      || element.therapistName.name.toLowerCase().includes(filterValue)
    )}

    else{
      this.getAssessmentSessions();
    }
  }

  isEdit = false;
  aSessionId : '';
  slot : Slot
  therapist : User
  editSession(id: any){
    const dialogRef = this.dialog.open(EditAssessmentDialogueComponent, {
      width: '800px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.getAssessmentSessions()
        this.getAssessment()
      }
    },(error=>{
      console.log(error)
      alert(error.error.message)
    }))
  }

  delete: Subscription;
  deleteSession(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        let assessment = this.assessments.find(x => x._id ==id)

        let data = {slotStatus : true}
        this.updateSlotStatus(data,assessment.slotName._id)

        this.delete = this._http.deleteAssessmentSession(id).subscribe((session)=>{
          this.getAssessmentSessions()
          this._snackBar.open("Assessment deleted successfully...","" ,{duration:3000})

        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        })
      )}
    })
  }

  updateSlotStatus(data,id){
    this._http.updateSlotStatus(data,id).subscribe((status)=>{})
  }

  leaves: TherapistLeave[] = [];
  getLeaveList() {
    this._http.getTherapistLeave().subscribe(
      (res) => {
        this.leaves = res;
        const leaves = res.filter((e) => e.status.toLowerCase() === 'approved');
  

        let approvedEvents = leaves.map((event) => ({
          title: event.therapistId.name + 'leave',
          start: event.fromDate,
          end: event.toDate,
          backgroundColor: 'green',
          borderColor: 'green',
          color: 'white',
        }));
        this.calendarEvents = this.calendarEvents.concat(approvedEvents);
        this.renderCalendarEvents();

        const emergencyLeave = this.leaves.filter(
          (e) => e.status.toLowerCase() === 'emergency'
        );

        const emergencyEvents = emergencyLeave.map((event) => ({
          title: event.therapistId.name + ' on leave',
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
}
