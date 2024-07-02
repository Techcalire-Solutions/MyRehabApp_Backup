import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, map, combineLatest } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Session } from 'src/app/Modules/admin/models/session';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/auth/models/User';
import { BtSessionData } from '../../../models/btSessionData';
import { OtSessionData } from '../../../models/otSessionData';
import { SeSessionData } from '../../../models/seSessionData';
import { SessionMaster } from '../../../models/sessionMaster';
import { StSessionData } from '../../../models/stSessionData';
import { TherapistService } from '../../../therapist.service';
import { ParentService } from 'src/app/Modules/parent/parent.service';

@Component({
  selector: 'app-view-completed-sessions',
  templateUrl: './view-completed-sessions.component.html',
  styleUrls: ['./view-completed-sessions.component.scss']
})
export class ViewCompletedSessionsComponent implements OnInit, OnDestroy {


    displayedColumns: string[] = ['date', 'sessionType', 'client_id','session_id', 'therapistName','task', 'manage'];

    therapistName : any;
    constructor(private fb: FormBuilder, public authService:AuthService, private adminService:AdminService, private therapistService: TherapistService,
      private _snackBar: MatSnackBar, private router: Router, private parentService: ParentService) {

        let token = localStorage.getItem('token')
        this.therapistName = JSON.parse(token)?.username
    }

    ngOnDestroy(): void {
      this.otSubscription.unsubscribe()
      this.stSubscription.unsubscribe()
      this.seSubscription.unsubscribe()
      this.btSubscription.unsubscribe()
      this.sessionMS.unsubscribe()
      if(this.dataS){
        this.dataS.unsubscribe()
      }
    }

    sessionMasterSubscription: Subscription;
    otSubscription: Subscription;
    stSubscription: Subscription;
    seSubscription: Subscription;
    btSubscription: Subscription;
    ngOnInit(): void {
      this.getSessionMaster();
      this.otSubscription = this.viewOtSessions()
      this.stSubscription = this.viewStSessions()
      this.seSubscription = this.viewSeSessions()
      this.btSubscription = this.viewBtSessions()
    }

    therapyabbreviation : any;
    completedSessions : SessionMaster[] = [];
    id : any;
    sessionMS: Subscription;
    getSessionMaster(){
      this.sessionMS = combineLatest(
        this.therapistService.getSessionMaster()
        .pipe(map((x: SessionMaster[]) =>
            x.filter((y) => y.sessionStatus === 'Session' &&
                            y.session_id.status == false )
          )
        ),
        this.therapistService.getSessionMaster().pipe(
          map((x: SessionMaster[]) =>
            x.filter((y) => y.sessionStatus === 'LeaveSession' )
          )
        ),
        this.therapistService.getSessionMaster().pipe(
          map((x: SessionMaster[]) =>
            x.filter((y) => y.sessionStatus === 'CompensationSession')
          )
        )
      ).subscribe(([s, z, x]) => {
        const session = [...s, ...z, ...x];
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
          if (sessionStatus === 'leavesession') {
            // If sessionStatus is 'LeaveSession', use 'leave_session_id'
            return (
              element.leave_session_id.clientName.firstName.toLowerCase().includes(filterValue) ||
              element.leave_session_id.clientName.emergencyNumber.toString().includes(filterValue) ||
              element.leave_session_id.therapistName.name.toLowerCase().includes(filterValue) ||
              element.leave_session_id.slotName.slotName.toLowerCase().includes(filterValue)
            );
          } else if(sessionStatus === 'session') {
            // Otherwise, use 'session_id'
            return (
              element.session_id.clientName.firstName.toLowerCase().includes(filterValue) ||
              element.session_id.clientName.emergencyNumber.toString().includes(filterValue) ||
              element.session_id.therapistName.name.toLowerCase().includes(filterValue) ||
              element.session_id.slotName.slotName.toLowerCase().includes(filterValue)
            );
          }else {
            // Otherwise, use 'session_id'
            return (
              element.compensation_session_id.clientName.firstName.toLowerCase().includes(filterValue) ||
              element.compensation_session_id.clientName.emergencyNumber.toString().includes(filterValue) ||
              element.compensation_session_id.therapistName.name.toLowerCase().includes(filterValue) ||
              element.compensation_session_id.slotName.slotName.toLowerCase().includes(filterValue)
            );
          }
        });
      } else {
        this.getSessionMaster();
      }
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
  sMaster : SessionMaster
  dataS: Subscription;
  getData(id){
    this.dataS = this.therapistService.getSessionMasterbyId(id).subscribe((res)=>{
      this.sMaster = res
      if(this.sMaster.sessionStatus === 'Session'){
        this.therapyabbreviation = this.sMaster.session_id.therapistName.therapyCategory.abbreviation.toUpperCase()
      }else{
        this.therapyabbreviation = this.sMaster.leave_session_id.therapistName.therapyCategory.abbreviation.toUpperCase()
      }

      if(this.therapyabbreviation.toUpperCase() == 'OT'){
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

      if(this.therapyabbreviation.toUpperCase() == 'ST'){
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

      if(this.therapyabbreviation.toUpperCase() == 'SE'){
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
      if(this.therapyabbreviation.toUpperCase() == 'BT'){
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
    this.dataS = this.therapistService.getSessionMasterbyId(id).subscribe((res)=>{
      this.sMaster = res
      if(this.sMaster.sessionStatus === 'Session'){
        this.therapyabbreviation = this.sMaster.session_id.therapistName.therapyCategory.abbreviation.toUpperCase()
      }else{
        this.therapyabbreviation = this.sMaster.leave_session_id.therapistName.therapyCategory.abbreviation.toUpperCase()
      }

      if(this.therapyabbreviation.toUpperCase() == 'OT'){
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
      if(this.therapyabbreviation.toUpperCase() == 'ST'){
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
      if(this.therapyabbreviation.toUpperCase() == 'SE'){
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
      if(this.therapyabbreviation.toUpperCase() == 'BT'){
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

  addTask(id: string){
    this.router.navigateByUrl('therapist/viewcompletedsessions/addtask/' + id)
  }
}
