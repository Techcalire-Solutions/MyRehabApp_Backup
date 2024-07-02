import { OtAssessment } from '../../../models/otAssessmentForm';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-ot-assessment-form',
  templateUrl: './edit-ot-assessment-form.component.html',
  styleUrls: ['./edit-ot-assessment-form.component.scss']
})
export class EditOtAssessmentFormComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder ,private therapistService:TherapistService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.otSubscription.unsubscribe()
    if(this.submitS){
      this.submitS.unsubscribe();
    }
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

  otSubscription: Subscription;
  ngOnInit(): void {
    this.otSubscription = this.editOtAssessmentForm();
  }

  otData : OtAssessment;
  editOtAssessmentForm(){
    return this.therapistService.getOtAssessmentId(this.activatedRoute.snapshot.params['id']).subscribe((ot)=>{
      this.otData = ot


      let medicalDiagnosis = this.otData.medicalDiagnosis.toString()
      let generalAppearence = this.otData.generalAppearence.toString()
      let onObservation = this.otData.onObservation.toString()

      //performance areas
      let grooming = this.otData.performanceAreas.dailyLiving.grooming.toString()
      let oralHygiene = this.otData.performanceAreas.dailyLiving.oralHygiene.toString()
      let bathing = this.otData.performanceAreas.dailyLiving.bathing.toString()
      let toiletHygiene = this.otData.performanceAreas.dailyLiving.toiletHygiene.toString()
      let dressing = this.otData.performanceAreas.dailyLiving.dressing.toString()
      let functionalMobility = this.otData.performanceAreas.dailyLiving.functionalMobility.toString()

      let educational = this.otData.performanceAreas.educational.toString()
      let playAndLeisure = this.otData.performanceAreas.playAndLeisure.toString()

      //performance components
      let sensoryAwareness = this.otData.performanceComponents.sensorymotor.sensoryIntegration.sensoryAwareness.toString()
      let sensoryProcessing = this.otData.performanceComponents.sensorymotor.sensoryIntegration.sensoryProcessing.toString()

      let tactile = this.otData.performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.tactile.toString()
      let propriceptive = this.otData.performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.propriceptive.toString()
      let vestibular = this.otData.performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.vestibular.toString()
      let auditory = this.otData.performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.auditory.toString()
      let visual = this.otData.performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.visual.toString()
      let gustatory = this.otData.performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.gustatory.toString()
      let olfactory = this.otData.performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.olfactory.toString()

      let stereognosis = this.otData.performanceComponents.sensorymotor.perceptualSkills.stereognosis.toString()
      let kinesthesia = this.otData.performanceComponents.sensorymotor.perceptualSkills.kinesthesia.toString()
      let bodyScheme = this.otData.performanceComponents.sensorymotor.perceptualSkills.bodyScheme.toString()
      let rlDiscrimination = this.otData.performanceComponents.sensorymotor.perceptualSkills.rlDiscrimination.toString()
      let formConstancy = this.otData.performanceComponents.sensorymotor.perceptualSkills.formConstancy.toString()
      let positionSpace = this.otData.performanceComponents.sensorymotor.perceptualSkills.positionSpace.toString()
      let visualClosure = this.otData.performanceComponents.sensorymotor.perceptualSkills.visualClosure.toString()
      let groundDiscrimination = this.otData.performanceComponents.sensorymotor.perceptualSkills.groundDiscrimination.toString()
      let depthPerception = this.otData.performanceComponents.sensorymotor.perceptualSkills.depthPerception.toString()
      let topographicalOrientation = this.otData.performanceComponents.sensorymotor.perceptualSkills.topographicalOrientation.toString()

      let rom = this.otData.performanceComponents.neuroMuscular.rom.toString()
      let muscleTone = this.otData.performanceComponents.neuroMuscular.muscleTone.toString()
      let tightness = this.otData.performanceComponents.neuroMuscular.tightness.toString()
      let contracture = this.otData.performanceComponents.neuroMuscular.contracture.toString()
      let deformity = this.otData.performanceComponents.neuroMuscular.deformity.toString()
      let muscleStrength = this.otData.performanceComponents.neuroMuscular.muscleStrength.toString()
      let endurance = this.otData.performanceComponents.neuroMuscular.endurance.toString()
      let posturalSitting = this.otData.performanceComponents.neuroMuscular.posturalSitting.toString()
      let posturalStanding = this.otData.performanceComponents.neuroMuscular.posturalStanding.toString()
      let gait = this.otData.performanceComponents.neuroMuscular.gait.toString()
      let otherFindings = this.otData.performanceComponents.neuroMuscular.otherFindings.toString()

      let activityTolerance = this.otData.performanceComponents.motor.activityTolerance.toString()
      let grossMotor = this.otData.performanceComponents.motor.grossMotor.toString()
      let midlineCrossing = this.otData.performanceComponents.motor.midlineCrossing.toString()
      let laterality = this.otData.performanceComponents.motor.laterality.toString()
      let bilateralIntegration = this.otData.performanceComponents.motor.bilateralIntegration.toString()
      let praxis = this.otData.performanceComponents.motor.praxis.toString()
      let fineMotor = this.otData.performanceComponents.motor.fineMotor.toString()
      let standingBalance = this.otData.performanceComponents.motor.standingBalance.toString()
      let oralMotor = this.otData.performanceComponents.motor.oralMotor.toString()

      let reachRight = this.otData.performanceComponents.handFunction.reach.right.toString()
      let reachLeft = this.otData.performanceComponents.handFunction.reach.left.toString()

      let graspRight = this.otData.performanceComponents.handFunction.grasp.right.toString()
      let graspLeft = this.otData.performanceComponents.handFunction.grasp.left.toString()

      let prehensionRight = this.otData.performanceComponents.handFunction.prehension.right.toString()
      let prehensionLeft = this.otData.performanceComponents.handFunction.prehension.left.toString()

      let oppositionRight = this.otData.performanceComponents.handFunction.opposition.right.toString()
      let oppositionLeft = this.otData.performanceComponents.handFunction.opposition.left.toString()

      let releaseRight = this.otData.performanceComponents.handFunction.release.right.toString()
      let releaseLeft = this.otData.performanceComponents.handFunction.release.left.toString()

      let preWritingRight = this.otData.performanceComponents.handFunction.preWriting.right.toString()
      let preWritingLeft = this.otData.performanceComponents.handFunction.preWriting.left.toString()

      let arousal = this.otData.performanceComponents.cognitiveFunctioning.cognitiveIntegration.arousal.toString()
      let initiationActivity = this.otData.performanceComponents.cognitiveFunctioning.cognitiveIntegration.initiationActivity.toString()
      let terminationActivity = this.otData.performanceComponents.cognitiveFunctioning.cognitiveIntegration.terminationActivity.toString()
      let orientationTime = this.otData.performanceComponents.cognitiveFunctioning.cognitiveIntegration.orientationTime.toString()
      let orientationPlace = this.otData.performanceComponents.cognitiveFunctioning.cognitiveIntegration.orientationPlace.toString()
      let recognition =this.otData.performanceComponents.cognitiveFunctioning.cognitiveIntegration.recognition.toString()

      let attentionSpan = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.attentionSpan.toString()
      let concentrationSpan = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.concentrationSpan.toString()
      let stm = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.stm.toString()
      let ltm = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.ltm.toString()
      let recentMemory = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.recentMemory.toString()
      let workingMemory = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.workingMemory.toString()
      let sequencing = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.sequencing.toString()
      let categorisation = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.categorisation.toString()
      let conceptFormation = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.conceptFormation.toString()
      let problemSolving = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.problemSolving.toString()
      let generalisationLearning = this.otData.performanceComponents.cognitiveFunctioning.cognitiveComponent.generalisationLearning.toString()

      this.otAssessmentForm.patchValue({
        medicalDiagnosis : medicalDiagnosis,
        generalAppearence : generalAppearence,
        onObservation : onObservation,

        performanceAreas : {
          dailyLiving : {
            grooming:grooming,
            oralHygiene:oralHygiene,
            bathing:bathing,
            toiletHygiene:toiletHygiene,
            dressing:dressing,
            functionalMobility:functionalMobility,
          },
          educational: educational,
          playAndLeisure: playAndLeisure
        },

        performanceComponents : {
          sensorymotor : {
            sensoryIntegration : {
              sensoryAwareness: sensoryAwareness,
              sensoryProcessing: sensoryProcessing,
              interpretAbility : {
                tactile: tactile,
                propriceptive: propriceptive,
                vestibular: vestibular,
                auditory: auditory,
                visual: visual,
                gustatory: gustatory,
                olfactory: olfactory
              }
            },
            perceptualSkills : {
              stereognosis: stereognosis,
              kinesthesia: kinesthesia,
              bodyScheme: bodyScheme,
              rlDiscrimination: rlDiscrimination,
              formConstancy: formConstancy,
              positionSpace: positionSpace,
              visualClosure: visualClosure,
              groundDiscrimination: groundDiscrimination,
              depthPerception: depthPerception,
              topographicalOrientation: topographicalOrientation
            }
          },
          neuroMuscular : {
            rom: rom,
            muscleTone: muscleTone,
            tightness: tightness,
            contracture: contracture,
            deformity: deformity,
            muscleStrength: muscleStrength,
            endurance: endurance,
            posturalSitting: posturalSitting,
            posturalStanding: posturalStanding,
            gait: gait,
            otherFindings: otherFindings
          },
          motor : {
            activityTolerance: activityTolerance,
            grossMotor: grossMotor,
            midlineCrossing: midlineCrossing,
            laterality: laterality,
            bilateralIntegration: bilateralIntegration,
            praxis: praxis,
            fineMotor: fineMotor,
            standingBalance: standingBalance,
            oralMotor: oralMotor
          },
          handFunction : {
            reach : {
              right : reachRight,
              left : reachLeft
            },
            grasp : {
              right : graspRight,
              left : graspLeft
            },
            prehension : {
              right : prehensionRight,
              left : prehensionLeft
            },
            opposition : {
              right : oppositionRight,
              left : oppositionLeft
            },
            release : {
              right : releaseRight,
              left : releaseLeft
            },
            preWriting : {
              right : preWritingLeft,
              left : preWritingLeft
            }
          },
          cognitiveFunctioning : {
            cognitiveIntegration : {
              arousal: arousal,
              initiationActivity: initiationActivity,
              terminationActivity: terminationActivity,
              orientationTime: orientationTime,
              orientationPlace: orientationPlace,
              recognition: recognition,
            },
            cognitiveComponent : {
              attentionSpan: attentionSpan,
              concentrationSpan: concentrationSpan,
              stm: stm,
              ltm: ltm,
              recentMemory: recentMemory,
              workingMemory: workingMemory,
              sequencing: sequencing,
              categorisation: categorisation,
              conceptFormation: conceptFormation,
              problemSolving: problemSolving,
              generalisationLearning: generalisationLearning,
            }
          }
        }
      })
    })

  }

  submitS: Subscription;
  ot : any;
  onSubmit(){
    let data = {
      medicalDiagnosis : this.otAssessmentForm.get('medicalDiagnosis').value,
      generalAppearence : this.otAssessmentForm.get('generalAppearence').value,
      onObservation : this.otAssessmentForm.get('onObservation').value,

      performanceAreas : {
        dailyLiving : {
          grooming: this.otAssessmentForm.get('performanceAreas.dailyLiving.grooming').value,
          oralHygiene: this.otAssessmentForm.get('performanceAreas.dailyLiving.oralHygiene').value,
          bathing: this.otAssessmentForm.get('performanceAreas.dailyLiving.bathing').value,
          toiletHygiene: this.otAssessmentForm.get('performanceAreas.dailyLiving.toiletHygiene').value,
          dressing: this.otAssessmentForm.get('performanceAreas.dailyLiving.dressing').value,
          functionalMobility: this.otAssessmentForm.get('performanceAreas.dailyLiving.functionalMobility').value,
        },
        educational: this.otAssessmentForm.get('performanceAreas.educational').value,
        playAndLeisure: this.otAssessmentForm.get('performanceAreas.playAndLeisure').value
      },

      performanceComponents : {
        sensorymotor : {
          sensoryIntegration : {
            sensoryAwareness: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.sensoryAwareness').value,
            sensoryProcessing: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.sensoryProcessing').value,
            interpretAbility : {
              tactile: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.tactile').value,
              propriceptive: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.propriceptive').value,
              vestibular: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.vestibular').value,
              auditory: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.auditory').value,
              visual: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.visual').value,
              gustatory: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.gustatory').value,
              olfactory: this.otAssessmentForm.get('performanceComponents.sensorymotor.sensoryIntegration.interpretAbility.olfactory').value
            }
          },
          perceptualSkills : {
            stereognosis: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.stereognosis').value,
            kinesthesia: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.kinesthesia').value,
            bodyScheme: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.bodyScheme').value,
            rlDiscrimination: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.rlDiscrimination').value,
            formConstancy: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.formConstancy').value,
            positionSpace: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.positionSpace').value,
            visualClosure: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.visualClosure').value,
            groundDiscrimination: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.groundDiscrimination').value,
            depthPerception: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.depthPerception').value,
            topographicalOrientation: this.otAssessmentForm.get('performanceComponents.sensorymotor.perceptualSkills.topographicalOrientation').value,
          }
        },
        neuroMuscular : {
          rom: this.otAssessmentForm.get('performanceComponents.neuroMuscular.rom').value,
          muscleTone: this.otAssessmentForm.get('performanceComponents.neuroMuscular.muscleTone').value,
          tightness: this.otAssessmentForm.get('performanceComponents.neuroMuscular.tightness').value,
          contracture: this.otAssessmentForm.get('performanceComponents.neuroMuscular.contracture').value,
          deformity: this.otAssessmentForm.get('performanceComponents.neuroMuscular.deformity').value,
          muscleStrength: this.otAssessmentForm.get('performanceComponents.neuroMuscular.muscleStrength').value,
          endurance: this.otAssessmentForm.get('performanceComponents.neuroMuscular.endurance').value,
          posturalSitting: this.otAssessmentForm.get('performanceComponents.neuroMuscular.posturalSitting').value,
          posturalStanding: this.otAssessmentForm.get('performanceComponents.neuroMuscular.posturalStanding').value,
          gait: this.otAssessmentForm.get('performanceComponents.neuroMuscular.gait').value,
          otherFindings: this.otAssessmentForm.get('performanceComponents.neuroMuscular.otherFindings').value
        },
        motor : {
          activityTolerance: this.otAssessmentForm.get('performanceComponents.motor.activityTolerance').value,
          grossMotor: this.otAssessmentForm.get('performanceComponents.motor.grossMotor').value,
          midlineCrossing: this.otAssessmentForm.get('performanceComponents.motor.midlineCrossing').value,
          laterality: this.otAssessmentForm.get('performanceComponents.motor.laterality').value,
          bilateralIntegration: this.otAssessmentForm.get('performanceComponents.motor.bilateralIntegration').value,
          praxis: this.otAssessmentForm.get('performanceComponents.motor.praxis').value,
          fineMotor: this.otAssessmentForm.get('performanceComponents.motor.fineMotor').value,
          standingBalance: this.otAssessmentForm.get('performanceComponents.motor.standingBalance').value,
          oralMotor: this.otAssessmentForm.get('performanceComponents.motor.oralMotor').value
        },
        handFunction : {
          reach : {
            right : this.otAssessmentForm.get('performanceComponents.handFunction.reach.right').value,
            left : this.otAssessmentForm.get('performanceComponents.handFunction.reach.left').value
          },
          grasp : {
            right : this.otAssessmentForm.get('performanceComponents.handFunction.grasp.right').value,
            left : this.otAssessmentForm.get('performanceComponents.handFunction.grasp.left').value
          },
          prehension : {
            right : this.otAssessmentForm.get('performanceComponents.handFunction.prehension.right').value,
            left : this.otAssessmentForm.get('performanceComponents.handFunction.prehension.left').value
          },
          opposition : {
            right : this.otAssessmentForm.get('performanceComponents.handFunction.opposition.right').value,
            left : this.otAssessmentForm.get('performanceComponents.handFunction.opposition.left').value
          },
          release : {
            right : this.otAssessmentForm.get('performanceComponents.handFunction.release.right').value,
            left : this.otAssessmentForm.get('performanceComponents.handFunction.release.left').value
          },
          preWriting : {
            right : this.otAssessmentForm.get('performanceComponents.handFunction.preWriting.right').value,
            left : this.otAssessmentForm.get('performanceComponents.handFunction.preWriting.left').value
          }
        },
        cognitiveFunctioning : {
          cognitiveIntegration : {
            arousal: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveIntegration.arousal').value,
            initiationActivity: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveIntegration.initiationActivity').value,
            terminationActivity: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveIntegration.terminationActivity').value,
            orientationTime: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveIntegration.orientationTime').value,
            orientationPlace: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveIntegration.orientationPlace').value,
            recognition: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveIntegration.recognition').value,
          },
          cognitiveComponent : {
            attentionSpan: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.attentionSpan').value,
            concentrationSpan: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.concentrationSpan').value,
            stm: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.stm').value,
            ltm: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.ltm').value,
            recentMemory: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.recentMemory').value,
            workingMemory: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.workingMemory').value,
            sequencing: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.sequencing').value,
            categorisation: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.categorisation').value,
            conceptFormation: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.conceptFormation').value,
            problemSolving: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.problemSolving').value,
            generalisationLearning: this.otAssessmentForm.get('performanceComponents.cognitiveFunctioning.cognitiveComponent.generalisationLearning').value,
          }
        }
      }
    }

    this.submitS = this.therapistService.editOtAssessmentForm(data, this.activatedRoute.snapshot.params['id']).subscribe((res)=>{
      history.back()
      this._snackBar.open(" Upated successfully...","" ,{duration:3000})
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

