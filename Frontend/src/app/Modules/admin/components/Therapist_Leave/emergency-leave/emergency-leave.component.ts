import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { User } from '../../../models/user';
import { Session } from '../../../models/session';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-emergency-leave',
  templateUrl: './emergency-leave.component.html',
  styleUrls: ['./emergency-leave.component.scss']
})
export class EmergencyLeaveComponent implements OnInit {
    ngOnDestroy(){
      this.userSub.unsubscribe();
    }

    userId!: number
    therapistId: string;
    constructor(private formBuilder: FormBuilder,  private adminService: AdminService, private datePipe: DatePipe,
      private _snackBar: MatSnackBar, private dialog: MatDialog,
      private therapistService : TherapistService,
      public dialogRef: MatDialogRef<EmergencyLeaveComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any){
        const token: any = localStorage.getItem('token');
        let user = JSON.parse(token);

        this.therapistId = user.id;

        if(data.status === true){
          adminService.getTherapistLeaveById(data.id).subscribe(leave=>{
            let therapistId = leave.therapistId._id.toString();
            let reason = leave.reason.toString();
            let fromDate = leave.fromDate.toString();
            let toDate = leave.toDate.toString();
            this.getSessions(therapistId)

            this.leaveForm.patchValue({
              therapistId: therapistId,
              reason: reason,
              fromDate: fromDate,
              toDate: toDate
            })
          })
        }
       }

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
      this.getLeave()
      this.getUser()
      // this.getSessions();

      const fromDateControl = this.leaveForm.get('fromDate');
      const toDateControl = this.leaveForm.get('toDate');

      toDateControl.valueChanges.subscribe(() => {
        if (fromDateControl.value && toDateControl.value) {
          this.getClients();
        }
      });

    }

    leaveForm = this.formBuilder.group({
      therapistId:[],
      reason: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      compensation : this.formBuilder.array([])
    }
  )

  newCompenstaion(){
    return this.leaveForm.get("compensation") as FormArray
  }

  clients(clientId: any, slotId: any){
    return this.formBuilder.group({
      clientId : clientId,
      slotId : slotId
    })
  }

  isEdit = false;
  sessions: Session[] = [];
  sessionSub: Subscription;
  getSessions(id?: string){
    this.sessionSub = this.adminService.getSession().subscribe(session =>{
      this.sessions = session.filter(session => session.therapistName._id === id)

      this.getClients();
    })
  }

  getClients(){
    if(this.sessions.length != 0){
      const fromDate = this.leaveForm.get('fromDate').value;
      const toDate = this.leaveForm.get('toDate').value;
     

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
            for(let j=0; j<this.sessions.length; j++){
              if(daysInRange[i] === this.sessions[j].slotName.weekDay){
                let client = this.sessions[j].clientName._id
                let slot = this.sessions[j].slotName._id
               

                this.newCompenstaion().push(this.clients(client, slot))
              }
            }
          }
        }
    }
    else{
      alert("No Sessions on this Date")
    }
  }


    leave!: any
    submitForm() {
      let data = {
        therapistId: this.leaveForm.get('therapistId')?.value,
        reason: this.leaveForm.get('reason')?.value,
        fromDate:this.datePipe.transform( this.leaveForm.get('fromDate')?.value, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform( this.leaveForm.get('toDate')?.value, 'yyyy-MM-dd'),
        status: 'Emergency',
        leaveType: 'Emergency Leave',
        compensation: this.leaveForm.get('compensation')?.value,
      }
      this.therapistService.addTherapistLeaves(data).subscribe((res)=>{
        this.leave = res
        this.dataSubmitted.emit(this.leave);
        this.dialogRef.close(true);
      })
      this.clearControls()
    }

    clearControls(){
      this.leaveForm.reset()
    }

    user : User[] = []
    userSub: Subscription;
    getUser(){
      this.userSub = this.adminService.getUsers().subscribe(users =>{
        this.user = users.filter(user => user.role === 'therapist');
      })
    }

    leaves: TherapistService[] = []
    getLeave(){
      this.adminService.getTherapistLeave().subscribe((res)=>{})
    }

    editFunction(){
      let data = {
        therapistId: this.leaveForm.get('therapistId').value,
        reason: this.leaveForm.get('reason').value,
        fromDate: this.leaveForm.get('fromDate').value,
        toDate: this.leaveForm.get('toDate').value,
        status: 'Emergency',
        leaveType: 'Emergency Leave',
        compensation: this.leaveForm.get('compensation')?.value,
      };
      this.adminService.updateTherapistLeave(data, this.data.id).subscribe(
        (res) => {
          this.leave = res;
          this.dataSubmitted.emit(this.leave);
          this.dialogRef.close(true);
          this.clearControls();
        },
        (error) => {
          console.error('Error:', error);
          alert('An error occurred while updating leave.');
        }
      );
   }



}
