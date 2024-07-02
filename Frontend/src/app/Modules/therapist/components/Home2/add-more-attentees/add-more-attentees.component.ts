import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { User } from 'src/app/Modules/auth/models/User';
import { GroupMaster } from '../../../models/groupMaster';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Concession } from 'src/app/Modules/admin/models/concession';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-more-attentees',
  templateUrl: './add-more-attentees.component.html',
  styleUrls: ['./add-more-attentees.component.scss']
})
export class AddMoreAttenteesComponent implements OnInit {

  ngOnDestroy(){
    this.sessionSub.unsubscribe();
    this.getSub.unsubscribe();
    this.conSub.unsubscribe();
    if(this.clientS){
      this.clientS.unsubscribe();
    }
    if(this.therapistS){
      this.therapistS.unsubscribe();
    }
  }

  constructor(private adminService: AdminService, public dialogRef: MatDialogRef<AddMoreAttenteesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  attendeeForm = this.fb.group({
    therapistId: [''],
    clientId: ['']
  })

  ngOnInit(): void {
    this.getSession();
    this.getMasterById()
    this.getConcession()
  }

  sessionSub: Subscription;
  clients: any[];
  user: any[]
  getSession(){
    this.sessionSub = this.adminService.getGroupSessionById(this.data.id).subscribe(data => {
      this.clients = data.clientName
      this.user = data.therapistName
    })
  }

  master: GroupMaster;
  clientsAdded: any[] = []
  therapsistsAdded: any[] = []
  sessionId: String
  getSub: Subscription;
  clientId = new FormControl('');
  clientsId : string
  getMasterById(){
    this.getSub = this.adminService.getGroupMasterById(this.data.masterId).subscribe(data => {
      this.master = data
      // this.clientsAdded = data.clientName
      // this.therapsistsAdded = data.therapistName

      const therapistIds: any = this.master.therapistName.map((user: any) => user.therapistId._id);

      this.attendeeForm.patchValue({
        therapistId: therapistIds // Make sure clientId is an array of values
      });

      const clientIds: any = this.master.clientName.map((client: any) => client.clientId._id);

      this.attendeeForm.patchValue({
        clientId: clientIds // Make sure clientId is an array of values
      });
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

  clientS: Subscription;
  addClients(){
    let groupSession = this.attendeeForm.getRawValue()

    let clieName = []
    for( let i = 0; i < groupSession.clientId.length; i++ ){
      this.concession = 0;
      let clientConcession = this.concessions.filter(x=> x.clientId._id === groupSession.clientId[i])

      if( clientConcession[0] != undefined){
        this.concession = clientConcession[0].concessionAmount
      }
      clieName[i] = {
        clientId : groupSession.clientId[i],
        concession: this.concession
      }
    }
    let dataUpdate = {
      clientName: clieName
    }

    this.clientS = this.adminService.updateClientGroupMasterById(this.data.masterId, dataUpdate).subscribe(res=>{

      this.dialogRef.close();
      this._snackBar.open("Client List Updated Successfully...","" ,{duration:3000})
    })
  }

  therapistS: Subscription;
  addTherapists(){
    let groupSession = this.attendeeForm.getRawValue()

    let therapiName = []
    for( let i = 0; i < groupSession.therapistId.length; i++ ){
      therapiName[i] = {
        therapistId : groupSession.therapistId[i]
      }
    }

    let dataUpdate = {
      therapistName: therapiName
    }

    this.therapistS = this.adminService.updateTherapistGroupMasterById(this.data.masterId, dataUpdate).subscribe(res=>{

      this.dialogRef.close();
      this._snackBar.open("Therapist List Updated Successfully...","" ,{duration:3000})
    })
  }

}
