import { Assessment } from '../../../../admin/models/assessment';
import { BtAssessmentForm } from '../../../models/btAssessmentForm';
import { SeAssessment } from '../../../models/seAssessmentForm';
import { StAssessmentForm } from '../../../models/stAssessmentForm';
import { OtAssessment } from '../../../models/otAssessmentForm';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Category } from 'src/app/Modules/admin/models/category';
import { Client } from 'src/app/Modules/admin/models/client';
import { Room } from 'src/app/Modules/admin/models/room';
import { Session } from 'src/app/Modules/admin/models/session';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/admin/models/user';
import { TherapistService } from '../../../therapist.service';
import { AssessmentMaster } from '../../../models/assessmentMaster';
import { Fees } from 'src/app/Modules/admin/models/fees';
import { EndAssessmentDialogueComponent } from '../end-assessment-dialogue/end-assessment-dialogue.component';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';

@Component({
  selector: 'app-assessment-session-data',
  templateUrl: './assessment-session-data.component.html',
  styleUrls: ['./assessment-session-data.component.scss']
})
export class AssessmentSessionDataComponent implements OnInit, OnDestroy {

  dailySessionForm = this.fb.group({
  });

  displayedColumns: string[] = ['date', 'session_id', 'therapistName' ,'manage'];


  assessments : Assessment[] = [];
  rooms: Room []=[]
  selectedSessions: Session []=[]
  clients: Client []=[]


