import { Leaves } from './../../../models/leaves';
import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Client } from '../../../models/client';
import { AdminService } from '../../../admin.service';
import { Session } from '../../../models/session';
import { FormBuilder, Validators } from '@angular/forms';
import { Lmc } from '../../../models/lmc';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-lmc-dialogue',
  templateUrl: './edit-lmc-dialogue.component.html',
  styleUrls: ['./edit-lmc-dialogue.component.scss']
})
export class EditLmcDialogueComponent implements OnInit {
  ngOnDestroy(){
    this.leaveVS.unsubscribe();
    this.clientSubscription.unsubscribe();
    if(this.slotS){
      this.slotS.unsubscribe();
    }
    if(this.lmcS){
      this.lmcS.unsubscribe();
    }
    if(this.submitS){
      this.submitS.unsubscribe();
    }
  }

  constructor(private adminService: AdminService, private fb: FormBuilder, private datePipe:DatePipe,
    public dialogRef: MatDialogRef<EditLmcDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  addLeaveForm = this.fb.group({
    clientId : ['', Validators.required],
    date : [],
    slotId: ['']
  })

  leaveVS: Subscription;
  ngOnInit(): void {
    this.clientSubscription = this.getClient()
    this.editLmc()

    this.leaveVS = this.addLeaveForm.valueChanges.subscribe((value) => {
      if (value.date) {
        this.findDays();
      }
    });
  }

  clients : Client []=[];
  clientSubscription : Subscription
  getClient(){
    return this.adminService.getClients().subscribe((c)=>{
      this.clients = c.filter(x=> x.status != 'WL');
    })
  }

  session: Session[] = [];
  slotS: Subscription;
  getSlotByClient(id){
    this.slotS = this.adminService.getSessionByClientId(id).subscribe((res)=>{
      this.session = res
    })
  }

  filteredSession : Session[] = [];
 findDays(){
  const date = this.addLeaveForm.get('date').value;
  const newDate = new Date(date);

  // Get the UTC date by adding the time zone offset
  const utcDate = new Date(
    Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
  );

  // Set the time to the beginning of the day in UTC
  utcDate.setUTCHours(0, 0, 0, 0);

  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' });
  const weekday = formatter.format(utcDate);

  // Filter the sessions based on the weekday
  this.filteredSession = this.session.filter(x => x.slotName.weekDay === weekday);

 }


  leave : Lmc[]=[];
  lmcS: Subscription;
  editLmc(){
   this.lmcS = this.adminService.getLmc().subscribe((res)=>{
    this.leave = res

    let leaveId = this.leave.find(x=> x._id == this.data.id)

    let clientId = leaveId.clientId._id.toString()
    let date: any = leaveId.date


    this.addLeaveForm.patchValue({
      // clientId : clientId,
      date : date
    })
  })
 }

 submitS: Subscription;
 onSubmit() {
    if(this.filteredSession.length == 0){
      return alert("There is no slots assigned on the given date for the selected client")
    }
    let leaveData = {
      clientId: this.addLeaveForm.get('clientId').value,
      date: this.datePipe.transform(this.addLeaveForm.get('date').value, 'yyyy-MM-dd'),
      session_id: this.filteredSession[0]._id,
      slotId : this.filteredSession[0].slotName._id,
    }

    this.submitS = this.adminService.updateLmc(leaveData, this.data.id).subscribe((res)=>{
    })
      this.dialogRef.close(this.leave);
  }

}
