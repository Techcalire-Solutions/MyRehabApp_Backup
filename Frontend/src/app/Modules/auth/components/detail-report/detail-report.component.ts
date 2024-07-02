import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Lmc } from 'src/app/Modules/admin/models/lmc';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  therapistNames: any;
  ngOnDestroy(){
    if(this.sessionSub){
      this.sessionSub.unsubscribe();
    }
    if(this.leaveSesSub){
      this.leaveSesSub.unsubscribe();
    }
    if(this.compSesSub){
      this.compSesSub.unsubscribe();
    }
    if(this.sMSub){
      this.sMSub.unsubscribe();
    }
    if(this.assessmentSub){
      this.assessmentSub.unsubscribe();
    }
    if(this.leaveAssessmentSub){
      this.leaveAssessmentSub.unsubscribe();
    }
    if(this.compAssessSub){
      this.compAssessSub.unsubscribe();
    }
    if(this.aMSub){
      this.aMSub.unsubscribe();
    }
  }

  constructor(public dialogRef: MatDialogRef<DetailReportComponent>, private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any, private datePipe: DatePipe, private therapistService: TherapistService) { }

  day: string;
  date: string;
  ngOnInit(): void {
    this.day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(this.data.date)
    this.date = this.datePipe.transform(this.data.date, 'dd/MM/yyyy')
    if(this.data.status.toLowerCase() === 'sessions'){
      this.getSessions();
    }
    if(this.data.status.toLowerCase() === 'assessments'){
      this.getAssessments();
    }
    if(this.data.status.toLowerCase() === 'lmcs'){
      this.getLmc();
    }
  }

  therapistSessionCount = {};
  leaveSessionCount = {};
  compSessionCount = {};
  sMCount = {};
  sessionSub: Subscription;
  leaveSesSub: Subscription;
  compSesSub: Subscription;
  sMSub: Subscription;
  getSessions(){
    this.sessionSub = this.adminService.getSession().subscribe(session =>{
      let s = session.filter(session => session.slotName.weekDay === this.day)
      // Iterate through the sessions and count sessions for each therapist
      s.forEach(session => {
        const therapistName = session.therapistName._id;
        if (!this.therapistSessionCount[therapistName]) {
          this.therapistSessionCount[therapistName] = 1;
        } else {
          this.therapistSessionCount[therapistName]++;
        }
      });
      // Get the UL element to display therapist counts
      const therapistListSession = document.getElementById("therapist-list-session");

      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in this.therapistSessionCount) {
        this.adminService.getTherapistById(therapistName).subscribe((therapist) => {
          let name = therapist.name;
          const sessionCount = this.therapistSessionCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistListSession.appendChild(listItem);
        })
      }
    })

    this.leaveSesSub = this.adminService.getLeaveSession().subscribe(session =>{
      let s = session.filter(session =>
        this.datePipe.transform(session.assessmentDate, 'dd/MM/yyyy') === this.date
        && session.sessionType.toLowerCase() === 'session'
        )
      // Iterate through the sessions and count sessions for each therapist
      s.forEach(session => {
        const therapistName = session.therapistName._id;

        if (!this.leaveSessionCount[therapistName]) {
          this.leaveSessionCount[therapistName] = 1;
        } else {
          this.leaveSessionCount[therapistName]++;
        }
      });
      // Get the UL element to display therapist counts
      const therapistListLeave = document.getElementById("therapist-list-leave");

      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in this.leaveSessionCount) {
        this.adminService.getTherapistById(therapistName).subscribe((therapist) => {
          let name = therapist.name;
          const sessionCount = this.leaveSessionCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistListLeave.appendChild(listItem);
        })
      }
    })

    this.compSesSub = this.therapistService.getCompensation().subscribe(session =>{
      let s = session.filter(session =>
        this.datePipe.transform(session.date, 'dd/MM/yyyy') === this.date
        && session.sessionType.toLowerCase() === 'session'
        )
      // Iterate through the sessions and count sessions for each therapist
      s.forEach(session => {
        const therapistName = session.therapistName._id;

        if (!this.compSessionCount[therapistName]) {
          this.compSessionCount[therapistName] = 1;
        } else {
          this.compSessionCount[therapistName]++;
        }
      });
      // Get the UL element to display therapist counts
      const therapistListComp = document.getElementById("therapist-list-comp");

      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in this.compSessionCount) {
        this.adminService.getTherapistById(therapistName).subscribe((therapist) => {
          let name = therapist.name;
          const sessionCount = this.compSessionCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistListComp.appendChild(listItem);
        })
      }
    })

    this.sMSub = this.therapistService.getSessionMaster().subscribe(session =>{

      const therapistListSM = document.getElementById("therapist-list-sm");
      therapistListSM.innerHTML = ""; // Clear the previous content

      let s = session.filter(session =>
        this.datePipe.transform(session.date, 'dd/MM/yyyy') === this.date)
      // Iterate through the sessions and count sessions for each therapist
      const sMCount = {};
      s.forEach(session => {
        let therapistName: any;

        if (session.sessionStatus.toLowerCase() === 'session') {
          therapistName = session.session_id.therapistName._id;
        } else if (session.sessionStatus.toLowerCase() === 'leavesession') {
          therapistName = session.leave_session_id.therapistName._id;
        } else if (session.sessionStatus.toLowerCase() === 'compensationsession') {
          therapistName = session.compensation_session_id.therapistName._id;
        }

        if (!sMCount[therapistName]) {
          sMCount[therapistName] = 1;
        } else {
          sMCount[therapistName]++;
        }
      });

      for (const therapistName in sMCount) {
        this.adminService.getTherapistById(therapistName).subscribe(therapist => {
          let name = therapist.name;
          const sessionCount = sMCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistListSM.appendChild(listItem);
        });
      }
    })
  }

  assessmentSub: Subscription;
  leaveAssessmentSub: Subscription;
  compAssessSub: Subscription;
  aMSub: Subscription;
  therapistAssessmentCount = {};
  leaveAssessmentCount = {};
  compAssessmentCount = {};
  aMCount = {};
  getAssessments(){
    this.assessmentSub = this.adminService.getAssessmentSession().subscribe(session =>{
      let s = session.filter(session => this.datePipe.transform(session.assessmentDate, 'dd/MM/yyyy' ) === this.date)
      // Iterate through the sessions and count sessions for each therapist
      s.forEach(session => {
        const therapistName = session.therapistName._id;
        if (!this.therapistAssessmentCount[therapistName]) {
          this.therapistAssessmentCount[therapistName] = 1;
        } else {
          this.therapistAssessmentCount[therapistName]++;
        }
      });
      // Get the UL element to display therapist counts
      const therapistList = document.getElementById("therapist-assessment-list");

      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in this.therapistAssessmentCount) {
        this.adminService.getTherapistById(therapistName).subscribe((therapist) => {
          let name = therapist.name;
          const sessionCount = this.therapistAssessmentCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistList.appendChild(listItem);
        })
      }
    })

    this.leaveAssessmentSub = this.adminService.getLeaveSession().subscribe(session =>{
      let s = session.filter(session =>
        this.datePipe.transform(session.assessmentDate, 'dd/MM/yyyy') === this.date
        && session.sessionType.toLowerCase() === 'assessment'
        )
      // Iterate through the sessions and count sessions for each therapist
      s.forEach(session => {
        const therapistName = session.therapistName._id;

        if (!this.leaveAssessmentCount[therapistName]) {
          this.leaveAssessmentCount[therapistName] = 1;
        } else {
          this.leaveAssessmentCount[therapistName]++;
        }
      });
      // Get the UL element to display therapist counts
      const therapistListLeaveAsses = document.getElementById("therapist-leave-asses");
      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in this.leaveAssessmentCount) {
        this.adminService.getTherapistById(therapistName).subscribe((therapist) => {
          let name = therapist.name;
          const sessionCount = this.leaveAssessmentCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistListLeaveAsses.appendChild(listItem);
        })
      }
    })

    this.compAssessSub = this.therapistService.getCompensation().subscribe(session =>{
      let s = session.filter(session =>
        this.datePipe.transform(session.date, 'dd/MM/yyyy') === this.date
        && session.sessionType.toLowerCase() === 'assessment'
        )
      // Iterate through the sessions and count sessions for each therapist
      s.forEach(session => {
        const therapistName = session.therapistName._id;

        if (!this.compAssessmentCount[therapistName]) {
          this.compAssessmentCount[therapistName] = 1;
        } else {
          this.compAssessmentCount[therapistName]++;
        }
      });
      // Get the UL element to display therapist counts
      const therapistListCompAsses = document.getElementById("therapist-comp-assess");

      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in this.compAssessmentCount) {
        this.adminService.getTherapistById(therapistName).subscribe((therapist) => {
          let name = therapist.name;
          const sessionCount = this.compAssessmentCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistListCompAsses.appendChild(listItem);
        })
      }
    })

    this.aMSub = this.therapistService.getAssessmentMaster().subscribe(session => {

      // Initialize the UL element to display therapist counts
      const therapistListAM = document.getElementById("therapist-list-am");
      therapistListAM.innerHTML = ""; // Clear the previous content

      let s = session.filter(session =>
        this.datePipe.transform(session.date, 'dd/MM/yyyy') === this.date
      );

      const aMCount = {}; // Initialize the session count object

      s.forEach(session => {
        let therapistName;

        if (session.sessionStatus.toLowerCase() === 'assessment') {
          therapistName = session.assessment_id.therapistName._id;
        } else if (session.sessionStatus.toLowerCase() === 'leaveassessment') {
          therapistName = session.leave_session_id.therapistName._id;
        } else if (session.sessionStatus.toLowerCase() === 'compensationassessment') {
          therapistName = session.compensation_assessment_id.therapistName._id;
        }

        if (!aMCount[therapistName]) {
          aMCount[therapistName] = 1;
        } else {
          aMCount[therapistName]++;
        }
      });

      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in aMCount) {
        this.adminService.getTherapistById(therapistName).subscribe(therapist => {
          let name = therapist.name;
          const sessionCount = aMCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} sessions`;
          therapistListAM.appendChild(listItem);
        });
      }
    });

    // You can add the following HTML code to display the therapist counts:
    // <h2>Completed Assessments</h2>
    // <ul id="therapist-list-am"></ul>

  }

  lmcSub: Subscription;
  lMSub: Subscription;
  notPay: Lmc[] = [];
  lmcCount: number = 0;
  notPayCount: number
  therapistLmcCount = {};
  clinicLmcCount: number
  getLmc(){
    this.lmcSub = this.adminService.getLmc().subscribe(res=>{
      this.lmcCount = res.filter(s=>
        this.datePipe.transform(s.date, 'dd/MM/yyyy') === this.date
      ).length;
      this.notPay = res.filter(res=>
        this.datePipe.transform(res.date, 'dd/MM/yyyy') === this.date
        && res.feeStatus === false
      )
      this.notPayCount = this.notPay.length;
    })

    this.lMSub = this.adminService.getPayedFees().subscribe(session =>{
      let s = session.filter(session =>
        this.datePipe.transform(session.dateAndTime, 'dd/MM/yyyy' ) === this.date
        && session.sessionType.toLowerCase() === 'lmc')
      s.forEach(session => {
        const therapistName = session.lmcId.session_id.therapistName._id;
        if (!this.therapistLmcCount[therapistName]) {
          this.therapistLmcCount[therapistName] = 1;
        } else {
          this.therapistLmcCount[therapistName]++;
        }
      });
      // Get the UL element to display therapist counts
      const therapistList = document.getElementById("therapist-lmc-list");
      // Iterate through the therapistSessionCount object and create list items
      for (const therapistName in this.therapistLmcCount) {
        this.adminService.getTherapistById(therapistName).subscribe((therapist) => {
          let name = therapist.name;
          const sessionCount = this.therapistLmcCount[therapistName];
          const listItem = document.createElement("li");
          listItem.textContent = `${name}: ${sessionCount} lmcs`;
          therapistList.appendChild(listItem);
        })
      }
    })
  }
}


