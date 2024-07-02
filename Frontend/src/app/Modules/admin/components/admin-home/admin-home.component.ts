import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Observable, Subscription } from 'rxjs';
import { EventInput, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Slot } from '../../models/slot';
import { User } from '../../models/user';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { Category } from '../../models/category';
import { Session } from '../../models/session';
import { Assessment } from '../../models/assessment';
import { WaitingList } from '../../models/waiting-list';
import { dA } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit, OnDestroy {

  @ViewChild('fullcalendar', { static: true }) fullcalendar: FullCalendarComponent; // Change to FullCalendarComponent
  @ViewChild(MatSort) sort: MatSort;

  calendarEvents: EventInput[] = [];
  dataSource: MatTableDataSource<any>;
  calendarInitialized = false; // Add a flag to track calendar initialization

  datePipe = new DatePipe('en-US')
  weekDay : String;
  date : any;
  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public authService: AuthService) {
    let day = new Date().toLocaleString('default',{weekday:'long'})
    this.weekDay = day
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
    this.assessmentSub?.unsubscribe();
    this.wlSub?.unsubscribe();
    this.wlStatSub?.unsubscribe();
    this.clientSub?.unsubscribe();
  }

  categoryService$ : Observable<Category[]>
  therapistService$ : Observable<User[]>
  ngOnInit(): void {
    this.getSessions();
    this.getAssessmentSessions();
    this.getClients();
    this.categoryService$ = this._http.getCategory()
    this.therapistService$ = this._http.getTherapist()
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
    },
    timeZone: 'UTC',
    eventDidMount: this.eventDidMount,
    displayEventTime: false,
    events: this.calendarEvents, // Initialize events here
    slotDuration: '00:30:00',
    slotMinTime: '08:00:00', // Set minimum time to 8:00 am
    slotMaxTime: '20:00:00', // Set maximum time to 8:00 pm
  };

  sessionSub: Subscription;
  wlSub: Subscription;
  session: Session[] = [];
  sessionNumber: number = 0;
  getSessions(id?: string) {
    this.calendarEvents = [];
    // Fetch assessment sessions and populate calendarEvents
    let fs = [];
    this.sessionSub = this._http.getSession().subscribe((res) => {
      console.log(res);

      if(id){
        fs = res.filter(x=>x.therapistName._id === id)

        this.session = fs.filter(x=>this.datePipe.transform(x.date, 'yyyy-MM-dd') === this.date);
        for(let i = 0; i <this.session.length; i++){
          this.wlSub = this._http.getWlBySession(this.session[i]._id).subscribe(res=>{
            if (res) this.session[i]['wl'] = true; // Add a boolean variable to the session object
            else this.session[i]['wl'] = false; // Add a boolean variable to the session object
          })
        }

        let calendarEventsS = fs.map((event: any) => ({
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'white',
          title: event.clientName.firstName,
          start: event.date.split("T")[0] + 'T' + event.slotName.startTime + ':00',// Concatenate date and start time
          end: event.date.split("T")[0] + 'T' + event.slotName.endTime + ':00'// Concatenate date and end time
        }));
        this.calendarEvents = this.calendarEvents.concat(calendarEventsS);

      }else{
        fs = res
        this.session = fs.filter(x => this.datePipe.transform(x.date, 'yyyy-MM-dd') === this.date);
        this.sessionNumber = this.session.length

        for(let i = 0; i <this.session.length; i++){
          this.wlSub = this._http.getWlBySession(this.session[i]._id).subscribe(res=>{
            if (res) this.session[i]['wl'] = true; // Add a boolean variable to the session object
            else this.session[i]['wl'] = false; // Add a boolean variable to the session object
          })
        }

        let calendarEventsS = fs.map((event: any) => ({
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'white',
          title: event.clientName.firstName,
          start: event.date.split("T")[0] + 'T' + event.slotName.startTime + ':00',// Concatenate date and start time
          end: event.date.split("T")[0] + 'T' + event.slotName.endTime + ':00'// Concatenate date and end time
        }));
        this.calendarEvents = this.calendarEvents.concat(calendarEventsS);
      }

      this.renderCalendarEvents();
    }, error => {
      console.error('Error fetching events from MongoDB:', error);
    });
  }

  assessmentSub: Subscription;
  assessment: Assessment[] = [];
  assessmentNumber : number
  getAssessmentSessions(id?: string) {
    // Fetch assessment sessions and populate calendarEvents
    let fa = [];
    this.assessmentSub = this._http.getAssessmentSession().subscribe((res: any) => {
  

      if(id){
        fa = res.filter((x: any)=>x.therapistName._id === id)

        this.assessment = fa.filter(x=> this.datePipe.transform(x.assessmentDate, 'yyyy-MM-dd') === this.date)

        for(let i = 0; i <this.assessment.length; i++){
          this.wlSub = this._http.getWlByAssessment(this.assessment[i]._id).subscribe(res=>{
            if (res) this.assessment[i]['wl'] = true; // Add a boolean variable to the session object
            else this.assessment[i]['wl'] = false; // Add a boolean variable to the session object
          })
        }

        let calendarEventsA = fa.map((event: any) => ({
          backgroundColor: 'green',
          borderColor: 'green',
          color: 'white',
          title: event.clientName.firstName,
          start: event.assessmentDate.split("T")[0] + 'T' + event.slotName.startTime + ':00',// Concatenate date and start time
          end: event.assessmentDate.split("T")[0] + 'T' + event.slotName.endTime + ':00'// Concatenate date and end time
        }));
        this.calendarEvents = this.calendarEvents.concat(calendarEventsA);
      }else{
        this.assessment = res.filter(x=> this.datePipe.transform(x.assessmentDate, 'yyyy-MM-dd') === this.date)
        this.assessmentNumber = this.assessment.length

        for(let i = 0; i <this.assessment.length; i++){
          this.wlSub = this._http.getWlByAssessment(this.assessment[i]._id).subscribe(res=>{
            if (res) this.assessment[i]['wl'] = true; // Add a boolean variable to the session object
            else this.assessment[i]['wl'] = false; // Add a boolean variable to the session object
          })
        }

        let calendarEventsA = res.map((event: any) => ({
          backgroundColor: 'green',
          borderColor: 'green',
          color: 'white',
          title: event.clientName.firstName,
          start: event.assessmentDate.split("T")[0] + 'T' + event.slotName.startTime + ':00',// Concatenate date and start time
          end: event.assessmentDate.split("T")[0] + 'T' + event.slotName.endTime + ':00'// Concatenate date and end time
        }));
        this.calendarEvents = this.calendarEvents.concat(calendarEventsA);
      }
      // Render calendar events
      this.renderCalendarEvents();
    }, error => {
      console.error('Error fetching events from MongoDB:', error);
    });
  }

  renderCalendarEvents() {
    if (this.fullcalendar && this.fullcalendar.getApi) {
      const calendarApi = this.fullcalendar.getApi();
      calendarApi.removeAllEvents();
      // calendarApi.removeAllEvents(); // Clear existing events from the calendar
      for (let i = 0; i < this.calendarEvents.length; i++) {
        calendarApi.addEvent(this.calendarEvents[i]);
      }
    } else {
      // If the calendar component is not initialized yet, set the flag to true
      this.calendarInitialized = true;
    }
  }

  eventDidMount(info) {
    // Customize the appearance of the event
    info.el.style.backgroundColor = info.event.backgroundColor;
    info.el.style.borderColor = info.event.borderColor;
    info.el.style.color = info.event.color;
  }

  slots : Slot []=[];
  freeSlots : number
  getSlots(){
    return this._http.getSlot().subscribe((s)=>{
      this.slots = s;

      this.freeSlots = this.slots.filter(x=> x.slotStatus == true && x.weekDay == this.weekDay).length
    })
  }

  users : User [] = []
  getTherapists(){
    return this._http.getTherapist().subscribe((x)=>{
      this.users = x
    })
  }

  selectSlots : Slot[]= [];
  catStatus = false;
  therapistSub: Subscription;
  getSlotByCat(id:any){
   this.selectSlots = this.slots.filter(x=>x.therapyCategory._id==id)
   this.therapistSub = this._http.getTherapistByCategoryId(id).subscribe(x=>{
      this.users = x;
   });
   this.catStatus = true;
  }

  finalSlots : Slot[] = []
  getSlotByTherapist(id){
    this.calendarEvents = [];
    this.getSessions(id)
    this.getAssessmentSessions(id)
  }

  wlStatSub: Subscription;
  onToggleChange(event: any, id: any, clientId: any) {
    if(event.checked === true) {
      let data = {
        clientId: clientId,
        sessionId: id
      }
      this.wlStatSub = this._http.addWl(data).subscribe(data=>{
        this.getSessions();
        this.getAssessmentSessions();
      });
    }else if(event.checked === false){
      this.wlStatSub = this._http.deleteWlBySession(id).subscribe(data=>{
        this.getSessions();
        this.getAssessmentSessions();
      });
    }
  }

  onToggleChangeAssessment(event: any, id: any, clientId: any) {
    if(event.checked === true) {
      let data = {
        clientId: clientId,
        assessmentId: id
      }
      this.wlStatSub = this._http.addWl(data).subscribe(data=>{
        this.getAssessmentSessions();
        this.getSessions();
      });
    }else if(event.checked === false){
      this.wlStatSub = this._http.deleteWlByAssessment(id).subscribe(data=>{
        this.getAssessmentSessions();
        this.getSessions();
      });
    }
  }

  //tiles
  clientNo : Number
  clientSub: Subscription;
  getClients(){
    this.clientSub = this._http.getClients().subscribe((res)=>{
      this.clientNo =(res.filter(x=>x.status == 'WL')).length
    })
  }
}
