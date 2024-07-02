import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-end-assessment-dialogue',
  templateUrl: './end-assessment-dialogue.component.html',
  styleUrls: ['./end-assessment-dialogue.component.scss']
})
export class EndAssessmentDialogueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EndAssessmentDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private therapistService : TherapistService,
  private adminService : AdminService, private _snackBar: MatSnackBar, private datePipe: DatePipe) { }

  OnDestroy(){
    this.endSub.unsubscribe();
    this.clientSub.unsubscribe();
  }

  endSessionForm = this.fb.group({
    remarks : [''],
    endDate : this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
    status : true
  })

  ngOnInit(): void {
  }

  endSub: Subscription;
  async endSession(){
    this.endSub = this.therapistService.updateAssessmentStatus(this.data.assessmentId, this.endSessionForm.getRawValue()).subscribe((res)=>{
      let clientData = {status : 'RS'}
      this.updateClientStatus(clientData, this.data.clientId)

      this._snackBar.open("Assessment Completed","Dismiss", {duration:3000})
    })
  }

  clientSub: Subscription;
  updateClientStatus(data : any, id : String){
    this.clientSub = this.adminService.updateClientStatus(data,id).subscribe((res)=>{
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
    history.back()
  }


}
