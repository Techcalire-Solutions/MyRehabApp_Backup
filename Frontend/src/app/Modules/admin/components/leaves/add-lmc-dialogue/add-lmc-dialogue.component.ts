import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Session } from '../../../models/session';
import { AddLeaveDialogueComponent } from '../add-leave-dialogue/add-leave-dialogue.component';
import { Fees } from '../../../models/fees';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { DatePipe } from '@angular/common';
import { LeaveSlotsComponent } from '../leave-slots/leave-slots.component';

@Component({
  selector: 'app-add-lmc-dialogue',
  templateUrl: './add-lmc-dialogue.component.html',
  styleUrls: ['./add-lmc-dialogue.component.scss']
})
export class AddLmcDialogueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddLeaveDialogueComponent>, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private adminService: AdminService, private fb: FormBuilder, private therapistService: TherapistService) { }

 @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

 addLeaveForm = this.fb.group({
   clientId : ['', Validators.required],
   date : [],
   slots: this.fb.array([])
 })

 newSlot(){
  return this.addLeaveForm.get("slots") as FormArray
  }

  slots(id : String, therId: string){
    return this.fb.group({
      slotId : id,
      therapistId : therId
    })
  }

 ngOnDestroy() {
   this.clientSubscription?.unsubscribe()
   this.feeSubscription?.unsubscribe()
   this.valueCS?.unsubscribe()
    this.getSS?.unsubscribe()
    this.submitS?.unsubscribe()
 }

 valueCS: Subscription;
 ngOnInit(): void {
   this.clientSubscription = this.getClient()
   this.feeSubscription = this.getFees()

   const toDateControl = this.addLeaveForm.get('date');
   toDateControl.valueChanges.subscribe(() => {
    if (toDateControl.value) {
      this.findDays();
    }
  });
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
  if(this.filteredSession.length == 0){
    return alert("There is no slots assigned on the given date for the selected client")
  }
    const formArray = this.newSlot(); // Store the reference to the FormArray

  for (let i = 0; i < this.filteredSession.length; i++) {
    // if(weekday === this.session[i].slotName.weekDay){
      let slot = this.filteredSession[i].slotName._id
      let ther = this.filteredSession[i].therapistName._id
      this.newSlot().push(this.slots(slot, ther))
    // }
  }
 }

 clients : Client []=[];
 clientSubscription : Subscription
 getClient(){
   return this.adminService.getClients().subscribe((c)=>{
     this.clients = c.filter(x=> x.status != 'WL' && x.status != 'DS');
     this.filteredOptions = this.clients
   })
 }

 filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.clients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
  }

 session: Session[]=[];
 getSS: Subscription;
 getSlotByClient(id : any){
   this.getSS = this.adminService.getSessionByClientId(id).subscribe((res)=>{
     this.session = res
   })
 }

 fees : Fees
 feeSubscription : Subscription
 getFees(){
   return this.therapistService.getFees().subscribe((res)=>{
     this.fees = res
   })
 }

 leave : any
 submitS: Subscription;
 onSubmit(){
  if(this.updatedSlots.length > 0){
    let data = {
      date : this.datePipe.transform(this.addLeaveForm.get('date').value, 'YYYY-MM-dd'),
      clientId : this.addLeaveForm.get('clientId').value,
      slots : this.updatedSlots,
      sessionStatus : 'LMC',
      sessionFee: this.fees[0].lmc,
      feeStatus: false,
      concession: 0
    }
    this.submitS = this.adminService.addLmc(data).subscribe((res)=>{
      this.leave = res
      this.dataSubmitted.emit(this.leave);
      this.dialogRef.close(this.leave);
    })
  }else{
    let data = {
      date : this.datePipe.transform(this.addLeaveForm.get('date').value, 'YYYY-MM-dd'),
      clientId : this.addLeaveForm.get('clientId').value,
      slots : this.addLeaveForm.get('slots').value,
      sessionStatus : 'LMC',
      sessionFee: this.fees[0].lmc,
      feeStatus: false,
      concession: 0
    }
    this.submitS = this.adminService.addLmc(data).subscribe((res)=>{
      this.leave = res
      this.dataSubmitted.emit(this.leave);
      this.dialogRef.close(this.leave);
    })
  }

 }

 clearControls(){
   this.addLeaveForm.reset()
 }

 onCancelClick(): void {
   this.dialogRef.close();
 }

 updatedSlots: any[] = [];
 getSlots(){
   const dialogRef = this.dialog.open(LeaveSlotsComponent, {
     width: '500px',
     data: {
       slots : this.addLeaveForm.getRawValue().slots
     }
   });
   dialogRef.afterClosed().subscribe(result => {
     this.updatedSlots = result
     const slotsFormArray = this.addLeaveForm.get('slots') as FormArray;
     slotsFormArray.clear();
   })
 }

}

