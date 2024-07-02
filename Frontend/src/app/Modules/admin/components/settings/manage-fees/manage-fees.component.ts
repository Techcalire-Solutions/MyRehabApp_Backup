import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { Fees } from '../../../models/fees';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-fees',
  templateUrl: './manage-fees.component.html',
  styleUrls: ['./manage-fees.component.scss']
})
export class ManageFeesComponent implements OnInit, OnDestroy {

  constructor(private adminService : AdminService, private fb : FormBuilder, private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ManageFeesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnDestroy(): void {
    // this.feesSubscription.unsubscribe()
  }

  feeForm = this.fb.group({
    sessionFee : [],
    assessmentFee : [],
    lmc : [],
    groupSessionFee : [],
  })

  feesSubscription: Subscription;
  ngOnInit(): void {
    this.getFees()
  }

  displayedColumns: string[] = ['sessionFee', 'assessmentFee', 'lmc', 'groupSessionFee','manage']

  fees : Fees[] = []
  getFees(){
    this.adminService.getFees().subscribe((res)=>{
      this.fees = res
    })
  }

  isEdit = false
  feeId : String
  editFees(){
    this.isEdit = true

    let fee = this.fees[0]
    this.feeId = fee._id

    let sessionFee = fee.sessionFee.toString()
    let assessmentFee = fee.assessmentFee.toString()
    let lmc = fee.lmc.toString()
    let groupSessionFee = fee.groupSessionFee.toString()

    this.feeForm.patchValue({
      sessionFee : sessionFee,
      assessmentFee : assessmentFee,
      lmc : lmc,
      groupSessionFee : groupSessionFee
    })
  }

  editFunction(){
    this.isEdit = false;
    let data ={
      sessionFee: this.feeForm.get('sessionFee').value,
      assessmentFee: this.feeForm.get('assessmentFee').value,
      lmc: this.feeForm.get('lmc').value,
      groupSessionFee: this.feeForm.get('groupSessionFee').value
    }
    this.adminService.editFees(data, this.feeId).subscribe((res)=>{
      this._snackBar.open("Fees updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          alert(error)
        }))
  }

  clearControls(){
    this.feeForm.reset()
    this.getFees()
  }

}
