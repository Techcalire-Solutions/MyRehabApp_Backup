import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { EditClientStatusComponent } from '../edit-client-status/edit-client-status.component';
import { Slot } from '../../../models/slot';

@Component({
  selector: 'app-edit-slot-status',
  templateUrl: './edit-slot-status.component.html',
  styleUrls: ['./edit-slot-status.component.scss']
})
export class EditSlotStatusComponent implements OnInit {

  constructor(private fb: FormBuilder, private adminService: AdminService,
    public dialogRef: MatDialogRef<EditClientStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnDestroy(): void {
    this.slotSubscription.unsubscribe()
    this.slotSub?.unsubscribe()
  }

  slotForm = this.fb.group({
    status: ['', Validators.required],
    slotId: ['', Validators.required]
  })

  ngOnInit(): void {
    this.slotSubscription = this.getSlot()
  }

  slots : Slot []=[];
  freeSlots : Slot[]=[];
  assignedSlots : Slot[]=[];
  slotSubscription: Subscription
  getSlot(){
    return this.adminService.getSlot().subscribe((slot)=>{
      this.slots = slot

      this.freeSlots = this.slots.filter(x=> x.slotStatus == true)
      this.filteredOptionsSlot = this.freeSlots
      this.assignedSlots = this.slots.filter(x=> x.slotStatus == false)
      this.filteredOptionsSlotA = this.assignedSlots
    })
  }

  filteredOptionsSlot: Slot[] = [];
  filterOptionsSlot(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsSlot = this.freeSlots.filter(option =>
      (option.slotName && option.slotName.toLowerCase().includes(value?.toLowerCase()))
      ||(option.weekDay && option.weekDay.toString().includes(value?.toLowerCase()))
      ||(option.startTime && option.startTime.toString().includes(value?.toLowerCase()))
    );
  }

  filteredOptionsSlotA: Slot[] = [];
  filterOptionsSlotA(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsSlotA = this.assignedSlots.filter(option =>
      (option.slotName && option.slotName.toLowerCase().includes(value?.toLowerCase()))
      ||(option.weekDay && option.weekDay.toString().includes(value?.toLowerCase()))
      ||(option.startTime && option.startTime.toString().includes(value?.toLowerCase()))
    );
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  statusUpdate(){
    let slotData: any
    if(this.slotForm.getRawValue().status === 'free'){
      slotData = {slotStatus : true}
    }
    else{
      slotData = {slotStatus : false}
    }

    this.updateSlotStatus(slotData, this.slotForm.get('slotId').value)
    this.clearControls()
  }

  slotSub: Subscription;
  updateSlotStatus(data : any, id : String){
    this.slotSub = this.adminService.updateSlotStatus(data, id).subscribe((res)=>{
      this.getSlot()
      this.dialogRef.close();
    })
  }

  clearControls(){
    this.slotForm.reset()
    this.getSlot()
}
}
