import { TherapistService } from '../../../therapist.service';
import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { getMatIconNameNotFoundError } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bt-assessment-form',
  templateUrl: './bt-assessment-form.component.html',
  styleUrls: ['./bt-assessment-form.component.scss']
})
export class BtAssessmentFormComponent implements OnInit,OnDestroy {

  btAssessmentForm = this.fb.group({
    assessmentMasterId: this.activatedRoute.snapshot.params['id'],
    kco: [''],
    informants: [''],
    presentingConcerns: [''],
    personalHistory: [''],
    gadgetExposure:[''],
    seizure: [''],
    drugUsage: [''],
    therapyHistory: [''],
    familyHistory: [''],
    developmentalMilestones: [''],
    occupationalHistory: [''],
    schoolHistory: [''],
    behaviouralConcerns: [''],
    physicalAppearance: [''],
    activityLevel: [''],
    attentionConcentration: [''],
    emotionalRegulation: [''],
    attachment: [''],
    vsms: [false],
    ddst: [false],
    sfbt: [false],
    gdt: [false],
    bkt: [false],
    mchat: [false],
    vanderbelt: [false],
    dpcl: [false],
    nimhans: [false],
    testFindings: [''],
    impression: [''],
    actionPlanforFuture: ['']
  });

  constructor(private fb: FormBuilder ,private therapistService:TherapistService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private adminService: AdminService) { }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

  ngOnInit(): void {}

  submitButtonState = false;
  async ngOnDestroy(){
    if(this.submitButtonState == false){
      await this.onSubmit();
    }
    if(this.submitS){
      this.submitS.unsubscribe();
    }
  }

  user :any;
  submitS: Subscription;
  onSubmit(){
    this.submitButtonState = true;
      this.submitS = this.therapistService.saveBtAssessmentForm(this.btAssessmentForm.getRawValue()).subscribe((res)=>{
      this.user = res;
      history.back()
      this._snackBar.open("BT Assessment Form added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.btAssessmentForm.reset()
  }

}
