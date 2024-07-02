import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription, combineLatest, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { AssessmentMaster } from 'src/app/Modules/therapist/models/assessmentMaster';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { User } from '../../../admin/models/user';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-salary-report',
  templateUrl: './salary-report.component.html',
  styleUrls: ['./salary-report.component.scss']
})
export class SalaryReportComponent implements OnInit {

  constructor(private fb: FormBuilder, private adminService: AdminService, private therapistService: TherapistService,
    private datePipe: DatePipe, private authService: AuthService){}

  reportForm = this.fb.group({
    selectedStartDate : [''],
    selectedEndDate : ['']
  })

  currentUser : any
  currentUserString : any
  currentMonth : any;
  date: any;
  weekDay: string;
  ngOnInit() {
    this.currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(this.currentUserString).id
    this.generateYearDateRange(this.year)
    this.getSessions()
    this.getAssessment()
    this.getGroupSession()
    this.getLeaveSession()
    this.getCompSession()
    this.getTherapist()
    this.getConcessionClients()
  }

  users: User[] = [];
  getTherapist(){
    return this.adminService.getTherapist().subscribe((u)=>{
      this.users = u
      this.filteredOptionsTherapist = this.users
    })
  }

  myControlTherapist = new FormControl<string | Client>('');
  filteredOptionsTherapist: User[] = [];
  filterOptionsTherapist(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsTherapist = this.users.filter(option =>
      (option.name && option.name.toLowerCase().includes(value?.toLowerCase()))
    );
  }

  therapistId: string;
  filterReportByTherapist(id:string){
    this.therapistId = id;

    this.getSessions(id)
    this.getAssessment(id)
    this.getGroupSession(id)
    this.getLeaveSession(id)
    this.getCompSession(id)
  }


  generateYearDateRange(year: number) {
    const dateRange = [];
    const startDate = new Date(); // Today/
    const endDate = new Date(2022, 0, 1);

    while (startDate >= endDate) {
      dateRange.push(new Date(startDate));
      startDate.setDate(startDate.getDate() - 1);
    }
    this.dates = dateRange;
  }

  // Define the year for which you want to display dates
  year = 2023; // Change to the desired year

  dates: Date[]

  selectedStartDate!: any ; // Property to store the selected start date
  selectedEndDate!: any ;

  filterRows(): void {
    this.selectedStartDate = this.reportForm.get('selectedStartDate').value;
    this.selectedEndDate = this.reportForm.get('selectedEndDate').value;

    if (this.selectedStartDate && this.selectedEndDate) {
      this.dates = this.dates
      .filter(date => {
          const startDate = new Date(this.selectedStartDate);
          const endDate = new Date(this.selectedEndDate);
          return date >= startDate && date <= endDate;
        });
      if(this.dates){
        this.getSessions()
        this.getAssessment()
        this.getGroupSession()
        this.getLeaveSession()
        this.getCompSession()
        this.getTherapistLeaves
      }
    } else {
      // Reset the dates array if no dates are selected
      // this.dates = this.generateYearDateRange(this.year);
    }
  }


   //THERAPIST REPORTS
   tLeaveSub: Subscription;
   tLeave: number = 0;
   leaveCountForCurrentMonth: number;
   getTherapistLeaves(id?: string) {
    this.tLeaveSub = this.adminService.getTherapistLeave().subscribe((leave) => {
      let tLeave = leave.filter((x) => id
      ? x.status.toLowerCase() === 'approved' && x.therapistId._id === id
      : x.status.toLowerCase() === 'approved')

      const tableData = [];

      tLeave.forEach((leaveEntry) => {
        const fromDate = new Date(leaveEntry.fromDate);
        const toDate = new Date(leaveEntry.toDate);

        // Loop through the date range
        for (let currentDate = fromDate; currentDate <= toDate; currentDate.setDate(currentDate.getDate() + 1)) {
          const isInCurrentMonth = currentDate.getMonth() === new Date().getMonth();
          const status = isInCurrentMonth ? 'absent' : 'present';

          // Push data to the tableData array for each day in the range
          tableData.push({
            date: currentDate.toISOString(), // Format the date as needed
            status: status,
            // ... other properties from the leaveEntry that you want to display in the table
          });
        }
      });
    });
  }

   getCurrentMonthKey() {
     const currentDate = new Date();
     const currentYear = currentDate.getFullYear();
     const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
     return `${currentYear}-${currentMonth}`;
   }

