import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { CompensationSession } from '../../../models/compensation';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-edit-compensation',
  templateUrl: './edit-compensation.component.html',
  styleUrls: ['./edit-compensation.component.scss']
})
export class EditCompensationComponent implements OnInit {

  ngOnDestroy(){
    this.leaveSub.unsubscribe();
  }

  comId: string;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<EditCompensationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private therapistService: TherapistService, private adminSerivce: AdminService) {
      this.comId = data.id
    }

  ngOnInit(): void {
    this.getComp()
    this.getLeaves()
  }

  compensationForm = this.fb.group({
    date:['', Validators.required],
    startTime:['', Validators.required],
    endTime:['', Validators.required],
    // leaveId: this.data.id
  });

  sessionTypes = [
    {name: 'Assessment'},
    {name: 'Session'}
  ]

  getSub: Subscription;
  comp: CompensationSession;
  compensationId: string;
  getComp(){
    this.getSub = this.therapistService.getCompensationById(this.comId).subscribe(data => {
      this.comp = data
      let date = data.date.toString();


      this.compensationForm.patchValue({
        date : date
      })
      this.compensationId = this.comp._id;
    })
  }

  leaveSlots: any[] = [];
  combinedArray: any[] = [];
  leave: any[] = [];
  leaveSub: Subscription;
  getLeaves(){
    this.leaveSub = this.adminSerivce.getLeave().subscribe(data=>{
      this.leave = data.filter(e=>e.status.toLowerCase() === 'accepted')
    });
  }

  startDate: Date;
  endDate: Date;
  leaveId: string;
  myFilterCalendar = (d: Date | null): boolean => {
    if (!d) {
        return false; // If date is null, prevent it
    }
    let selectedLeave = this.leave.find(x => x.slots.some((y : any)=>y.slotId._id === this.comp.slotName._id))
    this.startDate = selectedLeave.fromDate
    this.endDate = selectedLeave.toDate
    this.leaveId = selectedLeave._id

    // Specify the start and end dates from selectedLeave.
    const startDate = new Date(this.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(this.endDate);
    endDate.setHours(23, 59, 59, 999);

    // Check if the current date is within the specified range.
    const isWithinRange = d >= startDate && d <= endDate;

    return isWithinRange;
  };

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(){
    let data = {
      date : this.compensationForm.get('date').value,
      startTime : this.compensationForm.get('startTime').value,
      endTime : this.compensationForm.get('endTime').value,
    }
    this.therapistService.editCompensation(data, this.compensationId).subscribe(data => {
      this.dialogRef.close();
    })
  }

}
