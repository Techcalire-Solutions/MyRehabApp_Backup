import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { User } from 'src/app/Modules/admin/models/user';
import { AdminLeave } from '../../models/admin-leave';
import { EmergencyLeaveComponent } from 'src/app/Modules/admin/components/Therapist_Leave/emergency-leave/emergency-leave.component';
import { DeleteDialogueComponent } from 'src/app/Modules/admin/components/delete-dialogue/delete-dialogue.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-leave',
  templateUrl: './admin-leave.component.html',
  styleUrls: ['./admin-leave.component.scss']
})
export class AdminLeaveComponent implements OnInit {

  constructor(private adminService: AdminService, private fb: FormBuilder, private _snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  OnDestroy(): void {
    this.userSub?.unsubscribe();
    this.submit?.unsubscribe();
    this.leaveSub?.unsubscribe();
  }

  leaveForm = this.fb.group({
    adminId:[],
    reason: ['', Validators.required],
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    leaveType: ['', Validators.required]
  })

  ngOnInit(): void {
    this.getUser();
    this.getLeave();
  }

  user : User[] = []
  userSub: Subscription;
  getUser(){
    this.userSub = this.adminService.getUsers().subscribe(users =>{
      this.user = users.filter(user => user.role === 'admin');
    })
  }

  submit: Subscription;
  submitForm(){
    this.submit = this.adminService.addAdminLeave(this.leaveForm.getRawValue()).subscribe(data =>{
   
      this._snackBar.open("Leave added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.leaveForm.reset()
  }

  leaveSub: Subscription;
  leaves: AdminLeave[] = [];
  getLeave(){
    this.leaveSub = this.adminService.getAdminLeave().subscribe(res=>{
      this.leaves = res
    })
  }

  displayedColumns: string[] = [
    'userId',
    'leaveType',
    'reason',
    'fromDate',
    'toDate',
    'action'
  ];

  isEdit = false;
  leaveId: string
  editRow(id: string) {
    this.leaveId = id;
    this.isEdit = true;
    this.adminService.getAdminLeaveById(id).subscribe(leave=>{
   

      let adminId = leave.adminId?._id?.toString();
      let reason = leave.reason?.toString();
      let fromDate = leave.fromDate?.toString();
      let toDate = leave.toDate?.toString();
      let leaveType = leave.leaveType?.toString();

      this.leaveForm.patchValue({
        adminId: adminId,
        reason: reason,
        fromDate: fromDate,
        toDate: toDate,
        leaveType: leaveType
      })
    })
  }

  editFunction(){
    this.adminService.updateAdminLeave(this.leaveForm.getRawValue(), this.leaveId).subscribe(data => {
      this._snackBar.open("Leave updated successfully...","" ,{duration:3000})
      this.clearControls()
      this.getLeave()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  delete: Subscription;
  deleteRow(_id: string) {
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
}
