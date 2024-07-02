import { dA } from '@fullcalendar/core/internal-common';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription, combineLatest, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AssessmentMaster } from 'src/app/Modules/therapist/models/assessmentMaster';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(private fb: FormBuilder, private adminService: AdminService, private therapistService: TherapistService,
    private datePipe: DatePipe){}

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
   getTherapistLeaves(){
     this.tLeaveSub = this.adminService.getTherapistLeave().subscribe((leave) =>{
       let tLeave = leave.filter((x) => x.status.toLowerCase() === 'approved' && x.therapistId._id === this.currentUser)

       // Initialize an object to store leave counts for each month
       const leaveCountsByMonth = {};

       // Loop through the leave records
       tLeave.forEach((leaveRecord) => {
         const fromDate = new Date(leaveRecord.fromDate);
         const toDate = new Date(leaveRecord.toDate);

         // Calculate the year and month for the leave
         const year = fromDate.getFullYear();
         const month = fromDate.getMonth() + 1; // Months are zero-indexed, so add 1

         // Create a unique key for the year and month
         const monthKey = `${year}-${month}`;

         // Increment the leave count for that month
         if (leaveCountsByMonth[monthKey]) {
           leaveCountsByMonth[monthKey] += 1;
         } else {
           leaveCountsByMonth[monthKey] = 1;
         }
       });

       // Get the current date
       const currentDate = new Date();

       // Get the current year and month
       const currentYear = currentDate.getFullYear();
       const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1

       // Create a key for the current month
       const currentMonthKey = `${currentYear}-${currentMonth}`;

       // Get the leave count for the current month
       this.leaveCountForCurrentMonth = leaveCountsByMonth[currentMonthKey] || 0;

     })
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
   getSessions() {
    this.sessionCounts = [];
    this.sessionMasterCounts = [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    this.sessionSub = this.adminService.getSession().subscribe(res => {
      this.dates.forEach((date) => {
        const dateString = new Date(date);

        const weekDay = dateString.toLocaleString('en-US', { weekday: 'long' });

       
        const formattedDate = this.datePipe.transform(date, 'EEE_dd_MM_yyyy'); // Remove commas from the date
   
  
        const sessionCount = res.filter(session => session.slotName.weekDay === weekDay && session.therapistName._id === this.currentUser).length;
        this.sessionCounts.push(sessionCount);
      });
    });

    this.sessionMasterSub = combineLatest(
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>
          y.sessionStatus == "Session" &&
          y.session_id.therapistName._id === this.currentUser
          )
        )
      ),
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>
          y.sessionStatus == "LeaveSession" &&
          y.leave_session_id.therapistName._id === this.currentUser)
        )
      ),
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>
          y.sessionStatus == "CompensationSession" &&
          y.compensation_session_id.therapistName._id === this.currentUser)
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
   getAssessment() {
    this.assessmentCountDay = [];
    this.assessmentMasterDay = [];
     this.assessmentSub = this.adminService.getAssessmentSession().subscribe(res=>{
       this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a =>
          this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date &&
          a.therapistName._id === this.currentUser
        ).length;

        this.assessmentCountDay.push(sessionCountDay);
      })
     })

     this.assessmentMasterSub = combineLatest(
       this.therapistService.getAssessmentMaster().pipe(
         map((x : AssessmentMaster[]) => x.filter((y) =>
           y.sessionStatus == "Assessment" &&
           y.assessment_id.therapistName._id === this.currentUser
           )
         )
       ),
       this.therapistService.getAssessmentMaster().pipe(
         map((x : AssessmentMaster[]) => x.filter((y) =>
           y.sessionStatus == "LeaveAssessment" &&
           y.leave_session_id.therapistName._id === this.currentUser)
         )
       ),
       this.therapistService.getAssessmentMaster().pipe(
         map((x : AssessmentMaster[]) => x.filter((y) =>
           y.sessionStatus == "CompensationAssessment" &&
           y.compensation_assessment_id.therapistName._id === this.currentUser)
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
   getGroupSession() {
    this.groupSessionCountDay = [];
    this.groupMasterCountDay = [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     this.groupSessionSub = this.adminService.getGroupSession().subscribe(res=>{
      this.dates.forEach((date, i) => {
        const dateString = new Date(date);

        const weekDay = dateString.toLocaleString('en-US', { weekday: 'long' });

        const sessionCount = res.filter(session => session.slotName.weekDay === weekDay &&
          session.therapistName.some(therapist => therapist.therapistId.name === this.currentUser)).length;
        this.groupSessionCountDay.push(sessionCount);
      });

     })

     this.groupMasterSub = this.adminService.getGroupMaster().subscribe(res=>{
      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a =>
          this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
          a.therapistName.some(therapist => therapist.therapistId.name === this.currentUser)
        ).length;

        this.groupMasterCountDay.push(sessionCountDay);
      })
     })
   }

   leaveSessionSub: Subscription;
   leaveSessionCountDay: any[] = [];
   leaveAssessmentCountDay: any[] = [];
   getLeaveSession() {
    this.leaveAssessmentCountDay = [];
    this.leaveSessionCountDay = [];
     this.leaveSessionSub = this.adminService.getLeaveSession().subscribe(res=>{
      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a =>
          this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date &&
          a.therapistName._id === this.currentUser &&
          a.sessionType.toLowerCase() === 'session'
        ).length;

        this.leaveSessionCountDay.push(sessionCountDay);
      })

      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a =>
          this.datePipe.transform(a.assessmentDate, 'dd/MM/yyyy') === this.date &&
          a.therapistName._id === this.currentUser &&
          a.sessionType.toLowerCase() === 'assessment'
        ).length;

        this.leaveAssessmentCountDay.push(sessionCountDay);
      })
     })
   }

   compSessionSub: Subscription;
   compSessionCountDay: any[] = [];
   compAssessmentCountDay: any[] = [];
   getCompSession() {
    this.compSessionCountDay = [];
    this.compAssessmentCountDay = [];
     this.compSessionSub = this.therapistService.getCompensation().subscribe(res=>{
      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a =>
          this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
          a.therapistName._id === this.currentUser &&
          a.sessionType.toLowerCase() === 'session'
        ).length;

        this.compSessionCountDay.push(sessionCountDay);
      })

      this.dates.forEach((date, i) => {
        this.date = this.datePipe.transform(date, 'dd/MM/yyyy'); // Set this.date based on the current date in the loop

        const sessionCountDay = res.filter(a =>
          this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date &&
          a.therapistName._id === this.currentUser &&
          a.sessionType.toLowerCase() === 'assessment'
        ).length;

        this.compAssessmentCountDay.push(sessionCountDay);
      })
     })
   }
   //THERAPIST REPORTS END
}
