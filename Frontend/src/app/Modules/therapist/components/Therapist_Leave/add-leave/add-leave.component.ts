import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { TherapistLeave } from '../../../models/therapistLeave';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/admin/components/delete-dialogue/delete-dialogue.component';
import { Session } from 'src/app/Modules/admin/models/session';
import { CompensationSessionComponent } from '../compensation-session/compensation-session.component';
import { EditCompensationComponent } from 'src/app/Modules/admin/components/sessions/edit-compensation/edit-compensation.component';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { Slot } from 'src/app/Modules/admin/models/slot';
import { User } from 'src/app/Modules/auth/models/User';
import { Assessment } from 'src/app/Modules/admin/models/assessment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class AddLeaveComponent implements OnInit {

  ngOnDestroy(){
    if(this.sessionSub){
      this.sessionSub.unsubscribe();
    }
  }

  constructor(
    private formBuilder: FormBuilder, private datePipe: DatePipe,
    private therapistService: TherapistService,
    private authService: AuthService,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    const token: any = localStorage.getItem('token');
    let user = JSON.parse(token);

    this.therapistId = user.id;

    this.userRole = user.role;
  }

  dataSource: MatTableDataSource<TherapistLeave>;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.leaves);
    this.getSessions();
    this.getLeave();
    const fromDateControl = this.leaveRequestForm.get('fromDate');
    const toDateControl = this.leaveRequestForm.get('toDate');

    toDateControl.valueChanges.subscribe(() => {
      if (fromDateControl.value && toDateControl.value) {
        this.getClients();
      }
    });
    this.getCompSession();
  }

  userSource: any;
  therapistId: any;
  userRole: string;

  leaveRequestForm = this.formBuilder.group({
    leaveType: ['', Validators.required], // Add Validators.required here
    reason: ['', Validators.required], // Add Validators.required here
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    therapistId: [],
    status: [''],
    compensation : this.formBuilder.array([])
  });

  newCompenstaion(){
    return this.leaveRequestForm.get("compensation") as FormArray
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
  assessmentSub: Subscription;
  assessments: Assessment[] = [];
  getSessions(){
    this.sessionSub = this.adminService.getSession().subscribe(session =>{
      this.sessions = session.filter(session => session.therapistName._id === this.therapistId)
    })

    this.assessmentSub = this.adminService.getAssessmentSession().subscribe(session =>{
      this.assessments = session.filter(session => session.therapistName._id === this.therapistId)
    })
  }

  getClients(){
    if(this.sessions.length != 0){
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
            for(let j=0; j<this.sessions.length; j++){
              if(daysInRange[i] === this.sessions[j].slotName.weekDay){
                let client = this.sessions[j].clientName._id
                let slot = this.sessions[j].slotName._id
                this.newCompenstaion().push(this.clients(client, slot))
              }
            }
          }
        }
    }else if(this.assessments.length != 0){
      const fromDate = this.leaveRequestForm.get('fromDate').value;
      const toDate = this.leaveRequestForm.get('toDate').value;

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        const assessmentsWithinRange = this.assessments.filter((item) => {
          const assessmentDate = new Date(item.assessmentDate);
          return assessmentDate >= startDate && assessmentDate <= endDate;
        });
        if(assessmentsWithinRange.length != 0){
          for(let j=0; j<assessmentsWithinRange.length; j++){
              let client = assessmentsWithinRange[j].clientName._id
              let slot = assessmentsWithinRange[j].slotName._id
              this.newCompenstaion().push(this.clients(client, slot))
          }
        }
    }
    else{
      alert("No Sessions on this Date")
    }
  }

  submitForm() {
    let data = {
      leaveType: this.leaveRequestForm.get('leaveType')?.value,
      reason: this.leaveRequestForm.get('reason')?.value,
      fromDate: this.datePipe.transform(this.leaveRequestForm.get('fromDate')?.value, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.leaveRequestForm.get('toDate')?.value, 'yyyy-MM-dd'),
      compensation: this.leaveRequestForm.get('compensation')?.value,
      therapistId: this.therapistId,
      status: 'Requested',
    };
    this.therapistService.addTherapistLeaves(data).subscribe((res) => {
      this.clearControls()
    });
  }

  getTherapistById() {
    this.adminService.getTherapistById(this.therapistId).subscribe((res) => {
    });
  }

  displayedColumns: string[] = [
    'leaveType',
    'reason',
    'fromDate',
    'toDate',
    'status',
    'action',
    'manage'
  ];

  leaves: TherapistLeave[] = [];
  getLeave() {
    this.adminService.getTherapistLeave().subscribe((res) => {
      this.leaves = res.filter((leave) =>
        ["requested", "approved", "rejected"].includes(leave.status.toLowerCase())
        && leave.status.toLowerCase() !== "emergency"
        && leave.therapistId._id === this.therapistId
      );
    

    });
  }

  leaveId: '';
  editLeave(id) {
    this.isEdit = true;

    let lve = this.leaves.find((x) => x._id == id);

    let reason = lve.reason.toString();
    let leaveType = lve.leaveType.toString();
    let fromDate = lve.fromDate.toString();
    let toDate = lve.toDate.toString();

    this.leaveRequestForm.patchValue({ reason: reason });
    this.leaveRequestForm.patchValue({ leaveType: leaveType });
    this.leaveRequestForm.patchValue({ fromDate: fromDate });
    this.leaveRequestForm.patchValue({ toDate: toDate });

    this.leaveId = id;
  }

  editFunction() {
    this.isEdit = false;
    let data = {
      leaveType: this.leaveRequestForm.get('leaveType').value,
      reason: this.leaveRequestForm.get('reason').value,
      fromDate: this.datePipe.transform(this.leaveRequestForm.get('fromDate').value, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.leaveRequestForm.get('toDate').value, 'yyyy-MM-dd'),
      compensation: this.leaveRequestForm.get('compensation')?.value,
      status: 'requested',
    };

    this.adminService.updateTherapistLeave(data, this.leaveId).subscribe(
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
        this.delete = this.adminService.deleteTherapistLeave(_id).subscribe((res)=>{
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

  compSub: Subscription;
  compSession: CompensationSession[] = [];
  getCompSession(){
    this.compSub = this.therapistService.getCompensation().subscribe(res=>{
      this.compSession = res;
      this.filtered = this.compSession;
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.compSession.filter(element =>
      element.clientName.firstName.toLowerCase().includes(filterValue)
      // || element.clientName.firstName.toLowerCase().includes(filterValue)
      // || element.therapistName.name.toLowerCase().includes(filterValue)
    )}

    else{
      this.getCompSession();
    }
  }

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
        this.getCompSession()
      // }
    },(error=>{
      console.log(error)
      alert(error.error.message)
    }))
  }

  deleteCS: Subscription;
  deleteSession(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        let assessment = this.compSession.find(x => x._id ==id)

        this.delete = this.therapistService.deleteCompSession(id).subscribe((session)=>{
          this.getCompSession()
          this._snackBar.open("Compensation Session deleted successfully...","" ,{duration:3000})

        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        })
      )
    }
    })
  }

}
