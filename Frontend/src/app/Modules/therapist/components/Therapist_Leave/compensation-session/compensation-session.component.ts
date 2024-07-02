import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AddAssessmentDialogueComponent } from 'src/app/Modules/admin/components/sessions/add-assessment-dialogue/add-assessment-dialogue.component';
import { Client } from 'src/app/Modules/admin/models/client';
import { Slot } from 'src/app/Modules/admin/models/slot';
import { User } from 'src/app/Modules/admin/models/user';
import { TherapistService } from '../../../therapist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compensation-session',
  templateUrl: './compensation-session.component.html',
  styleUrls: ['./compensation-session.component.scss']
})
export class CompensationSessionComponent implements OnInit {
  datePipe = new DatePipe('en-US')

  compensationForm = this.fb.group({
    compensationId: ['', Validators.required],
    date:['', Validators.required],
    sessionType: ['', Validators.required],
    // startTime:['', Validators.required],
    // endTime:['', Validators.required],
    leaveId: this.data.id,
    slotId: ['', Validators.required]
  });

  sessionTypes = [
    {name: 'Assessment'},
    {name: 'Session'}
  ]

  constructor(public dialogRef: MatDialogRef<AddAssessmentDialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog,
    private therapistService: TherapistService, private router: Router) { }

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(): void {
    this.leaveSubscription.unsubscribe();
    if(this.daySub){
      this.daySub.unsubscribe();
    }
    this.slotSub?.unsubscribe();
  }

  clientSubscription: Subscription;
  therapistSubscription: Subscription;
  leaveSubscription : Subscription
  ngOnInit(): void {
    this.leaveSubscription = this.getLeaveDate()
  }

  newComp: any;
  daySub: Subscription;
  clientStatus: string;
  getDay(id: string){
    this.newComp = this.compensation.filter(x=>x._id === id)
    this.weekDay = this.newComp[0].slotId.weekDay
    this.clientStatus = this.newComp[0].clientId.status
    if(this.clientStatus == 'WL' || this.clientStatus == 'AS'){
      this.compensationForm.get('sessionType').setValue('Assessment')
    }
    else{
      this.compensationForm.get('sessionType').setValue('Session')
    }
  }

  weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  weekDay: string
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent aal days except this.weekDay.
    const weekdayIndex = this.weekdayNames.indexOf(this.weekDay);
    return day == weekdayIndex;
  };

  fromDate : Date
  toDate : Date
  compensation: any[] = [];
  therapistId: string;
  getLeaveDate(){
    return this._http.getTherapistLeaveById(this.data.id).subscribe(x =>{
      this.therapistId = x.therapistId._id;
      this.fromDate = x.fromDate;
      this.toDate = x.toDate;
      for(let i = 0; i < x.compensation.length; i++){
        this.compensation.push(x.compensation[i]);
      };
      this.getSlots(x.therapistId.therapyCategory._id)
      this.getLeaves(x.therapistId.therapyCategory._id)
    })
  }

  slotSub: Subscription;
  slots: Slot[] = [];
  getSlots(id: String){
    this.slotSub = this._http.getFilteredSlot().subscribe(slots =>{
      this.slots = slots.filter(x=>x.therapyCategory._id ===  id);
      this.filteredOptionsSlot = this.slots
    })
  }

  filteredOptionsSlot: Slot[] = [];
  filterOptionsSlot(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsSlot = this.slots.filter(option =>
      (option.slotName && option.slotName.toLowerCase().includes(value?.toLowerCase()))
      ||(option.weekDay && option.weekDay.toString().includes(value?.toLowerCase()))
      ||(option.startTime && option.startTime.toString().includes(value?.toLowerCase()))
    );
  }

  leaveSlots: any[] = [];
  combinedArray: any[] = [];
  leave: any[] = [];
  leaveSub: Subscription;
  lmcSub: Subscription;
  getLeaves(id:String){
    this.leaveSub = this._http.getLeave().subscribe(data=>{
      this.leave = data.filter(e=> e.status.toLowerCase() === 'accepted')
      let leavesWithSlots = this.leave.filter(e => e.slots.length > 0);
      leavesWithSlots.forEach(s => this.leaveSlots.push(s.slots.filter(x=>x.status === false && x.slotId.therapyCategory._id === id)));
      this.combinedArray = this.leaveSlots[0]
      for (let i = 1; i <this.leaveSlots.length; i++) {
        this.combinedArray = this.combinedArray.concat(this.leaveSlots[i]);
      }
      this.lmcSub = this._http.getLmc().subscribe(data=>{
        let lmcSlots : any[] = [];
        let lmcWithSlots = data.filter(e => e.slots.length > 0);
        lmcWithSlots.forEach(s => lmcSlots.push(s.slots.filter(x=>x.status === false && x.slotId.therapyCategory._id === id)));
        for (let i = 1; i <lmcSlots.length; i++) {
          this.combinedArray = this.combinedArray.concat(lmcSlots[i]);
        }
      })
    });
  }

  myFilterCalendar = (d: Date | null): boolean => {
    if (!d) {
        return false; // If date is null, prevent it
    }

    // Specify the start and end dates from selectedLeave.
    const startDate = new Date(this.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(this.endDate);
    endDate.setHours(23, 59, 59, 999);

    // Check if the current date is within the specified range.
    const isWithinRange = d >= startDate && d <= endDate;

    return isWithinRange;
  };


  selectedStatus: boolean = false;
  startDate: Date;
  endDate: Date;
  leaveId: string;
  onSlotSelectionChange(id: string) {
    if (this.compensationForm.get('slotId').value === 'chooseAnother') {
      this.selectedStatus = !this.selectedStatus;
    }
    if(!this.selectedStatus){
      let selectedLeave = this.leave.find(x => x.slots.some((y : any)=>y.slotId._id === id))
      this.startDate = selectedLeave.fromDate
      this.endDate = selectedLeave.toDate
      this.leaveId = selectedLeave._id
    }
  }

  user :any;
  onSubmit(){
      let data = {
        clientName: this.newComp[0].clientId._id,
        slotName: this.compensationForm.get('slotId').value,
        therapistLeaveId: this.data.id,
        date: this.datePipe.transform(this.compensationForm.get('date').value, 'yyyy-MM-dd'),
        sessionType: this.compensationForm.get('sessionType').value,
        therapistName: this.therapistId,
        slotStatus: this.selectedStatus,
        leaveId: this.leaveId
      }
      this.therapistService.addCompensation(data).subscribe((res)=>{
        this.user = res;
        this._snackBar.open("Compensation Session added successfully...","" ,{duration:3000})
        this.clearControls()

        this.dataSubmitted.emit(this.user);
        this.dialogRef.close(this.user);
      },(error=>{
   
        // alert(error)
      }))
    // }

    // else{
    //   alert("Date is not valid")
    // }

  }

  clearControls(){
    this.compensationForm.reset()
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

