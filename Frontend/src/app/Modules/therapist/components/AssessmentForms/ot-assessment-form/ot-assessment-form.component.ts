import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ot-assessment-form',
  templateUrl: './ot-assessment-form.component.html',
  styleUrls: ['./ot-assessment-form.component.scss']
})

export class OtAssessmentFormComponent implements OnInit, OnDestroy  {

  constructor(private fb: FormBuilder ,private therapistService:TherapistService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private router: Router) { }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

  otAssessmentForm = this.fb.group({
    assessmentMasterId: this.activatedRoute.snapshot.params['id'],
    medicalDiagnosis : [''],
    generalAppearence : [''],
    onObservation : [''],
    performanceAreas : this.fb.group({
      dailyLiving : this.fb.group({
        grooming: [''],
        oralHygiene: [''],
        bathing: [''],
        toiletHygiene: [''],
        dressing: [''],
        functionalMobility: [''],
      }),
      educational : [''],
      playAndLeisure : ['']
    }),
    performanceComponents : this.fb.group({
      sensorymotor : this.fb.group({
        sensoryIntegration : this.fb.group({
          sensoryAwareness: [''],
          sensoryProcessing: [''],
          interpretAbility : this.fb.group({
            tactile: [''],
            propriceptive: [''],
            vestibular: [''],
            auditory: [''],
            visual: [''],
            gustatory: [''],
            olfactory: ['']
          }),
        }),
        perceptualSkills : this.fb.group({
          stereognosis: [''],
          kinesthesia: [''],
          bodyScheme: [''],
          rlDiscrimination: [''],
          formConstancy: [''],
          positionSpace: [''],
          visualClosure: [''],
          groundDiscrimination: [''],
          depthPerception: [''],
          topographicalOrientation: ['']
        }),
      }),
      neuroMuscular : this.fb.group({
        rom: [''],
        muscleTone: [''],
        tightness: [''],
        contracture: [''],
        deformity: [''],
        muscleStrength: [''],
        endurance: [''],
        posturalSitting: [''],
        posturalStanding: [''],
        gait: [''],
        otherFindings: ['']
      }),
      motor : this.fb.group({
        activityTolerance: [''],
        grossMotor: [''],
        midlineCrossing: [''],
        laterality: [''],
        bilateralIntegration: [''],
        praxis: [''],
        fineMotor: [''],
        standingBalance: [''],
        oralMotor: ['']
      }),
      handFunction : this.fb.group({
        reach : this.fb.group({
          right: [''],
          left: ['']
        }),
        grasp : this.fb.group({
          right: [''],
          left: ['']
        }),
        prehension : this.fb.group({
          right: [''],
          left: ['']
        }),
        opposition : this.fb.group({
          right: [''],
          left: ['']
        }),
        release: this.fb.group({
          right: [''],
          left: ['']
        }),
        preWriting: this.fb.group({
          right: [''],
          left: ['']
        })
      }),
      cognitiveFunctioning:this.fb.group({
        cognitiveIntegration:this.fb.group({
            arousal: [''],
            initiationActivity: [''],
            terminationActivity: [''],
            orientationTime: [''],
            orientationPlace: [''],
            recognition: [''],
        }),
        cognitiveComponent: this.fb.group({
            attentionSpan: [''],
            concentrationSpan: [''],
            stm: [''],
            ltm: [''],
            recentMemory: [''],
            workingMemory: [''],
            sequencing: [''],
            categorisation: [''],
            conceptFormation: [''],
            problemSolving: [''],
            generalisationLearning: [''],
        })
      })
    }),
    remarks: ['']
  })

  ngOnInit(): void {
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

  ot : any;
  submitS: Subscription;
  onSubmit(){
      this.submitButtonState = true;
      this.submitS = this.therapistService.saveOtAssessmentForm(this.otAssessmentForm.getRawValue()).subscribe((res)=>{
      this.ot = res;
      history.back()
      this._snackBar.open("Ot Assessment Form added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.otAssessmentForm.reset()
  }
}