  therapist : any;
  datepipe: any;

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    private router: Router,  public authService:AuthService, private therapistService: TherapistService, public dialog:MatDialog,
    private datePipe: DatePipe) {
      let token = localStorage.getItem('token')
      this.therapist = JSON.parse(token)?.username
  }

  ngOnDestroy(): void {
    this.clientSubscription.unsubscribe();
    this.therapistSubscription.unsubscribe();
    this.assessmentMasterSubscription.unsubscribe();
    this.otSubscription.unsubscribe();
    this.stSubscription.unsubscribe();
    this.seSubscription.unsubscribe();
    this.btSubscription.unsubscribe();
    this.infoSubscription.unsubscribe();
    if(this.assessmentMS){
      this.assessmentMS.unsubscribe();
    }
    this.feesSub.unsubscribe();
    this.assessmentS.unsubscribe();
    if(this.leaveSS){
      this.leaveSS.unsubscribe();
    }
  }

  id : any;
  t : any;
  age : any;
  showAge : any;
  isEdit = false;
  roomId : '';
  sMaster : any;
  ot : any;
  submitButtonStatus = false;


  clientSubscription: Subscription;
  therapistSubscription: Subscription;
  infoSubscription: Subscription;
  assessmentMasterSubscription: Subscription;
  otSubscription: Subscription;
  stSubscription: Subscription;
  seSubscription: Subscription;
  btSubscription: Subscription;
  ngOnInit(): void {
    this.id =(this.activatedRoute.snapshot.params['id'])

    this.getInfo()
    this.getAssessmentMaster()
    this.otSubscription = this.viewOtAssessment()
    this.stSubscription = this.viewStAssessment()
    this.seSubscription = this.viewSeAssessment()
    this.btSubscription = this.viewBtAssessment()
    this.getFees()

    this.clientSubscription = this._http.getClients().subscribe((clients)=>{
      this.clients = clients
    })

    this.therapistSubscription = this._http.getTherapist().pipe(map((t : User[])=>t.filter((thp)=>{
      return thp.name == this.therapist
    }))).subscribe((x)=>{
        this.currentTherapist = x;
        this.therapyabbreviation = this.currentTherapist[0].therapyCategory.abbreviation
      })
  }

  clearControls(){
    this.dailySessionForm.reset()
  }

  currentTherapist: User[]=[]
  // getTherapist(){
  //   return this._http.getTherapist().subscribe((therapist)=>{
  //     this.currentTherapist = therapist ;
  //   })
  // }

  categories : Category[]=[]
  therapyabbreviation: any;
  session: any []=[];
  leaveSessionStart = false;
  compStat = false;
  getInfo(){
    this.infoSubscription = this._http.getAssessmentSession().pipe(map((session:Assessment[])=>session.filter((x)=>x._id==this.id))).subscribe((y)=>{
      if(y.length != 0){
        this.session = y
      }
      else{
        this.leaveSessionStart = true
        this.infoSubscription = this._http.getLeaveSession().pipe(map((session:LeaveSession[])=>session.filter((x)=>x._id == this.id)))
        .subscribe((res)=>{
          if(res.length !=0){
            this.session = res;
          }
          else{
            this.compStat = true;
            this.infoSubscription = this.therapistService.getCompensation().pipe(map((session:CompensationSession[])=>session.filter((x)=>x._id == this.id)))
            .subscribe((res)=>{
              if(res.length !=0){
                this.session = res;
              }
            })
          }
        })
      }
    })
  }

  ageCalculator(dob){
    const convertAge = new Date(dob);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let age = this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    return age ;
  }

  viewClient(id){
     let client = this.clients.find((x)=>{
     return  x._id === id;
    })
    this.router.navigateByUrl('therapist/clientinfo/' +id)
  }

  fees : Fees
  feesSub: Subscription;
  getFees(){
    this.feesSub = this.therapistService.getFees().subscribe((res)=>{
      this.fees = res
    })
  }

  sessionMasterId : any;
  assessmentMS: Subscription;
  startSession(){
    if(this.leaveSessionStart === false && this.compStat === false){
      let data = {
        date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
        assessment_id : this.id,
        therapistName : this.therapist,
        assessmentFee : this.fees[0].assessmentFee,
        feeStatus : false,
        sessionStatus : 'Assessment',
        category : this.therapyabbreviation
      }
      this.assessmentMS = this.therapistService.createAssessmentMaster(data).subscribe((x:AssessmentMaster)=>{
        this.sessionMasterId = x._id

        if(this.therapyabbreviation == 'OT')
          this.router.navigateByUrl('/therapist/otassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'SE')
          this.router.navigateByUrl('/therapist/seassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'ST')
          this.router.navigateByUrl('/therapist/stassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'BT')
          this.router.navigateByUrl('/therapist/btassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'PT')
          this.router.navigateByUrl('/therapist/ptassessmentdata/'+x._id)
      })
    }
    else if(this.leaveSessionStart === true && this.compStat === true){
      let data = {
        date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
        compensation_assessment_id : this.id,
        therapistName : this.therapist,
        assessmentFee : this.fees[0].assessmentFee,
        feeStatus : false,
        sessionStatus : 'CompensationAssessment',
        category : this.therapyabbreviation
      }
      this.assessmentMS = this.therapistService.createAssessmentMaster(data).subscribe((x:AssessmentMaster)=>{
        this.sessionMasterId = x._id

        if(this.therapyabbreviation == 'OT')
          this.router.navigateByUrl('/therapist/otassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'SE')
          this.router.navigateByUrl('/therapist/seassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'ST')
          this.router.navigateByUrl('/therapist/stassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'BT')
          this.router.navigateByUrl('/therapist/btassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'PT')
          this.router.navigateByUrl('/therapist/ptassessmentdata/'+x._id)
      })
    }
    else if(this.leaveSessionStart === true && this.compStat === false){
      let data = {
        date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
        leave_session_id : this.id,
        therapistName : this.therapist,
        assessmentFee : this.fees[0].assessmentFee,
        feeStatus : false,
        sessionStatus : 'LeaveAssessment',
        category : this.therapyabbreviation
      }
      this.assessmentMS = this.therapistService.createAssessmentMaster(data).subscribe((x:AssessmentMaster)=>{
        this.sessionMasterId = x._id

        if(this.therapyabbreviation == 'OT')
          this.router.navigateByUrl('/therapist/otassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'SE')
          this.router.navigateByUrl('/therapist/seassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'ST')
          this.router.navigateByUrl('/therapist/stassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'BT')
          this.router.navigateByUrl('/therapist/btassessmentdata/'+x._id)
        if(this.therapyabbreviation == 'PT')
          this.router.navigateByUrl('/therapist/ptassessmentdata/'+x._id)
      })
    }
  }

  sessionCount: AssessmentMaster[]=[];
  AssessmentMaster: AssessmentMaster[]=[];
  clientId : String;
  assessmentS: Subscription;
  leaveSS: Subscription;
  getAssessmentMaster(){
     this.assessmentS = this._http.getAssessmentById(this.id).subscribe((res)=>{
      let session = res
     
      if(session === null){
        this.leaveSS = this._http.getLeaveSessionById(this.id).subscribe((res: LeaveSession)=>{
          let session = res
          if(session === null){
            this.leaveSS = this.therapistService.getCompensationById(this.id).subscribe((res: CompensationSession)=>{
              let session = res
              this.clientId = session.clientName._id
              if(this.clientId != undefined){
              this.assessmentMasterSubscription = combineLatest(
                this.therapistService.getAssessmentMaster().pipe(
                  map((x : AssessmentMaster[]) => x.filter((y) =>
                    y.sessionStatus == "Assessment" &&
                    y.assessment_id.clientName._id == this.clientId)
                  )
                ),
                this.therapistService.getAssessmentMaster().pipe(
                  map((x : AssessmentMaster[]) => x.filter((y) =>
                    y.sessionStatus == "LeaveAssessment" &&
                    y.leave_session_id.clientName._id == this.clientId)
                  )
                ),
                this.therapistService.getAssessmentMaster().pipe(
                  map((x : AssessmentMaster[]) => x.filter((y) =>
                    y.sessionStatus == "CompensationAssessment"&&
                    y.compensation_assessment_id.clientName._id == this.clientId)
                  )
                ),
              ).subscribe(([s, z, x]) => {
                const aMaster = [...s, ...z, ...x];
                this.AssessmentMaster = aMaster;

                let currentDate = this.datePipe.transform(Date.now(), 'yyyy/MM/dd')

                this.sessionCount = aMaster.filter(x=>{
                  let sessionDate = this.datePipe.transform(x.date,'yyyy/MM/dd')
                  return sessionDate == currentDate && x.category === this.therapyabbreviation
                })
              })
              }
            })
          }
          else{
            this.clientId = session.clientName._id
            if(this.clientId != undefined){
            this.assessmentMasterSubscription = combineLatest(
              this.therapistService.getAssessmentMaster().pipe(
                map((x : AssessmentMaster[]) => x.filter((y) =>
                  y.sessionStatus == "Assessment" &&
                  y.assessment_id.clientName._id == this.clientId)
                )
              ),
              this.therapistService.getAssessmentMaster().pipe(
                map((x : AssessmentMaster[]) => x.filter((y) =>
                  y.sessionStatus == "LeaveAssessment" &&
                  y.leave_session_id.clientName._id == this.clientId)
                )
              ),
              this.therapistService.getAssessmentMaster().pipe(
                map((x : AssessmentMaster[]) => x.filter((y) =>
                  y.sessionStatus == "CompensationAssessment" &&
                  y.compensation_assessment_id.clientName._id == this.clientId)
                )
              ),
            ).subscribe(([s, z, x]) => {
              const aMaster = [...s, ...z, ...x];
              this.AssessmentMaster = aMaster;

              let currentDate = this.datePipe.transform(Date.now(), 'yyyy/MM/dd')

              this.sessionCount = aMaster.filter(x=>{
                let sessionDate = this.datePipe.transform(x.date,'yyyy/MM/dd')
                return sessionDate == currentDate && x.category === this.therapyabbreviation
              })
            })
            }
          }
        })
      }
      else{
        this.clientId = session.clientName._id
        if(this.clientId != undefined){
        this.assessmentMasterSubscription = combineLatest(
          this.therapistService.getAssessmentMaster().pipe(
            map((x : AssessmentMaster[]) => x.filter((y) =>
              y.sessionStatus == "Assessment" &&
              y.assessment_id.clientName._id == this.clientId)
            )
          ),
          this.therapistService.getAssessmentMaster().pipe(
            map((x : AssessmentMaster[]) => x.filter((y) =>
              y.sessionStatus == "LeaveAssessment" &&
              y.leave_session_id.clientName._id == this.clientId)
            )
          ),
          this.therapistService.getAssessmentMaster().pipe(
            map((x : AssessmentMaster[]) => x.filter((y) =>
              y.sessionStatus == "CompensationAssessment" &&
              y.compensation_assessment_id.clientName._id == this.clientId)
            )
          ),
        ).subscribe(([s, z, x]) => {
          const aMaster = [...s, ...z, ...x];
          this.AssessmentMaster = aMaster;

          let currentDate = this.datePipe.transform(Date.now(), 'yyyy/MM/dd')

          this.sessionCount = aMaster.filter(x=>{
            let sessionDate = this.datePipe.transform(x.date,'yyyy/MM/dd')
            return sessionDate == currentDate && x.category === this.therapyabbreviation
          })
        })
        }
      }
    })
  }

  otData: OtAssessment []=[]
  otSessionData: OtAssessment []=[]
  stData: StAssessmentForm []=[]
  stSessionData: StAssessmentForm []=[]
  seData: SeAssessment []=[]
  seSessionData: SeAssessment []=[]
  btData: BtAssessmentForm[] = []
  viewOtAssessment(){
    return this.therapistService.getOtAssessmentForm().subscribe((ot)=>{
      this.otData = ot
    })
  }

  viewStAssessment(){
    return this.therapistService.getStAssessmentForm().subscribe((st)=>{
      this.stData = st
    })
  }

  viewSeAssessment(){
    return this.therapistService.getSeAssessmentForm().subscribe((se)=>{
      this.seData = se
    })
  }

  viewBtAssessment(){
    return this.therapistService.getBtAssessmentForm().subscribe((se)=>{
      this.btData = se
    })
  }

  otId : any;
  stId : any
  seId : any;
  btId : any;
  getData(id){
    this.therapistService.getAssessmentMasterbyId(id).subscribe(res=>{
      if(res.category == 'OT'){
        let otSessionData = this.otData.find((x)=>{
          return  x.assessmentMasterId._id == id;
        })
        this.otId = otSessionData._id
        this.router.navigateByUrl('therapist/viewotassessmentform/' +this.otId)
      }

      if(res.category == 'ST'){
        let stSessionData = this.stData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
        this.stId = stSessionData._id
        this.router.navigateByUrl('therapist/viewstassessmentform/' +this.stId)
      }

      if(res.category == 'SE'){
        let seSessionData = this.seData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
      this.seId = seSessionData._id
      this.router.navigateByUrl('therapist/viewseassessmentform/' +this.seId)
      }

      if(res.category == 'BT'){
        let btSessionData = this.btData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
      this.btId = btSessionData._id
      this.router.navigateByUrl('therapist/viewbtassessmentform/' +this.btId)
      }
    })
  }


  editData(id: string){
    this.therapistService.getAssessmentMasterbyId(id).subscribe(res=>{
      if(res.category == 'OT'){
        let otSessionData = this.otData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
        this.otId = otSessionData._id
        this.router.navigateByUrl('therapist/editotassessmentform/' +this.otId)
      }
      if(res.category == 'ST'){
        let stSessionData = this.stData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
        this.stId = stSessionData._id
        this.router.navigateByUrl('therapist/eidtstassessmentform/' +this.stId)
      }
      if(res.category == 'SE'){
        let seSessionData = this.seData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
      this.seId = seSessionData._id
      this.router.navigateByUrl('therapist/editseassessmentform/' +this.seId)
      }
      if(res.category == 'BT'){
        let btSessionData = this.btData.find((x)=>{
          return  x.assessmentMasterId._id === id;
        })
      this.btId = btSessionData._id
      this.router.navigateByUrl('therapist/editbtassessmentform/' +this.btId)
      }
    })
  }

  endAssessment(){
    const dialogRef = this.dialog.open(EndAssessmentDialogueComponent, {
      width: '600px',
      data: {
        assessmentId : this.activatedRoute.snapshot.params['id'],
        slotId : this.session[0].slotName._id,
        clientId : this.session[0].clientName._id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getInfo()
    })
  }

  onSubmit() {}

}