   sessionSub: Subscription;
   sessionMasterSub: Subscription;
   sessionCounts: any[] = [];
   sessionMasterCounts: any[] = [];
   getSessions(id?: string){
    this.sessionCounts = [];
    this.sessionMasterCounts = [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wedn  esday", "Thursday", "Friday", "Saturday"];

    this.sessionSub = this.adminService.getSession().subscribe(res => {
      this.dates.forEach((date) => {
        const dateString = new Date(date);

        const weekDay = dateString.toLocaleString('en-US', { weekday: 'long' });

        // const weekDay = daysOfWeek[date.getDay()];
        const formattedDate = this.datePipe.transform(date, 'EEE_dd_MM_yyyy'); // Remove commas from the date
  
        // Filter sessions for the current date and therapist
        const sessionCount = id
        ? res.filter(session => session.slotName.weekDay === weekDay && session.therapistName._id === id).length
        : res.filter(session => session.slotName.weekDay === weekDay).length;
        this.sessionCounts.push(sessionCount);
      });
    });

    this.sessionMasterSub = combineLatest(
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) => id
          ? y.sessionStatus == "Session" && y.session_id.therapistName._id === id
          : y.sessionStatus == "Session"
          )
        )
      ),
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>id
          ? y.sessionStatus == "LeaveSession" && y.leave_session_id.therapistName._id === id
          : y.sessionStatus == "LeaveSession"
          )
        )
      ),
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>id
          ? y.sessionStatus == "CompensationSession" && y.compensation_session_id.therapistName._id === id
          : y.sessionStatus == "CompensationSession"
          )
        )
      ),
    ).subscribe(([s, z, x]) => {
      const aMaster = [...s, ...z, ...x];

      this.dates.forEach((date) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = aMaster.filter(a =>
          this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date
        ).length;

        this.sessionMasterCounts.push(sessionCountDay);
      })
    })
    }

   assessmentSub: Subscription;
   assessmentCountDay: any[] = [];
   assessmentMasterSub: Subscription;
   assessmentMasterDay: any[] = [];
   getAssessment(id?: string) {
    this.assessmentCountDay = [];
    this.assessmentMasterDay = [];
     this.assessmentSub = this.adminService.getAssessmentSession().subscribe(res=>{
       this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a =>id
          ? this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date
            && a.therapistName._id === id
          : this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date
        ).length;

        this.assessmentCountDay.push(sessionCountDay);
        })
     })

     this.assessmentMasterSub = combineLatest(
       this.therapistService.getAssessmentMaster().pipe(
         map((x : AssessmentMaster[]) => x.filter((y) =>id
          ? y.sessionStatus == "Assessment" && y.assessment_id.therapistName._id === id
          : y.sessionStatus == "Assessment"
          )
         )
       ),
       this.therapistService.getAssessmentMaster().pipe(
         map((x : AssessmentMaster[]) => x.filter((y) =>id
          ? y.sessionStatus == "LeaveAssessment" && y.leave_session_id.therapistName._id === id
          : y.sessionStatus == "LeaveAssessment"
          )
         )
       ),
       this.therapistService.getAssessmentMaster().pipe(
         map((x : AssessmentMaster[]) => x.filter((y) =>id
          ? y.sessionStatus == "CompensationAssessment" && y.compensation_assessment_id.therapistName._id === id
          : y.sessionStatus == "CompensationAssessment"
          )
         )
       ),
     ).subscribe(([s, z, x]) => {
       const aMaster = [...s, ...z, ...x];
       this.dates.forEach((date, i) => {
          this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

          const sessionCountDay = aMaster.filter(a =>
            this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date
          ).length;

          this.assessmentMasterDay.push(sessionCountDay);
        })
     })
   }

   groupSessionSub: Subscription;
   groupSessionCountDay: any[] = [];
   groupMasterSub: Subscription;
   groupMasterCountDay: any[] = [];
   getGroupSession(id?: string) {
    this.groupSessionCountDay = [];
    this.groupMasterCountDay = [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     this.groupSessionSub = this.adminService.getGroupSession().subscribe(res=>{
      this.dates.forEach((date, i) => {
        const dateString = new Date(date);

        const weekDay = dateString.toLocaleString('en-US', { weekday: 'long' });

        const sessionCount = res.filter(session => id
            ? session.slotName.weekDay === weekDay &&
              session.therapistName.some(therapist => therapist.therapistId.name === id)
            : session.slotName.weekDay === weekDay
          ).length;
        this.groupSessionCountDay.push(sessionCount);
      });

     })

     this.groupMasterSub = this.adminService.getGroupMaster().subscribe(res=>{
      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a => id
          ? this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
          a.therapistName.some(therapist => therapist.therapistId.name === id)
          : this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date
        ).length;

        this.groupMasterCountDay.push(sessionCountDay);
      })
     })
   }

   leaveSessionSub: Subscription;
   leaveSessionCountDay: any[] = [];
   leaveAssessmentCountDay: any[] = [];
   getLeaveSession(id?: string) {
    this.leaveAssessmentCountDay = [];
    this.leaveSessionCountDay = [];
     this.leaveSessionSub = this.adminService.getLeaveSession().subscribe(res=>{
      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a => id
          ? this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date &&
            a.therapistName._id === id &&
            a.sessionType.toLowerCase() === 'session'
          : this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date &&
            a.sessionType.toLowerCase() === 'session' ).length;

        this.leaveSessionCountDay.push(sessionCountDay);
      })

      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a => id
          ? this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date &&
          a.therapistName._id === id &&
          a.sessionType.toLowerCase() === 'assessment'
          : this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date &&
            a.sessionType.toLowerCase() === 'assessment' ).length
        this.leaveAssessmentCountDay.push(sessionCountDay);
      })
     })
   }

   compSessionSub: Subscription;
   compSessionCountDay: any[] = [];
   compAssessmentCountDay: any[] = [];
   getCompSession(id?: string) {
    this.compSessionCountDay = [];
    this.compAssessmentCountDay = [];
     this.compSessionSub = this.therapistService.getCompensation().subscribe(res=>{
      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a => id
          ? this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
            a.therapistName._id === id &&
            a.sessionType.toLowerCase() === 'session'
          : this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
            a.sessionType.toLowerCase() === 'session' ).length

        this.compSessionCountDay.push(sessionCountDay);
      })

      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a => id
          ? this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
            a.therapistName._id === id &&
            a.sessionType.toLowerCase() === 'assessment'
          : this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
            a.sessionType.toLowerCase() === 'assessment' ).length

        this.compAssessmentCountDay.push(sessionCountDay);
      })
     })
   }

   getConcessionClients(){
    this.authService.getConcessionCategory().subscribe(res=>{
    })
   }
}
