import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-view-assessment-master-dialogue',
  templateUrl: './view-assessment-master-dialogue.component.html',
  styleUrls: ['./view-assessment-master-dialogue.component.scss']
})
export class ViewAssessmentMasterDialogueComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private therapistService : TherapistService,
  private adminService : AdminService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
