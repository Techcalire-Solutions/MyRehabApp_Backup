import { Category } from './../../../../admin/models/category';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Room } from 'src/app/Modules/admin/models/room';
import { Session } from 'src/app/Modules/admin/models/session';
import { TherapistService } from '../../../therapist.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { SessionMaster } from '../../../models/sessionMaster';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { OtSessionData } from '../../../models/otSessionData';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { DatePipe } from '@angular/common';
import { StSessionData } from '../../../models/stSessionData';
import { SeSessionData } from '../../../models/seSessionData';
import { User } from 'src/app/Modules/admin/models/user';
import { BtSessionData } from '../../../models/btSessionData';
import { EndSessionDialogueComponent } from '../end-session-dialogue/end-session-dialogue.component';
import { Fees } from 'src/app/Modules/admin/models/fees';
import { Concession } from 'src/app/Modules/admin/models/concession';
import { StartSessionDialogueComponent } from '../start-session-dialogue/start-session-dialogue.component';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { combineLatest } from 'rxjs';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';



@Component({
  selector: 'app-daily-session-data',
  templateUrl: './daily-session-data.component.html',
  styleUrls: ['./daily-session-data.component.scss']
})
export class DailySessionDataComponent implements OnInit, OnDestroy {

  dailySessionForm = this.fb.group({
  });

  displayedColumns: string[] = ['date', 'session_id', 'therapistName','sessionStatus','manage'];


  assessments : Assessment[] = [];
  rooms: Room []=[]

  selectedSessions: Session []=[]
  clients: Client []=[]


  therapist : any;
  datepipe: any;
  therapistId: string;
  constructor(private fb: FormBuilder ,private adminService:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    private router: Router,  public authService:AuthService, private therapistService: TherapistService, public dialog:MatDialog,
    private datePipe: DatePipe) {
      let token = localStorage.getItem('token')
      this.therapistId = JSON.parse(token)?.id
      this.therapist = JSON.parse(token)?.username
  }

  ngOnDestroy(): void {
    this.infoSubscription?.unsubscribe()
    this.concessionSubscription?.unsubscribe();
    this.feesSubscription?.unsubscribe();
    this.otSubscription?.unsubscribe();
    this.stSubscription?.unsubscribe();
    this.seSubscription?.unsubscribe();
    this.btSubscription?.unsubscribe();
    if(this.sessionMS){
      this.sessionMS.unsubscribe();
    }
    this.clientSub?.unsubscribe();
    if(this.leaveSS){
      this.leaveSS.unsubscribe();
    }
    this.sessionS?.unsubscribe();
    if(this.leaveSeS){
      this.leaveSeS.unsubscribe();
    }
    this.sessionMasterSubscription?.unsubscribe();
  }

  id : any;
  therapyabbreviation: String;
  currentTherapist: User[]=[]
  infoSubscription: Subscription;
  feesSubscription: Subscription;
  concessionSubscription: Subscription;
  sessionMasterSubscription: Subscription;
  otSubscription: Subscription;
  stSubscription: Subscription;
  seSubscription: Subscription;
  btSubscription: Subscription;
  clientSub: Subscription;
  ngOnInit(): void {
    this.id =(this.activatedRoute.snapshot.params['id'])

    this.getInfo()
    this.getSessionMaster()
    this.otSubscription = this.viewOtSessions()
    this.stSubscription = this.viewStSessions()
    this.seSubscription = this.viewSeSessions()
    this.btSubscription = this.viewBtSessions()
    this.concessionSubscription = this.getConcession()
    this.feesSubscription = this.getFees()

    this.clientSub = this.adminService.getClients().subscribe((clients)=>{
      this.clients = clients
    })
  }

  clearControls(){
    this.dailySessionForm.reset()
  }

  session: any[]=[];
  leaveSessionStart = false;
  clientId : any;
  compStat = false;
  getInfo(){
    this.infoSubscription = this.adminService.getSession().pipe(map((session:Session[])=>session.filter((x)=>x._id == this.id))).subscribe((y)=>{
      if(y.length != 0){
        this.session = y
        this.therapyabbreviation = this.session[0].therapistName.therapyCategory.abbreviation
      }
      else{
        this.leaveSessionStart = true
        this.infoSubscription = this.adminService.getLeaveSession().pipe(map((session:LeaveSession[])=>session.filter((x)=>x._id == this.id))).subscribe((y)=>{
          if(y.length != 0){
            this.session = y
            this.therapyabbreviation = this.session[0].therapistName.therapyCategory.abbreviation
          }else{
            this.compStat = true;
            this.infoSubscription = this.therapistService.getCompensation().pipe(map((session:CompensationSession[])=>session.filter((x)=>x._id == this.id))).subscribe((y)=>{
              if(y.length != 0){
                this.session = y
                this.therapyabbreviation = this.session[0].therapistName.therapyCategory.abbreviation
              }
            })
          }

        })
      }

    })
  }

