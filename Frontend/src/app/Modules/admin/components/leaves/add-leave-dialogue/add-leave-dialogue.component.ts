import { Component, OnInit, OnDestroy, Inject, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Session } from '../../../models/session';
import { DatePipe } from '@angular/common';
import { LeaveSlotsComponent } from '../leave-slots/leave-slots.component';
import { data } from 'jquery';

@Component({
  selector: 'app-add-leave-dialogue',
  templateUrl: './add-leave-dialogue.component.html',
  styleUrls: ['./add-leave-dialogue.component.scss']
})
export class AddLeaveDialogueComponent implements OnInit, OnDestroy {
  constructor(private datePipe: DatePipe,public dialogRef: MatDialogRef<AddLeaveDialogueComponent>,
     private adminService: AdminService, private fb: FormBuilder, private dialog: MatDialog) { }

  @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  addLeaveForm = this.fb.group({
    clientId : ['', Validators.required],
    fromDate : [''],
    toDate : [''],
    slots : this.fb.array([])
  })

  ngOnDestroy() {
    this.clientSubscription.unsubscribe()
    if(this.slotS){
      this.slotS.unsubscribe()
    }
    if(this.submitS){
      this.submitS.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.getClient()

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
    this.clientSubscription = this.adminService.getClients().subscribe((c)=>{
      this.clients = c.filter(x=> x.status != 'WL' && x.status != 'DS');
      this.filteredOptions = this.clients
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

  session: Session[]=[];
  slotS: Subscription;
  getSlotByClient(id : any){
    this.slotS = this.adminService.getSessionByClientId(id).subscribe((res)=>{
      this.session = res
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

  filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.clients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
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
    })
  }

  leave : any
  submitS: Subscription;
  onSubmit(){
    const commonForm = {
      ...this.addLeaveForm.value,
    };
    commonForm.fromDate = this.datePipe.transform(this.addLeaveForm.value.fromDate, 'yyyy-MM-dd')
    commonForm.toDate = this.datePipe.transform(this.addLeaveForm.value.toDate, 'yyyy-MM-dd')
    if(this.updatedSlots.length > 0) {
      commonForm.slots = this.updatedSlots
    }
    this.submitS = this.adminService.markLeave(commonForm).subscribe((res)=>{
      this.leave = res
      this.dataSubmitted.emit(this.leave);
      this.dialogRef.close(this.leave);
    })
  }

  clearControls(){
    this.addLeaveForm.reset()
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
