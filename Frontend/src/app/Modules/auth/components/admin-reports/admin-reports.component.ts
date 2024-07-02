import { Concepts } from './../../../therapist/models/seAssessmentForm';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventInput, CalendarOptions, Calendar } from '@fullcalendar/core';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Session } from 'src/app/Modules/admin/models/session';
import { Subscription, combineLatest, map } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/admin/components/delete-dialogue/delete-dialogue.component';
import { DetailReportComponent } from '../detail-report/detail-report.component';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { GroupSession } from 'src/app/Modules/admin/models/groupSession';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { Lmc } from 'src/app/Modules/admin/models/lmc';
import { DailyExpense } from 'src/app/Modules/admin/models/dailyExpense';
import { Concession } from 'src/app/Modules/admin/models/concession';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {

  ngOnDestroy(){
    this.sessionSubscription.unsubscribe();
    this.assessmentSubscription.unsubscribe();
    this.groupSessionSubscription.unsubscribe();
    this.lmcSubscription.unsubscribe();
    this.expenseSubscription.unsubscribe();

  }

  @ViewChild('fullcalendar', { static: true }) fullcalendar: any;

  leaveForm = this.fb.group({
    clientId : ['', Validators.required],
    fromDate : [''],
    toDate : ['']
  })

  constructor(private fb: FormBuilder, private adminService: AdminService, public dialog: MatDialog,
    private _snackBar: MatSnackBar, private therapistService: TherapistService) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getDisplayedMonthAndYear()
    // Now you can use fullCalendarApi to get the view and other data
  }

  month: number;
  year: number;
  getDisplayedMonthAndYear() {
    const fullCalendarApi = this.fullcalendar.getApi();
    const updateMonthAndYear = () => {
      this.calendarEvents = [];
      const currentView = fullCalendarApi.currentData.viewTitle;
      const date = new Date(currentView);
      this.month = date.getMonth() + 1;
      this.year = date.getFullYear();

      this.getSessions()
      this.getAssessment()
      this.getGroupSession()
      this.getLmc()
      this.getExpense()
      this.getConcession()
    };
    updateMonthAndYear();
    fullCalendarApi.on('datesSet', updateMonthAndYear);
  }

  calendarEvents: EventInput[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    // headerToolbar: {
    //   left: 'prev,next today',
    //   center: 'title',
    //   right: 'dayGridMonth,timeGridWeek,timeGridDay'
    // },
    plugins: [dayGridPlugin],
    events: this.calendarEvents, // Placeholder for initial events
    eventDidMount: this.eventDidMount,
    displayEventTime: false,
    eventClick: (info) => {
      this.openEventDialog(info.event);
    }
  };

  openEventDialog(eventData: any): void {
    let pass = eventData._def.title.replace(/: \d+/, '');
    let date = eventData._instance.range.start;
    const dialogRef = this.dialog.open(DetailReportComponent, {
      data: {
        status: pass, date: date
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  eventDidMount(info) {
    // Customize the background color of the event
    info.el.style.backgroundColor = info.event.backgroundColor;
    info.el.style.borderColor = info.event.borderColor;
    info.el.style.color = info.event.color;
  }

  sessionSubscription: Subscription;
  sessions: Session[] = [];
  leaveS: LeaveSession[] = [];
  compS: CompensationSession[] = [];
  leaveSSubscription: Subscription;
  compSSub: Subscription;
  getSessions() {
    let sessionCounts = {}
    // Create an object to store session counts for each dat
    this.sessionSubscription = this.adminService.getSession().subscribe((res: any[]) => {
      this.sessions = res;
      this.leaveSSubscription = this.adminService.getLeaveSession().subscribe((res: any[]) => {
        this.leaveS = res.filter(s => s.sessionType === 'Session');
        this.compSSub = this.therapistService.getCompensation().subscribe((res: any[]) => {
          this.compS = res.filter(s => s.sessionType === 'Session');

          const sessionCounts = {};
          // Loop through sessions and update session counts for each date
          this.sessions.forEach(event => {
            let weekdayString = event.slotName.weekDay;
            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let index = weekdays.indexOf(weekdayString);
            if (index !== -1) {
              let date = new Date(this.year, this.month - 1, 1);

              while (date.getMonth() === this.month - 1 || date.getDate() === 1) {
                if (date.getDay() === index) {
                  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                  const dateString = localDate.toISOString().split('T')[0];
                  sessionCounts[dateString] = (sessionCounts[dateString] || 0) + 1;

                }
                date.setDate(date.getDate() + 1);
              }
            } else {
              console.log('Invalid weekday string.');
            }
          });

          this.leaveS.forEach(s => {
            const date = new Date(s.assessmentDate).toISOString().substr(0, 10);
              if (sessionCounts[date]) {
                sessionCounts[date] = (sessionCounts[date] || 0) + 1;
              }
              else {
                  sessionCounts[date] = 1;
              }
          });

          this.compS.forEach(s => {
            const date = new Date(s.date).toISOString().substr(0, 10); // Extract the date part
              if (sessionCounts[date]) {
                  sessionCounts[date]++;
              } else {
                  sessionCounts[date] = 1;
              }
          });

          const sessionEvents = Object.keys(sessionCounts).map(dateString => ({
            title: `Sessions: ${sessionCounts[dateString]}`,
            start: dateString,
            backgroundColor: 'blue',
            borderColor: 'white',
            color: 'white'

          }));
          this.calendarEvents = this.calendarEvents.concat(sessionEvents);
          this.renderCalendarEvents();
          });
      })
       // Create an array of events for FullCalendar
    })
  }

  assessmentSubscription: Subscription;
  assessment: CompensationSession[] = [];
  assessmentNextSubscription: Subscription;
  getAssessment() {
    // Create an object to store session counts for each date
    const assessmentCounts = {};

    this.assessmentSubscription = this.therapistService.getCompensation().subscribe((res: any[]) => {
      this.assessment = res.filter(x=> x.sessionType === 'Assessment')

      this.assessmentNextSubscription = combineLatest(
        this.adminService.getAssessmentSession()
          .pipe(map((x: Assessment[]) =>
            x.filter((y) => y.status === false)
            )
        ),
        this.adminService.getLeaveSession().pipe(
            map((x: LeaveSession[]) =>
              x.filter((y) => y.sessionType === 'Assessment')
            )
        )
      ).subscribe(([s, z]) => {

      const assessmentNext = [...s, ...z];

      // Create an object to store the count of assessments for each date
      const assessmentCountByDate = {};

      // Iterate through the assessments and count them for each date
      this.assessment.forEach(assessment => {
        const date = new Date(assessment.date).toISOString().substr(0, 10); // Extract the date part
          if (assessmentCountByDate[date]) {
              assessmentCountByDate[date]++;
          } else {
              assessmentCountByDate[date] = 1;
          }
      });

      assessmentNext.forEach(assessment => {
        const date = new Date(assessment.assessmentDate).toISOString().substr(0, 10); // Extract the date part
          if (assessmentCountByDate[date]) {
              assessmentCountByDate[date]++;
          } else {
              assessmentCountByDate[date] = 1;
          }
      });

      const assessmentEvents = Object.keys(assessmentCountByDate).map(dateString => ({
        title: `Assessments: ${assessmentCountByDate[dateString]}`,
        start: dateString,
        backgroundColor: 'green',
        borderColor: 'white',
        color: 'white'
      }))


    this.calendarEvents = this.calendarEvents.concat(assessmentEvents);
    this.renderCalendarEvents();
      })
    }, error => {
      console.error('Error fetching leaves from MongoDB:', error);
    });
  }

  groupSessionSubscription: Subscription;
  groupSession: GroupSession[] = [];
  getGroupSession() {
    // Create an object to store session counts for each date
    const sessionCounts = {};

    this.groupSessionSubscription = this.adminService.getGroupSession().subscribe((res) => {
      this.groupSession = res;

      // Loop through sessions and update session counts for each date
      this.groupSession.forEach(event => {
        let weekdayString = event.slotName.weekDay;
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let index = weekdays.indexOf(weekdayString);
        if (index !== -1) {
          let date = new Date(this.year, this.month - 1, 1);

          while (date.getMonth() === this.month - 1 || date.getDate() === 1) {
            if (date.getDay() === index) {
              const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
              const dateString = localDate.toISOString().split('T')[0];
              sessionCounts[dateString] = (sessionCounts[dateString] || 0) + 1;

            }
            date.setDate(date.getDate() + 1);
          }
        } else {
          console.log('Invalid weekday string.');
        }
      });

      // Create an array of events for FullCalendar
      const groupEvents = Object.keys(sessionCounts).map(dateString => ({
        title: `Groups: ${sessionCounts[dateString]}`,
        start: dateString,
        backgroundColor: 'gray',
        borderColor: 'white',
        color: 'white'

      }));
      this.calendarEvents = this.calendarEvents.concat(groupEvents);
      this.renderCalendarEvents();

    }, error => {
      console.error('Error fetching leaves from MongoDB:', error);
    });
  }

  lmcSubscription: Subscription;
  lmc: Lmc[] = [];
  getLmc() {
    // Create an object to store session counts for each date
    const lmcCounts = {};

    this.lmcSubscription = this.adminService.getLmc().subscribe((res) => {
      this.lmc = res;

      // Loop through sessions and update session counts for each date
      this.lmc.forEach(assessment => {
        const date = new Date(assessment.date).toISOString().substr(0, 10); // Extract the date part
          if (lmcCounts[date]) {
              lmcCounts[date]++;
          } else {
              lmcCounts[date] = 1;
          }
      });

      // Create an array of events for FullCalendar
      const lmcEvents = Object.keys(lmcCounts).map(dateString => ({
        title: `Lmcs: ${lmcCounts[dateString]}`,
        start: dateString,
        backgroundColor: 'pink',
        borderColor: 'white',
        color: 'white'
      }));
      this.calendarEvents = this.calendarEvents.concat(lmcEvents);
      this.renderCalendarEvents();

    }, error => {
      console.error('Error fetching leaves from MongoDB:', error);
    });
  }

  expenseSubscription: Subscription;
  expense: DailyExpense[] = [];
  getExpense() {
    // Create an object to store session counts for each date
    const expCounts = {};

    this.expenseSubscription = this.adminService.getDailyExpense().subscribe((res) => {
      this.expense = res;

      // Loop through sessions and update session counts for each date
      this.expense.forEach(assessment => {
        const date = new Date(assessment.date).toISOString().substr(0, 10); // Extract the date part
          if (expCounts[date]) {
            expCounts[date] = expCounts[date] + assessment.expense;
          } else {
            expCounts[date] = assessment.expense;
          }
      });

      // Create an array of events for FullCalendar
      const lmcEvents = Object.keys(expCounts).map(dateString => ({
        title: `Expenses: ${expCounts[dateString]}`,
        start: dateString,
        backgroundColor: 'gold',
        borderColor: 'white',
        color: 'white'
      }));
      this.calendarEvents = this.calendarEvents.concat(lmcEvents);
      this.renderCalendarEvents();

    }, error => {
      console.error('Error fetching leaves from MongoDB:', error);
    });
  }

  concessionSubscription: Subscription;
  concession: Concession[] = [];
  getConcession() {
    // Create an object to store session counts for each date
    const concCounts = {};

    this.concessionSubscription = this.adminService.getConcession().subscribe((res) => {
      this.concession = res;

      // Loop through sessions and update session counts for each date
      this.expense.forEach(s => {
        const date = new Date(s.date).toISOString().substr(0, 10); // Extract the date part
          if (concCounts[date]) {
            concCounts[date] = concCounts[date] + 1;
          } else {
            concCounts[date] = 1;
          }
      });

      // Create an array of events for FullCalendar
      const lmcEvents = Object.keys(concCounts).map(dateString => ({
        title: `Concession: ${concCounts[dateString]}`,
        start: dateString,
        backgroundColor: 'brown',
        borderColor: 'white',
        color: 'white'
      }));
      this.calendarEvents = this.calendarEvents.concat(lmcEvents);
      this.renderCalendarEvents();

    }, error => {
      console.error('Error fetching leaves from MongoDB:', error);
    });
  }

  renderCalendarEvents() {
    const calendarApi = this.fullcalendar?.getApi();
    calendarApi.removeAllEvents();
    for (let i = 0; i < this.calendarEvents.length; i++) {
      calendarApi.addEvent(this.calendarEvents[i]);
    }
  }
}
