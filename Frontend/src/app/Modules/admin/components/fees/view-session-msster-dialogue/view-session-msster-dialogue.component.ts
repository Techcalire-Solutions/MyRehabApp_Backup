import { SessionMaster } from '../../../../therapist/models/sessionMaster';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { constrainPoint } from '@fullcalendar/core/internal';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-view-session-msster-dialogue',
  templateUrl: './view-session-msster-dialogue.component.html',
  styleUrls: ['./view-session-msster-dialogue.component.scss']
})
export class ViewSessionMssterDialogueComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private therapistService : TherapistService,
  private adminService : AdminService, private _snackBar: MatSnackBar, private router: Router,
  private dailog:MatDialogRef<ViewSessionMssterDialogueComponent>) { }

  ngOnInit(): void {

  }

  printDiv(){
    this.dailog.close()
    this.router.navigateByUrl('/admin/printinvoice/'+ this.data._id)
    
  }

}
