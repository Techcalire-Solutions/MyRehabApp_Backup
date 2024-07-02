import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-se-assessment-form',
  templateUrl: './se-assessment-form.component.html',
  styleUrls: ['./se-assessment-form.component.scss']
})
export class SeAssessmentFormComponent implements OnInit {

  constructor(private fb: FormBuilder ,private therapistService:TherapistService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.onSubmit();
    }

  seAssessmentForm = this.fb.group({
    assessmentMasterId: this.activatedRoute.snapshot.params['id'],
    informant : [''],
    strengthChild : [''],
    parentalConcern : [''],
    fuctionalAreas : this.fb.group({
      learningAndApplying : this.fb.group({
        watching : [''],
        listening : [''],
        memory : [''],
        attention : [''],
        solvingProblem : [''],
        socialProblem : [''],
        motivationalProblems : [''],
        emotionalProblems : [''],
      }),
      perceptualMotorSkills : this.fb.group({
        visual : [''],
        auditory : [''],
        motorCordination : [''],
        spatialOrientation : [''],
        learningStyle : [''],
        handedness : [''],
      }),
      generalTasks : this.fb.group({
        singleTasks : [''],
        multipleTasks : [''],
      }),
      communication : this.fb.group({
        spokenMessages : [''],
        nonVerbalMessages : [''],
        speaking : [''],
        producingMessage : [''],
        conversation : ['']
      }),
      mobility : this.fb.group({
        lifting : [''],
        fineHand : [''],
        walkingStairs : [''],
        movingAround : [''],
        usingTransportation : [''],
        driving : ['']
      }),
      selfCare : this.fb.group({
        washingOneself : [''],
        bodyParts : [''],
        toiletting : [''],
        dressing : [''],
        eating : [''],
        drinking : ['']
      }),
      domesticSelf : this.fb.group({
        acquisition : [''],
        householdWork : [''],
        assisting : ['']
      }),
      interpersonalInteractons :this.fb.group({
        basic : [''],
        withStrangers : [''],
        formalRelation : [''],
        informalRelation : [''],
        familyRelation : ['']
      }),
      majorLifeAreas : this.fb.group({
        informalEducation : [''],
        schoolEducation : [''],
        higherEducation : ['']
      }),
      communityLife : [''],
      functionalAbilities : [''],
    }),

    specificEducationalAreas : this.fb.group({
      materialsUsed : [''],
      objectInteraction : [''],
      communicationLanguage : this.fb.group({
        expressive : [''],
        receptive : [''],
      }),
      concepts : this.fb.group({
        color : [''],
        shapes : [''],
        size : [''],
        quantity : [''],
        matching : [''],
        similarities : [''],
        differences : [''],
        classification : [''],
      }),
      seriation : [''],
      oneToOne : [''],
      reversibility : [''],
      specialConcepts : [''],
      earlyLiteracy : this.fb.group({
        preReading : this.fb.group({
          namePicture : [''],
          whatTheySee : [''],
          handleBook : [''],
          alphabets : [''],
          sightWords : [''],
          letterSound : ['']
        }),
        preWriting : this.fb.group({
          horizontalStroke : [''],
          verticalStroke : [''],
          circularScribble : [''],
          plusShape : [''],
          square : [''],
          triangle : [''],
          grasp : [''],
          capitalAlphabets : [''],
          smallAlphabets : ['']
        }),
        preMaths : this.fb.group({
          roteCount : [''],
          recognitionNumeral : [''],
          meaningfulCounting : [''],
          moreLess : ['']
        })
      }),
      presentLiteracy : this.fb.group({
        reading : this.fb.group({
          phoneticAwareness : [''],
          fingerTracing : [''],
          spellingAloud : [''],
          omitsWord : [''],
          substituteWord : [''],
          ignorePunctuation : [''],
          posture : [''],
          loudVoice : [''],
          distanceBookEye : [''],
          reading : [''],
          addWord : [''],
          mispronounceWord : [''],
          pronounceWord : [''],
          specify : ['']
        }),
        writing : this.fb.group({
          leftToRight : [''],
          ignoreMargin : [''],
          ignoreLine : [''],
          overWritting : [''],
          posture : [''],
          writingStyle : [''],
          mixingCapitalSmall : [''],
          omits : [''],
          spaciningLine : [''],
          puctuations : [''],
          letterReversal : [''],
          wordReversal : [''],
          anyOther : ['']
        }),
        spelling : this.fb.group({
          sightWords : [''],
          cvcWords : [''],
          blendWords : [''],
          consonant : [''],
          anyOther : ['']
        }),
        readingComprehension : this.fb.group({
          promptAnswers : [''],
          repeatedQuestion : [''],
          transalatedQuestion : [''],
          answerReadingMaterial : [''],
          refusesOrRepeats : [''],
          anyOther : ['']
        }),
        aritmeticComputation : this.fb.group({
          rightLeft : [''],
          operationalSymbols : [''],
          placeValues : [''],
          fingerCounting : [''],
          drawAddtion : [''],
          darwSubtraction : [''],
          ignoreAddition : [''],
          ignoreSubtraction : [''],
          errorMultplication : [''],
          errorDivision : [''],
          errorTransfer : [''],
          substitutions : [''],
          errorDecimalPoint : [''],
          addition : [''],
          subtraction : [''],
          multiplication : [''],
          division : [''],
          anyOther : ['']
        }),
        arithmeticReasoning : this.fb.group({
          readStorySum : [''],
          explainStorySum : [''],
          addition : [''],
          subtraction : [''],
          mutiplication : [''],
          division : [''],
          anyOther : ['']
        })
      }),
      testAdministered : [''],
      impressions : [''],
      observations : [''],
      recommendations : ['']
    }),
    provisonalDiadnosis : [''],
    environmentalStreams : [''],
    environmentalBarriers : ['']
  })

  submitButtonState = false;
  async ngOnDestroy(){
    if(this.submitButtonState == false){
      await this.onSubmit();
    }
    if(this.submitS){
      this.submitS.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

  se : any;
  submitS: Subscription;
  onSubmit(){
      this.submitButtonState = true;
      this.submitS = this.therapistService.saveSeAssessmentForm(this.seAssessmentForm.getRawValue()).subscribe((res)=>{
      this.se = res;
      history.back()
      this._snackBar.open("SE Assessment Form added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.seAssessmentForm.reset()
  }
}
