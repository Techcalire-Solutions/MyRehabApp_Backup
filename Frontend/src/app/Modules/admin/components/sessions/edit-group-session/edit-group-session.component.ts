import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { GroupSession } from '../../../models/groupSession';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../../../models/client';
import { User } from '../../../models/user';

@Component({
  selector: 'app-edit-group-session',
  templateUrl: './edit-group-session.component.html',
  styleUrls: ['./edit-group-session.component.scss']
})
export class EditGroupSessionComponent implements OnInit {

  ngOnDestroy(){
    this.sessionSub.unsubscribe();
    this.cliSub.unsubscribe();
    this.theSub.unsubscribe();
    if(this.addCS){
      this.addCS.unsubscribe();
    }
    if(this.addTS){
      this.addTS.unsubscribe();
    }
  }

  constructor(private _http: AdminService, public dialogRef: MatDialogRef<EditGroupSessionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getSession()
    this.getClient()
    this.getTherapist()
  }

  attendeeForm = this.fb.group({
    therapistId: [''],
    clientId: ['']
  })


  sessionSub: Subscription;
  sessions: GroupSession[]
  session: GroupSession
  getSession(){
    this.sessionSub = this._http.getGroupSession().subscribe((s)=>{
      this.sessions = s;

      this.session = this.sessions.find(x => x._id == this.data.sessionId)
    })
  }

  clients : Client []=[];
  clientsWL : Client []=[];
  cliSub: Subscription;
  getClient(){
    this.cliSub = this._http.getClients().subscribe((c)=>{
      this.clients = c.filter(x=>x.status == 'RS');
    })
  }

  users: User[] =[];
  theSub: Subscription;
  getTherapist(){
    this.theSub = this._http.getTherapist().subscribe((u)=>{
      this.users = u;
    })
  }

  isEditClient: boolean = false
  editClient(){
    this.isEditClient = true;

    const clientIds: any = this.session.clientName.map((client: any) => client.clientId._id);

    this.attendeeForm.patchValue({
      clientId: clientIds // Make sure clientId is an array of values
    });
  }

  isEditTherapist: boolean = false
  editTherapist(){
    this.isEditTherapist = true

    const therapistIds: any = this.session.therapistName.map((user: any) => user.therapistId._id);

    this.attendeeForm.patchValue({
      therapistId: therapistIds // Make sure clientId is an array of values
    });
  }

  addCS: Subscription;
  addclient(){
    let groupSession = this.attendeeForm.getRawValue()

    let clieName = []
    for( let i = 0; i < groupSession.clientId.length; i++ ){
      clieName[i] = {
        clientId : groupSession.clientId[i],
      }
    }

    let dataUpdate = {
      clientName: clieName
    }

    this.addCS = this._http.updateClientGroup(this.data.sessionId, dataUpdate).subscribe(res=>{

      this.dialogRef.close();
      this._snackBar.open("Client List Updated Successfully...","" ,{duration:3000})
    })
  }

  addTS: Subscription;
  addTherapist(){
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

    this.addTS = this._http.updateTherapistGroup(this.data.sessionId, dataUpdate).subscribe(res=>{

      this.dialogRef.close();
      this._snackBar.open("Therapist List Updated Successfully...","" ,{duration:3000})
    })
  }
}
