import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { DeleteDialogueComponent } from 'src/app/Modules/admin/components/delete-dialogue/delete-dialogue.component';
import { EditCompensationComponent } from 'src/app/Modules/admin/components/sessions/edit-compensation/edit-compensation.component';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { Session } from 'src/app/Modules/admin/models/session';
import { Slot } from 'src/app/Modules/admin/models/slot';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/auth/models/User';
import { CompensationSessionComponent } from 'src/app/Modules/therapist/components/Therapist_Leave/compensation-session/compensation-session.component';
import { TherapistLeave } from 'src/app/Modules/therapist/models/therapistLeave';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { ParentService } from '../../parent.service';
import { AdminDashboardComponent } from 'src/app/Modules/admin/components/admin-dashboard/admin-dashboard.component';
import { Leaves } from 'src/app/Modules/admin/models/leaves';
import { LeaveSlotsComponent } from 'src/app/Modules/admin/components/leaves/leave-slots/leave-slots.component';

@Component({
  selector: 'app-request-leave',
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.scss']
})
export class RequestLeaveComponent implements OnInit {

  ngOnDestroy(){
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.leaveSub){
      this.leaveSub.unsubscribe();
    }
    if(this.editSub){
      this.editSub.unsubscribe();
    }
    if(this.deleteSub){
      this.deleteSub.unsubscribe();
    }
  }

  currentUser: any;
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private adminService: AdminService,
    private parentService: ParentService, private _snackBar: MatSnackBar,private dialog: MatDialog) {
      let currentUserString = localStorage.getItem('token')
      this.currentUser = JSON.parse(currentUserString)
      if(this.currentUser){
        this.getClient()
      }
  }

  dataSource: MatTableDataSource<TherapistLeave>;
  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource(this.leaves);
    this.getLeave();
    const fromDateControl = this.leaveRequestForm.get('fromDate');
    const toDateControl = this.leaveRequestForm.get('toDate');

    toDateControl.valueChanges.subscribe(() => {
      if (fromDateControl.value && toDateControl.value) {
        this.findDays();
      }
    });
  }

  userSource: any;
  therapistId: any;
  userRole: string;

  leaveRequestForm = this.formBuilder.group({
    reason: ['', Validators.required], // Add Validators.required here
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    slots : this.formBuilder.array([])
  });

  newSlot(){
    return this.leaveRequestForm.get("slots") as FormArray
  }

  slots(id : any){
    return this.formBuilder.group({
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
      const fromDate = this.leaveRequestForm.get('fromDate').value;
      const toDate = this.leaveRequestForm.get('toDate').value;

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

  user: String;
  userId: String;
  clientSub: Subscription;
  getClient(){
    this.clientSub = this.parentService.getClientLogin(this.currentUser.id).subscribe((clientInfo) => {
      this.user = clientInfo.clientId.firstName
      this.userId = clientInfo.clientId._id
      this.getSlotByClient(this.userId)
    })
  }

  submit: Subscription;
  submitForm() {
    let data = {
      reason: this.leaveRequestForm.get('reason')?.value,
      fromDate: this.datePipe.transform(this.leaveRequestForm.get('fromDate')?.value, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.leaveRequestForm.get('toDate')?.value, 'yyyy-MM-dd'),
      status: 'Requested',
      clientId: this.userId,
      slots : this.updatedSlots
    };
    this.submit = this.adminService.markLeave(data).subscribe((res) => {
      this.clearControls()
    });
  }

  displayedColumns: string[] = ['reason','fromDate','toDate','status','action'];

  leaves: Leaves[] = [];
  leaveSub: Subscription;
  getLeave() {
    this.leaveSub = this.adminService.getLeave().subscribe((res) => {
      this.leaves = res.filter((leave) =>
      ["requested", "approved", "rejected"].includes(leave.status.toLowerCase()) &&
       leave.status.toLowerCase() !== "emergency" &&
       leave.clientId._id === this.userId)
    });
  }

  leaveId: '';
  isEdit: boolean = false;
  editLeave(id) {
    this.isEdit = true;

    let lve = this.leaves.find((x) => x._id == id);

    let reason = lve.reason.toString();
    let fromDate = lve.fromDate.toString();
    let toDate = lve.toDate.toString();

    this.leaveRequestForm.patchValue({ reason: reason });
    this.leaveRequestForm.patchValue({ fromDate: fromDate });
    this.leaveRequestForm.patchValue({ toDate: toDate });

    this.leaveId = id;
  }

  editSub: Subscription;
  editFunction() {
    this.isEdit = false;
    let data = {
      reason: this.leaveRequestForm.get('reason').value,
      fromDate: this.datePipe.transform(this.leaveRequestForm.get('fromDate').value, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.leaveRequestForm.get('toDate').value, 'yyyy-MM-dd'),
      status: 'Requested',
      clientId: this.userId
    };
    this.editSub = this.adminService.editLeave(data, this.leaveId).subscribe(
      (res) => {
        this._snackBar.open('Leave updated successfully...', '', {
          duration: 3000,
        });
        this.clearControls();
      },
      (error) => {
        console.error('Error:', error);
        alert('An error occurred while updating leave.');
      }
    );
  }

  delete: Subscription
  deleteSub: Subscription;
  deleteLeave(_id: string) {
    if (!_id) {
      console.error("Invalid _id provided");
      return;
    }
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSub = this.delete = this.adminService.deleteLeave(_id).subscribe((res)=>{
          this.getLeave()
          this._snackBar.open("Leave deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
        this.getLeave()
      }})
  }

  clearControls() {
    this.leaveRequestForm.reset()
    this.getLeave()
  }

  addCompensationSession(id: string){
    const dialogRef = this.dialog.open(CompensationSessionComponent, {
      width: '500px',
      data: {
        id : id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getLeave()
    })
  }

  displayedColumnsCS: string[] = ['clientName', 'therapistName','slotName', 'date','startTime', 'endTime','manage'];

  // isEdit = false;
  aSessionId : '';
  slot : Slot
  therapist : User
  editSession(id: any){
    const dialogRef = this.dialog.open(EditCompensationComponent, {
      width: '800px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe(result =>{
      // if(result){
        // this.getCompSession()
      // }
    },(error=>{
      console.log(error)
      alert(error.error.message)
    }))
  }

  updatedSlots: any[] = [];
  getSlots(){
    const dialogRef = this.dialog.open(LeaveSlotsComponent, {
      width: '500px',
      data: {
        slots : this.leaveRequestForm.getRawValue().slots,
        status : 'true'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.updatedSlots = result
    })
  }
}
