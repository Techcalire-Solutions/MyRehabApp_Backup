import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { AddLeaveDialogueComponent } from '../add-leave-dialogue/add-leave-dialogue.component';
import { Leaves } from '../../../models/leaves';
import { Session } from '../../../models/session';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-leave-dialogue',
  templateUrl: './edit-leave-dialogue.component.html',
  styleUrls: ['./edit-leave-dialogue.component.scss']
})
export class EditLeaveDialogueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddLeaveDialogueComponent>, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService, private fb: FormBuilder) {}

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

 addLeaveForm = this.fb.group({
   clientId : ['', Validators.required],
   fromDate : [''],
   toDate : [''],
   slots : this.fb.array([])
 })

 ngOnDestroy() {
   this.clientSubscription.unsubscribe()
   if(this.getSS){
    this.getSS.unsubscribe()
   }
   if(this.slotSub){
    this.slotSub.unsubscribe()
   }
   if(this.leaveS){
    this.leaveS.unsubscribe()
   }
   if(this.submitS){
    this.submitS.unsubscribe()
   }
 }

 ngOnInit(): void {
   this.clientSubscription = this.getClient()

   this.editLeave()

   const fromDateControl = this.addLeaveForm.get('fromDate');
   const toDateControl = this.addLeaveForm.get('toDate');

   toDateControl.valueChanges.subscribe(() => {
     if (fromDateControl.value && toDateControl.value) {
       this.findDays();
     }
   });
 }

 clients : Client []=[];
 clientSubscription : Subscription
 getClient(){
   return this.adminService.getClients().subscribe((c)=>{
     this.clients = c.filter(x=> x.status == 'RS');
   })
 }

 session: Session[]=[];
 getSS: Subscription;
 slotSub: Subscription
  getSlotByClient(id : any){
    this.slotSub = this.adminService.getSessionByClientId(id).subscribe((res)=>{
      this.session = res
    })
  }

  newSlot(){
    return this.addLeaveForm.get("slots") as FormArray
  }

  slots(id : any){
    return this.fb.group({
      slotId : id
    })
  }

  findDays(){
    if(this.session.length != 0){
      const fromDate = this.addLeaveForm.get('fromDate').value;
      const toDate = this.addLeaveForm.get('toDate').value;

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        const daysInRange: string[] = [];

        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(0, 0, 0, 0);

        const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' });


        const seenDays = new Set();
        while (startDate <= endDate) {
          startDate.setUTCDate(startDate.getUTCDate() + 1);
          const weekday = formatter.format(startDate);
          if (!seenDays.has(weekday)) {
            daysInRange.push(weekday);
            seenDays.add(weekday);
          }
          // daysInRange.push(weekday);
        }

        if(daysInRange.length != 0){
          for(let i = 0; i < daysInRange.length; i++) {
            for(let j=0; j<this.session.length; j++){
              if(daysInRange[i] === this.session[j].slotName.weekDay){
                let slot = this.session[j].slotName._id
                this.newSlot().push(this.slots(slot))
              }
            }
          }
        }
    }
    else{alert("No Session is assigned for this Client")}
  }

 leave : Leaves[]=[];
 leaveS:Subscription;
 editLeave(){
   this.leaveS = this.adminService.getLeave().subscribe((res)=>{
    this.leave = res

    let leaveId = this.leave.find(x=> x._id == this.data.id)

    let clientId = leaveId.clientId._id.toString()
    let fromDate: any = leaveId.fromDate
    let toDate: any = leaveId.toDate
    this.getSlotByClient(clientId)
    this.addLeaveForm.patchValue({
      clientId : clientId,
      // fromDate : fromDate,
      // toDate : toDate
    })
  })
 }


 submitS: Subscription;
 onSubmit() {
  let leaveData = {
    clientId: this.addLeaveForm.get('clientId').value,
    fromDate: this.datePipe.transform(this.addLeaveForm.get('fromDate').value, 'yyyy-MM-dd'),
    toDate: this.datePipe.transform(this.addLeaveForm.get('toDate').value, 'yyyy-MM-dd')
  }

  this.submitS = this.adminService.editLeave(this.addLeaveForm.getRawValue(), this.data.id).subscribe((res)=>{
  })
  this.dialogRef.close(leaveData);
 }

 clearControls(){
   this.addLeaveForm.reset()
 }

 onCancelClick(): void {
   this.dialogRef.close();
 }

}
