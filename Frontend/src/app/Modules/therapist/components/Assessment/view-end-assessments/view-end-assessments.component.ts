import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { AssessmentMaster } from '../../../models/assessmentMaster';
import { BtAssessmentForm } from '../../../models/btAssessmentForm';
import { OtAssessment } from '../../../models/otAssessmentForm';
import { SeAssessment } from '../../../models/seAssessmentForm';
import { StAssessmentForm } from '../../../models/stAssessmentForm';
import { TherapistService } from '../../../therapist.service';

@Component({
  selector: 'app-view-end-assessments',
  templateUrl: './view-end-assessments.component.html',
  styleUrls: ['./view-end-assessments.component.scss']
})
export class ViewEndAssessmentsComponent implements OnInit {

  displayedColumns: string[] = ['date', 'assessment_id', 'therapistName', 'sessionType','manage'];

    therapistName : any;
    constructor(private fb: FormBuilder, public authService:AuthService, private adminService:AdminService, private therapistService: TherapistService,
      private _snackBar: MatSnackBar, private router: Router) {

        let token = localStorage.getItem('token')
        this.therapistName = JSON.parse(token)?.username
    }

  ngOnDestroy(): void {
    this.otSubscription.unsubscribe();
    this.stSubscription.unsubscribe();
    this.seSubscription.unsubscribe();
    this.btSubscription.unsubscribe();
    this.sessionMasterSubscription.unsubscribe();
    if(this.aMasterS){
      this.aMasterS.unsubscribe();
    }
  }

    sessionMasterSubscription: Subscription;
    otSubscription: Subscription;
    seSubscription: Subscription;
    stSubscription: Subscription;
    btSubscription: Subscription;
    ngOnInit(): void {
      this.getSessionMaster();
      this.otSubscription = this.viewOtSessions()
      this.stSubscription = this.viewStSessions()
      this.seSubscription = this.viewSeSessions()
      this.btSubscription = this.viewBtSessions()
    }

    therapyabbreviation : any;
    completedSessions : AssessmentMaster[] = [];
    id : any;
    getSessionMaster(){
      this.sessionMasterSubscription = this.therapistService.getAssessmentMaster()
      .pipe(map((x: AssessmentMaster[]) =>
          x.filter((y) => y.sessionStatus === 'Assessment' &&
                          y.assessment_id.status == true )
        ))
        .subscribe((s) => {
        const session = s;
        this.completedSessions = session
        this.filtered = this.completedSessions
      })
    }

    filterValue: any;
    filtered!: any[];
    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filterValue = filterValue;

      if (this.filterValue) {
        this.filtered = this.completedSessions.filter(element => {
          const sessionStatus = element.sessionStatus.toLowerCase();
          if (sessionStatus === 'leaveassessment') {
            // If sessionStatus is 'LeaveSession', use 'leave_session_id'
            return (
              element.leave_session_id.clientName.firstName.toLowerCase().includes(filterValue) ||
              element.leave_session_id.clientName.emergencyNumber.toString().includes(filterValue) ||
              element.leave_session_id.therapistName.name.toLowerCase().includes(filterValue) ||
              element.leave_session_id.slotName.slotName.toLowerCase().includes(filterValue)
            );
          } else if(sessionStatus === 'assessment') {
            // Otherwise, use 'session_id'
            return (
              element.assessment_id.clientName.firstName.toLowerCase().includes(filterValue) ||
              element.assessment_id.clientName.emergencyNumber.toString().includes(filterValue) ||
              element.assessment_id.therapistName.name.toLowerCase().includes(filterValue) ||
              element.assessment_id.slotName.slotName.toLowerCase().includes(filterValue)
            );
          }else {
            // Otherwise, use 'session_id'
            return (
              element.compensation_assessment_id.clientName.firstName.toLowerCase().includes(filterValue) ||
              element.compensation_assessment_id.clientName.emergencyNumber.toString().includes(filterValue) ||
              element.compensation_assessment_id.therapistName.name.toLowerCase().includes(filterValue) ||
              element.compensation_assessment_id.slotName.slotName.toLowerCase().includes(filterValue)
            );
          }
        });
      } else {
        this.getSessionMaster();
      }
    }

  otData: OtAssessment []=[]
  otSessionData: OtAssessment []=[]
  stData: StAssessmentForm []=[]
  stSessionData: StAssessmentForm []=[]
  seData: SeAssessment []=[]
  seSessionData: SeAssessment []=[]
  btData: BtAssessmentForm []=[]
  btSessionData: BtAssessmentForm []=[]
  viewOtSessions(){
    return this.therapistService.getOtAssessmentForm().subscribe((ot)=>{
      this.otData = ot
    })
  }

  viewStSessions(){
    return this.therapistService.getStAssessmentForm().subscribe((st)=>{
      this.stData = st
    })
  }

  viewSeSessions(){
    return this.therapistService.getSeAssessmentForm().subscribe((se)=>{
      this.seData = se
    })
  }

  viewBtSessions(){
    return this.therapistService.getBtAssessmentForm().subscribe((bt)=>{
      this.btData = bt
    })
  }

  otId : any;
  stId : any
  seId : any;
  btId : any;
  aMaster: AssessmentMaster
  aMasterS: Subscription;
  getData(id : any){
    this.therapistService.getAssessmentMasterbyId(id).subscribe((res)=>{
      this.aMaster = res
      if(this.aMaster.sessionStatus === 'Assessment'){
        this.therapyabbreviation = this.aMaster.assessment_id.therapistName.therapyCategory.abbreviation.toUpperCase()
      }else{
        this.therapyabbreviation = this.aMaster.leave_session_id.therapistName.therapyCategory.abbreviation.toUpperCase()
      }

      if(this.therapyabbreviation == 'OT'){

        let otSessionData = this.otData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
        this.otId = otSessionData._id
        this.router.navigateByUrl('therapist/viewotassessmentform/' + this.otId)
      }

      if(this.therapyabbreviation == 'ST'){
        let stSessionData = this.stData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
        this.stId = stSessionData._id
        this.router.navigateByUrl('therapist/viewstassessmentform/' +this.stId)
      }

      if(this.therapyabbreviation == 'SE'){
        let seSessionData = this.seData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
        this.seId = seSessionData._id
        this.router.navigateByUrl('therapist/viewseassessmentform/' + this.seId)
      }
      if(this.therapyabbreviation == 'BT'){
        let btSessionData = this.btData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
        this.btId = btSessionData._id
        this.router.navigateByUrl('therapist/viewbtassessmentform/' + this.btId)
      }
    })
  }
}