  showAge : any;
  ageCalculator(dob){
    const convertAge = new Date(dob);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let age = this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    return age ;
  }

  viewClient(id: String){
     let client = this.clients.find((x)=>{
     return  x._id === id;
    })
    this.router.navigateByUrl('therapist/clientinfo/' +id)
  }

  fees : Fees
  getFees(){
    return this.therapistService.getFees().subscribe((res)=>{
      this.fees = res
    })
  }

  concessions : Concession[] = []
  getConcession(){
    return this.adminService.getConcession().subscribe((res)=>{
      this.concessions = res
    })
  }

  sessionMasteId : any;
  concession : any
  sessionMS: Subscription;
  leaveSS: Subscription;
  lmcSub: Subscription;
  lmcStatus = false;
  startSession(){
    // const dialogRef = this.dialog.open(StartSessionDialogueComponent, {
    //   width: '500px',
    //   data: {}
    // });

    let discount: Number = 0;

    this.concession = this.concessions.find(x => x.clientId._id === this.session[0].clientName._id)

    if(this.concession){
      discount = this.concession.concessionAmount
    }

    // dialogRef.afterClosed().subscribe(res => {
      // if(res == true){
        if(this.leaveSessionStart === false && this.compStat == false){
          let data = {
            date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
            session_id : this.id,
            therapistName : this.therapist,
            sessionFee : this.fees[0].sessionFee,
            feeStatus : false,
            concession : discount,
            sessionStatus : 'Session',
            category : this.therapyabbreviation,
            therapistId : this.therapistId
          }
          this.sessionMS = this.therapistService.createSessionMaster(data).subscribe((x:SessionMaster)=>{
            this.sessionMasteId = x._id
            if(this.therapyabbreviation.toUpperCase() == 'OT')
              this.router.navigateByUrl('/therapist/otsessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'SE')
              this.router.navigateByUrl('/therapist/sesessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'ST')
              this.router.navigateByUrl('/therapist/stsessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'BT')
              this.router.navigateByUrl('/therapist/btsessiondata/'+this.sessionMasteId+'/'+this.id)
          })
        }
        else if(this.leaveSessionStart === true && this.compStat == true){
          let data = {
            date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
            compensation_session_id : this.id,
            therapistName : this.therapist,
            sessionFee : this.fees[0].sessionFee,
            feeStatus : false,
            concession : discount,
            sessionStatus : 'CompensationSession',
            category : this.therapyabbreviation,
            therapistId : this.therapistId
          }
          this.sessionMS = this.therapistService.createSessionMaster(data).subscribe((x:SessionMaster)=>{
            this.sessionMasteId = x._id
            if(this.therapyabbreviation.toUpperCase() == 'OT')
              this.router.navigateByUrl('/therapist/otsessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'SE')
              this.router.navigateByUrl('/therapist/sesessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'ST')
              this.router.navigateByUrl('/therapist/stsessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'BT')
              this.router.navigateByUrl('/therapist/btsessiondata/'+this.sessionMasteId+'/'+this.id)
          })
        }
        else if(this.leaveSessionStart === true && this.compStat == false){
          let data = {
            date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
            leave_session_id : this.id,
            therapistName : this.therapist,
            sessionFee : this.fees[0].sessionFee,
            feeStatus : false,
            concession : discount,
            sessionStatus : 'LeaveSession',
            category : this.therapyabbreviation,
            therapistId : this.therapistId
          }
          this.sessionMS = this.therapistService.createSessionMaster(data).subscribe((x:SessionMaster)=>{
            this.sessionMasteId = x._id

            let status = {
              status : true
            }
            this.leaveSS = this.adminService.updateLeaveSessionStatue(this.id, status).subscribe((x)=>{})

            if(this.therapyabbreviation.toUpperCase() == 'OT')
              this.router.navigateByUrl('/therapist/otsessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'SE')
              this.router.navigateByUrl('/therapist/sesessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'ST')
              this.router.navigateByUrl('/therapist/stsessiondata/'+this.sessionMasteId+'/'+this.id)
            if(this.therapyabbreviation.toUpperCase() == 'BT')
              this.router.navigateByUrl('/therapist/btsessiondata/'+this.sessionMasteId+'/'+this.id)
          })
        }
      // }
      // else{
      //   this.lmcStatus = true;
      //   let data = {
      //     date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
      //     clientId : this.session[0].clientName._id,
      //     slotId : this.session[0].slotName._id,
      //     sessionStatus : 'LMC',
      //     sessionFee: this.fees[0].lmc,
      //     feeStatus: false,
      //     session_id: this.id,
      //     concession: 0
      //   }
      //   this.lmcSub = this.adminService.addLmc(data).subscribe((res)=>{
      //     this.getSessionMaster()
      //     history.back()
      //   })
      // }
    // })

  }

  addGoal(id){
    this.router.navigateByUrl('therapist/addgoalse/' +id)
  }

  sessionCount: SessionMaster[]=[];
  sessionMaster: SessionMaster[]=[];
  sessionS: Subscription
  leaveSeS: Subscription
  getSessionMaster(){
    this.sessionS = this.adminService.getSessionById(this.id).subscribe((res)=>{
      let session = res
      if(session === null){
        this.leaveSeS = this.adminService.getLeaveSessionById(this.id).subscribe((res: LeaveSession)=>{
          let session = res
          if(session === null){
            this.leaveSeS = this.therapistService.getCompensationById(this.id).subscribe((res: CompensationSession)=>{
              let session = res
              this.clientId = session.clientName._id
              this.sessionMasterSubscription = combineLatest(
                this.therapistService.getSessionMaster().pipe(
                  map((x : SessionMaster[]) => x.filter((y) =>
                    y.sessionStatus == "Session" &&
                    y.session_id.clientName._id == this.clientId)
                  )
                ),
                this.therapistService.getSessionMaster().pipe(
                  map((x : SessionMaster[]) => x.filter((y) =>
                    y.sessionStatus == "LeaveSession" &&
                    y.leave_session_id.clientName._id == this.clientId)
                  )
                ),
                this.therapistService.getSessionMaster().pipe(
                  map((x : SessionMaster[]) => x.filter((y) =>
                    y.sessionStatus == "CompensationSession" &&
                    y.compensation_session_id.clientName._id == this.clientId)
                  )
                ),
              ).subscribe(([s, z, x]) => {
                const aMaster = [...s, ...z, ...x];
                this.sessionMaster = aMaster;
                let currentDate = this.datePipe.transform(Date.now(), 'yyyy/MM/dd')

                this.sessionCount = aMaster.filter(x=>{
                  let sessionDate = this.datePipe.transform(x.date,'yyyy/MM/dd')
                  return sessionDate == currentDate && x.category === this.therapyabbreviation
                })
              })
            })
          }else{
            this.clientId = session.clientName._id
            this.sessionMasterSubscription = combineLatest(
              this.therapistService.getSessionMaster().pipe(
                map((x : SessionMaster[]) => x.filter((y) =>
                  y.sessionStatus == "Session" &&
                  y.session_id.clientName._id == this.clientId)
                )
              ),
              this.therapistService.getSessionMaster().pipe(
                map((x : SessionMaster[]) => x.filter((y) =>
                  y.sessionStatus == "LeaveSession" &&
                  y.leave_session_id.clientName._id == this.clientId)
                )
              ),
              this.therapistService.getSessionMaster().pipe(
                map((x : SessionMaster[]) => x.filter((y) =>
                  y.sessionStatus == "CompensationSession" &&
                  y.compensation_session_id.clientName._id == this.clientId)
                )
              ),
            ).subscribe(([s, z, x]) => {
              const aMaster = [...s, ...z, ...x];
              this.sessionMaster = aMaster;
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
        this.sessionMasterSubscription = combineLatest(
          this.therapistService.getSessionMaster().pipe(
            map((x : SessionMaster[]) => x.filter((y) =>
              y.sessionStatus == "Session" &&
              y.session_id.clientName._id == this.clientId)
            )
          ),
          this.therapistService.getSessionMaster().pipe(
            map((x : SessionMaster[]) => x.filter((y) =>
              y.sessionStatus == "LeaveSession" &&
              y.leave_session_id.clientName._id == this.clientId)
            )
          ),
          this.therapistService.getSessionMaster().pipe(
            map((x : SessionMaster[]) => x.filter((y) =>
              y.sessionStatus == "CompensationSession" &&
              y.compensation_session_id.clientName._id == this.clientId)
            )
          ),
        ).subscribe(([s, z, x]) => {
          const aMaster = [...s, ...z, ...x];
          this.sessionMaster = aMaster;
          let currentDate = this.datePipe.transform(Date.now(), 'yyyy/MM/dd')

          this.sessionCount = aMaster.filter(x=>{
            let sessionDate = this.datePipe.transform(x.date,'yyyy/MM/dd')
            return sessionDate == currentDate && x.category === this.therapyabbreviation
          })
        })
      }

    })
    // return this.therapistService.getSessionMaster()
    // .pipe(map((sm : SessionMaster[])=>sm.filter((y)=>{
    //   return y.session_id._id == this.activatedRoute.snapshot.params['id']}))).subscribe((sMaster)=>{
    //     this.sessionMaster = sMaster;

    //     let currentDate = this.datePipe.transform(Date.now(), 'yyyy/MM/dd')

    //     this.sessionCount = sMaster.filter(x=>{
    //       let sessionDate = this.datePipe.transform(x.date,'yyyy/MM/dd')
    //       return sessionDate == currentDate
    //     })
    //  })
  }

  otData: OtSessionData []=[]
  otSessionData: OtSessionData []=[]
  stData: StSessionData []=[]
  stSessionData: StSessionData []=[]
  seData: SeSessionData []=[]
  seSessionData: SeSessionData []=[]
  btData: BtSessionData []=[]
  btSessionData: BtSessionData []=[]
  viewOtSessions(){
    return this.therapistService.getOtSessionData().subscribe((ot)=>{
      this.otData = ot
    })
  }

  viewStSessions(){
    return this.therapistService.getStSessionData().subscribe((st)=>{
      this.stData = st
    })
  }

  viewSeSessions(){
    return this.therapistService.getSeSessionData().subscribe((se)=>{
      this.seData = se
    })
  }

  viewBtSessions(){
    return this.therapistService.getBtSessionData().subscribe((bt)=>{
      this.btData = bt
    })
  }

  otId : any;
  stId : any
  seId : any;
  btId : any;
  getData(id){
    this.therapistService.updateSessionId(this.activatedRoute.snapshot.params['id'])
    this.therapistService.getSessionMasterbyId(id).subscribe(res=>{

      if(res.category == 'OT'){
        let otSessionData = this.otData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(otSessionData){
          this.otId = otSessionData._id
          this.router.navigateByUrl('therapist/viewotsessiondata/' + this.otId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }

      if(res.category == 'ST'){
        let stSessionData = this.stData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(stSessionData){
          this.stId = stSessionData._id
          this.router.navigateByUrl('therapist/viewstsessiondata/' +this.stId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }

      if(res.category == 'SE'){
        let seSessionData = this.seData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(seSessionData){
          this.seId = seSessionData._id
          this.router.navigateByUrl('therapist/viewsesessiondata/' + this.id + '/' + this.seId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }
      if(res.category == 'BT'){
        let btSessionData = this.btData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(btSessionData){
          this.btId = btSessionData._id
          this.router.navigateByUrl('therapist/viewbtsessiondata/' + this.btId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }
    })
  }

  editData(id){
    this.therapistService.updateSessionId(this.activatedRoute.snapshot.params['id'])
    this.therapistService.getSessionMasterbyId(id).subscribe(res=>{
      if(res.category == 'OT'){
        let otSessionData = this.otData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(otSessionData){
          this.otId = otSessionData._id
          this.router.navigateByUrl('therapist/editotsession/' +this.otId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }
      if(res.category == 'ST'){
        let stSessionData = this.stData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(stSessionData){
          this.stId = stSessionData._id
          this.router.navigateByUrl('therapist/editstsession/' +this.stId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }
      if(res.category == 'SE'){
        let seSessionData = this.seData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(seSessionData){
          this.seId = seSessionData._id
          this.router.navigateByUrl('therapist/viewsesessiondata/' + this.id + '/' + this.seId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }
      if(res.category == 'BT'){
        let btSessionData = this.btData.find((x)=>{
          return  x.session_master_id._id === id;
        })
        if(btSessionData){
          this.btId = btSessionData._id
          this.router.navigateByUrl('therapist/editbtsession/' + this.btId)
        }
        else{
          this._snackBar.open("There is no completed session associated with this date...","" ,{duration:3000})
        }
      }
    })
  }

  endSession(){
    const dialogRef = this.dialog.open(EndSessionDialogueComponent, {
      width: '600px',
      data: {
        sessionId : this.activatedRoute.snapshot.params['id'],
        slotId : this.session[0].slotName._id,
        clientId : this.session[0].clientName._id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getInfo()
    })
  }
}
