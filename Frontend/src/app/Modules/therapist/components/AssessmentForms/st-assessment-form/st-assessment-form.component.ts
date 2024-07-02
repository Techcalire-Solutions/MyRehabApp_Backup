import { TherapistService } from '../../../therapist.service';
import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';

@Component({
  selector: 'app-st-assessment-form',
  templateUrl: './st-assessment-form.component.html',
  styleUrls: ['./st-assessment-form.component.scss']
})

export class StAssessmentFormComponent implements OnInit, OnDestroy {

  stAssessmentForm = this.fb.group({
    assessmentMasterId: this.activatedRoute.snapshot.params['id'],
    childStrength: [''],
    parentConcern : [''],
    babbling : [''],
    babblingRemarks:[''],
    firstWord : [''],
    firstWordRemarks:[''],
    twoWord : [''],
    twoWordRemarks:[''],
    regression:[''],
    regressionRemarks:[''],
    impressionSpeech : [''],
    neckControl : [''],
    neckControlRemarks: [''],
    sitting : [''],
    sittingRemarks: [''],
    walking : [''],
    walkingRemarks: [''],
    impressionMotor : [''],
    structureLip: [''],
    FunctionLip : [''],
    structureTounge : [''],
    functionTounge : [''],
    structureTeeth : [''],
    functionTeeth : [''],
    structureAlveolus : [''],
    functionAlveolus : [''],
    structurePalate : [''],
    functionPalate : [''],
    structureUvula : [''],
    functionUvula : [''],
    structureMandible : [''],
    functionMandible : [''],
    sucking : [''],
    swallowing : [''],
    biting : [''],
    chewing : [''],
    blowing : [''],
    drooling : [''],
    otherConsultation : [''],
    eyeContact : [''],
    attentionConcentration : [''],
    sittingTolerance : [''],
    speechSkills : [''],
    fluencyProfile : [''],
    speechRate : [''],
    effort : [''],
    prosody : [''],
    speechRating : [''],
    stimulability : [''],
    phonologyProfile : [''],
    pitch : [''],
    loudness : [''],
    quality : [''],
    resonance : [''],
    languageProfile : [''],
    comprehension : [''],
    receptionMode : [''],
    expression : [''],
    expressionMode : [''],
    parentChildIntraction : [''],
    semanticRelation: [''],
    attribution : [''],
    action : [''],
    locativeAction : [''],
    existence : [''],
    nonExistence : [''],
    denial : [''],
    rejection : [''],
    recurrence : [''],
    possession : [''],
    playSkills : [''],
    greetingSkill : [''],
    requesting : [''],
    turnSkill : [''],
    topicInitiation : [''],
    topicMaintenance : [''],
    topicTermination : [''],
    socialSmile : [''],
    reciprocalSmile : [''],
    jointAttention : [''],
    minglingPeers : [''],
    temperTantrums : [''],
    selfBehaviour : [''],
    hyperActivity : [''],
    selfHelp : [''],
    toiletIndication : [''],
    hungerIndication : [''],
    bladderControl : [''],
    parentChildIntractionBehaviour : [''],
    matching : [''],
    association : [''],
    sequencing : [''],
    categorization : [''],
    logicalReasoning : [''],
    problemSolving : [''],
    memory : [''],
    hearing : [''],
    vision : [''],
    testAdminstered : [''],
    impression : [''],
    admissionAge : [''],
    academicBreakdown : [''],
    communicateParticipation : [''],
    provisionalDiagnosis : [''],
    familyStrength : [''],
    familyBarriers : [''],
    counselling : [''],
    goalsExplained : [''],
    recommendation : [''],
    overall : ['']
  });

  constructor(private fb: FormBuilder ,private therapistService:TherapistService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

  submitButtonState = false;
  async ngOnDestroy(){
    if(this.submitButtonState == false){
      await this.onSubmit();
    }
    if(this.submitS){
      this.submitS.unsubscribe();
    }
  }

  ngOnInit(): void {}

  st :any;
  submitS: Subscription;
  onSubmit(){
      this.submitButtonState = true;
      this.submitS = this.therapistService.saveStAssessmentForm(this.stAssessmentForm.getRawValue()).subscribe((res)=>{
      this.st = res;
      history.back()
      this._snackBar.open("St Assessment Form added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.stAssessmentForm.reset()
  }

}
