import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-fee-details-dialogue',
  templateUrl: './pending-fee-details-dialogue.component.html',
  styleUrls: ['./pending-fee-details-dialogue.component.scss']
})
export class PendingFeeDetailsDialogueComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
  public dialogRef: MatDialogRef<PendingFeeDetailsDialogueComponent>) { }

  displayedColumns: string[] = [ 'date','therapistName','slotName', 'pendingAmount','sessionStatus','manage'];

  ngOnInit(): void {
  }

  payFee(id: string){
    this.router.navigateByUrl('/admin/paypendingfees/'+ id)
    this.dialogRef.close();
  }

  payCurrentFee(){
    this.dialogRef.close(true);
  }

}
