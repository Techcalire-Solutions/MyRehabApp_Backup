import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { GroupSession } from 'src/app/Modules/admin/models/groupSession';
import { User } from 'src/app/Modules/auth/models/User';
import { Fees } from '../../../models/fees';
import { TherapistService } from '../../../therapist.service';
import { Concession } from 'src/app/Modules/admin/models/concession';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-group-session-dialog',
  templateUrl: './group-session-dialog.component.html',
  styleUrls: ['./group-session-dialog.component.scss']
})
export class GroupSessionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GroupSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private adminService: AdminService, private fb: FormBuilder,
    private therapistService: TherapistService, private _snackBar: MatSnackBar,private datePipe: DatePipe) { }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

    sMasterForm = this.fb.group({
      clientId: '',
      therapistId: ''
    })

  ngOnDestroy() {
    this.getSub.unsubscribe();
    this.feeSub.unsubscribe();
    this.conSub.unsubscribe();
    if(this.groupSub){
      this.groupSub.unsubscribe();
    }
  }

  id: String
  ngOnInit(): void {
    this.id = this.data.id

    this.getSession();
    this.getFees();
    this.getConcession();
  }

  getSub: Subscription;
  session: GroupSession
  getSession(){
    this.getSub = this.adminService.getGroupSessionById(this.id).subscribe(res=>{
      this.session = res
    })
  }

  fees : Fees
  feeSub: Subscription;
  getFees(){
    this.feeSub = this.therapistService.getFees().subscribe((res)=>{
      this.fees = res
    })
  }

  concessions : Concession[] = []
  conSub: Subscription;
  concession : Number = 0;
  getConcession(){
    this.conSub = this.adminService.getConcession().subscribe((res)=>{
      this.concessions = res
    })
  }

  selectedAttendeeIds: any[] = [];
  updateSelection(client: Client, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedAttendeeIds.push(client._id);
    } else {
      this.selectedAttendeeIds = this.selectedAttendeeIds.filter(id => id !== client._id);
    }
  }

  selectedTherapistIds: any[] = [];
  therapists(therapist: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedTherapistIds.push(therapist._id);
    } else {
      this.selectedTherapistIds = this.selectedTherapistIds.filter(id => id !== therapist._id);
    }
  }

  groupSub: Subscription;
  onSubmit(){
    let therapiName = []
    for( let i = 0; i < this.selectedTherapistIds.length; i++ ){
      therapiName[i] = {
        therapistId : this.selectedTherapistIds[i],
      }
    }

    let clieName = []
    for( let i = 0; i < this.selectedAttendeeIds.length; i++ ){
      this.concession = 0;
      let clientConcession = this.concessions.filter(x=> x.clientId._id === this.selectedAttendeeIds[i])
      if( clientConcession[0] != undefined){
        this.concession = clientConcession[0].concessionAmount
      }
      clieName[i] = {
        clientId : this.selectedAttendeeIds[i],
        concession: this.concession,
        sessionFee: this.fees[0].groupSessionFee,
        feeStatus: false
      }
    }

    let data = {
      therapistName: therapiName,
      clientName: clieName,
      session_id: this.id,
      date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd')
    }

    this.groupSub = this.adminService.addGroupMaster(data).subscribe((res)=>{
      this._snackBar.open("Group Session Master added successfully...","" ,{duration:3000})
      // this.clearControls()
    })
  }
}
