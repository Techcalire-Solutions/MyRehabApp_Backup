import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Slots } from '../../../models/leaves';
import { data } from 'jquery';
import { AdminService } from '../../../admin.service';
import { Slot } from '../../../models/slot';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-leave-slots',
  templateUrl: './leave-slots.component.html',
  styleUrls: ['./leave-slots.component.scss']
})
export class LeaveSlotsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,private adminService: AdminService,
  public dialogRef: MatDialogRef<LeaveSlotsComponent>) { }
  @Output() updatedData: EventEmitter<any> = new EventEmitter<any>()

  @ViewChild('amountToInara') amountToInaraToggle!: MatSlideToggle;

  ngAfterViewInit(): void {
    // Now you can access the amountToInaraToggle after the view has been initialized
  }

  slots: Slot[] = [];
  status: boolean = false;
  ngOnInit(): void {
    if(this.data.status){
      this.status = this.data.status;
    }
    this.getSlots()
  }

  getSlots(){
    for(let i = 0; i< this.data.slots.length; i++) {
      this.adminService.getSlotById(this.data.slots[i].slotId).subscribe(slots => {
        this.slots.push(slots);
      })
    }
  }

  updatedSlots: any[] = [];
  updateSelection(id: String, ami?: boolean){
    let y = this.data.slots.find((x: any) => x.slotId === id);
    let slot = {
      slotId: id,
      therapistId: y.therapistId,
      amountToInara: ami
    }
    this.updatedSlots.push(slot);
  }

  onSubmit(){
    this.updatedData.emit(this.updatedSlots);
    this.dialogRef.close(this.updatedSlots);
  }

}
