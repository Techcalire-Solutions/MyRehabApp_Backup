import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { OtSessionData } from '../../../models/otSessionData';
import { SessionMaster } from '../../../models/sessionMaster';
import { TherapistService } from '../../../therapist.service';

@Component({
  selector: 'app-edit-ot-data',
  templateUrl: './edit-ot-data.component.html',
  styleUrls: ['./edit-ot-data.component.scss']
})
export class EditOtDataComponent implements OnInit, OnDestroy {
  otSessionForm = this.fb.group({
    sensoryModulation : this.fb.group({
      threshold :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      arousal :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      })
    }),
    proprioceptiveDiscrimination : this.fb.group({
      remarks: [''],
      key:[''],
      prompt:['']
    }),
    vestibularDiscrimination  : this.fb.group({
      remarks: [''],
      key:[''],
      prompt:['']
    }),
    tactileDiscrimination : this.fb.group({
      toolManipulation :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      visionOccluded :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      })
    }),
    visual : this.fb.group({
      acuity :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      eyeStrain :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      quickLocalisation :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      generalEyeMovements :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      dissociation :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      perceptual :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      })
    }),
    postural : this.fb.group({
      muscleTone :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      reflex :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      endurance :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      posturalControl :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      gait :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      })
    }),
    bilateralIntegration : this.fb.group({
      midlineCrossing :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      symmetrical :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      asymmetrical :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      reciprocal :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      })
    }),
    praxis : this.fb.group({
      ideation :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      motorPlanning :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      execution :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      })
    }),
    grossMotor : this.fb.group({
      remarks: [''],
      key:[''],
      prompt:['']
    }),
    fineMotor : this.fb.group({
      strength :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      grip :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      isolationWrist :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      isolationFingers :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      })
    }),
    auditoryAndLanguage : this.fb.group({
      articulation :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
      followingInstructions :this.fb.group({
        remarks: [''],
        key:[''],
        prompt:['']
      }),
    }),
    adl : this.fb.group({
      remarks: [''],
      key:[''],
      prompt:['']
    }),
    emotional : this.fb.group({
      remarks: [''],
      key:[''],
      prompt:['']
    }),
  })



    keys =[
      {name:'Maximal Support',value:'20'},
      {name:'Moderate Support',value:'40'},
      {name:'Min Support / More Inconsistency',value:'60'},
      {name:'Min Support / Less Inconsistency',value:'80'},
      {name:'Mastered',value:'100'}
    ]

    prompts = [
      {name:'Full physical',value:'1'},
      {name:'Partial Physical',value:'2'},
      {name:'Model',value:'3'},
      {name:'Visual',value:'4'},
      {name:'Verbal',value:'5'},
      {name:'Gestural',value:'6'},
      {name:'Natural Cue',value:'7'}
    ]

    constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
      private router: Router,  public authService:AuthService, private therapistService: TherapistService, public dialog:MatDialog) { }

    ngOnDestroy(): void {
      this.otSubscription.unsubscribe()
      if(this.submitS){
        this.submitS.unsubscribe()
      }
    }

    ot: any;
    otSessionData : OtSessionData[]=[];
    id: any
    otSessionId: '';
    otData : OtSessionData;

    otSubscription: Subscription;
    ngOnInit(): void {
      this.otSubscription = this.editOtDataSession()
    }

    editOtDataSession(){
      return this.therapistService.getOtSessionDataId(this.activatedRoute.snapshot.params['id']).subscribe((ot)=>{
        this.otData = ot
        this.otSessionData.push(ot)
        this.id = this.otData._id

        let thRemarks = this.otData.sensoryModulation.threshold.remarks.toString()
        let thKey = this.otData.sensoryModulation.threshold.key.toString()
        let thPrompt = this.otData.sensoryModulation.threshold.prompt.toString()

        let arRemarks = this.otData.sensoryModulation.arousal.remarks.toString()
        let arKey = this.otData.sensoryModulation.arousal.key.toString()
        let arPrompt = this.otData.sensoryModulation.arousal.prompt.toString()


        let prRemarks = this.otData.proprioceptiveDiscrimination.remarks.toString()
        let prKey = this.otData.proprioceptiveDiscrimination.key.toString()
        let prPrompt = this.otData.proprioceptiveDiscrimination.prompt.toString()


        let veRemarks = this.otData.vestibularDiscrimination.remarks.toString()
        let veKey = this.otData.vestibularDiscrimination.key.toString()
        let vePrompt = this.otData.vestibularDiscrimination.prompt.toString()


        let toRemarks = this.otData.tactileDiscrimination.toolManipulation.remarks.toString()
        let toKey = this.otData.tactileDiscrimination.toolManipulation.key.toString()
        let toPrompt = this.otData.tactileDiscrimination.toolManipulation.prompt.toString()

        let viRemarks = this.otData.tactileDiscrimination.visionOccluded.remarks.toString()
        let viKey = this.otData.tactileDiscrimination.visionOccluded.key.toString()
        let viPrompt = this.otData.tactileDiscrimination.visionOccluded.prompt.toString()


        let acRemarks = this.otData.visual.acuity.remarks.toString()
        let acKey = this.otData.visual.acuity.key.toString()
        let acPrompt = this.otData.visual.acuity.prompt.toString()

        let eyRemarks = this.otData.visual.eyeStrain.remarks.toString()
        let eyKey = this.otData.visual.eyeStrain.key.toString()
        let eyPrompt = this.otData.visual.eyeStrain.prompt.toString()

        let diRemarks = this.otData.visual.dissociation.remarks.toString()
        let diKey = this.otData.visual.dissociation.key.toString()
        let diPrompt = this.otData.visual.dissociation.prompt.toString()

        let geRemarks = this.otData.visual.generalEyeMovements.remarks.toString()
        let geKey = this.otData.visual.generalEyeMovements.key.toString()
        let gePrompt = this.otData.visual.generalEyeMovements.prompt.toString()

        let peRemarks = this.otData.visual.perceptual.remarks.toString()
        let peKey = this.otData.visual.perceptual.key.toString()
        let pePrompt = this.otData.visual.perceptual.prompt.toString()

        let quRemarks = this.otData.visual.quickLocalisation.remarks.toString()
        let quKey = this.otData.visual.quickLocalisation.key.toString()
        let quPrompt = this.otData.visual.quickLocalisation.prompt.toString()


        let muRemarks = this.otData.postural.muscleTone.remarks.toString()
        let muKey = this.otData.postural.muscleTone.key.toString()
        let muPrompt = this.otData.postural.muscleTone.prompt.toString()

        let reRemarks = this.otData.postural.reflex.remarks.toString()
        let reKey = this.otData.postural.reflex.key.toString()
        let rePrompt = this.otData.postural.reflex.prompt.toString()

        let enRemarks = this.otData.postural.endurance.remarks.toString()
        let enKey = this.otData.postural.endurance.key.toString()
        let enPrompt = this.otData.postural.endurance.prompt.toString()

        let poRemarks = this.otData.postural.posturalControl.remarks.toString()
        let poKey = this.otData.postural.posturalControl.key.toString()
        let poPrompt = this.otData.postural.posturalControl.prompt.toString()

        let gaRemarks = this.otData.postural.gait.remarks.toString()
        let gaKey = this.otData.postural.gait.key.toString()
        let gaPrompt = this.otData.postural.gait.prompt.toString()


        let miRemarks = this.otData.bilateralIntegration.midlineCrossing.remarks.toString()
        let miKey = this.otData.bilateralIntegration.midlineCrossing.key.toString()
        let miPrompt = this.otData.bilateralIntegration.midlineCrossing.prompt.toString()

        let syRemarks = this.otData.bilateralIntegration.symmetrical.remarks.toString()
        let syKey = this.otData.bilateralIntegration.symmetrical.key.toString()
        let syPrompt = this.otData.bilateralIntegration.symmetrical.prompt.toString()

        let asRemarks = this.otData.bilateralIntegration.asymmetrical.remarks.toString()
        let asKey = this.otData.bilateralIntegration.asymmetrical.key.toString()
        let asPrompt = this.otData.bilateralIntegration.asymmetrical.prompt.toString()

        let recRemarks = this.otData.bilateralIntegration.reciprocal.remarks.toString()
        let recKey = this.otData.bilateralIntegration.reciprocal.key.toString()
        let recPrompt = this.otData.bilateralIntegration.reciprocal.prompt.toString()


        let idRemarks = this.otData.praxis.ideation.remarks.toString()
        let idKey = this.otData.praxis.ideation.key.toString()
        let idPrompt = this.otData.praxis.ideation.prompt.toString()

        let exRemarks = this.otData.praxis.execution.remarks.toString()
        let exKey = this.otData.praxis.execution.key.toString()
        let exPrompt = this.otData.praxis.execution.prompt.toString()

        let moRemarks = this.otData.praxis.motorPlanning.remarks.toString()
        let moKey = this.otData.praxis.motorPlanning.key.toString()
        let moPrompt = this.otData.praxis.motorPlanning.prompt.toString()


        let grRemarks = this.otData.grossMotor.remarks.toString()
        let grKey = this.otData.grossMotor.key.toString()
        let grPrompt = this.otData.grossMotor.prompt.toString()


        let stRemarks = this.otData.fineMotor.strength.remarks.toString()
        let stKey = this.otData.fineMotor.strength.key.toString()
        let stPrompt = this.otData.fineMotor.strength.prompt.toString()

        let griRemarks = this.otData.fineMotor.grip.remarks.toString()
        let griKey = this.otData.fineMotor.grip.key.toString()
        let griPrompt = this.otData.fineMotor.grip.prompt.toString()

        let iwRemarks = this.otData.fineMotor.isolationWrist.remarks.toString()
        let iwKey = this.otData.fineMotor.isolationWrist.key.toString()
        let iwPrompt = this.otData.fineMotor.isolationWrist.prompt.toString()

        let ifRemarks = this.otData.fineMotor.isolationFingers.remarks.toString()
        let ifKey = this.otData.fineMotor.isolationFingers.key.toString()
        let ifPrompt = this.otData.fineMotor.isolationFingers.prompt.toString()


        let artRemarks = this.otData.auditoryAndLanguage.articulation.remarks.toString()
        let artKey = this.otData.auditoryAndLanguage.articulation.key.toString()
        let artPrompt = this.otData.auditoryAndLanguage.articulation.prompt.toString()

        let foRemarks = this.otData.auditoryAndLanguage.followingInstructions.remarks.toString()
        let foKey = this.otData.auditoryAndLanguage.followingInstructions.key.toString()
        let foPrompt = this.otData.auditoryAndLanguage.followingInstructions.prompt.toString()


        let adlRemarks = this.otData.adl.remarks.toString()
        let adlKey = this.otData.adl.key.toString()
        let adlPrompt = this.otData.adl.prompt.toString()


        let emRemarks = this.otData.emotional.remarks.toString()
        let emKey = this.otData.emotional.key.toString()
        let emPrompt = this.otData.emotional.prompt.toString()



        this.otSessionForm.patchValue({
          sensoryModulation:{
            threshold:{
              remarks: thRemarks,
              key: thKey,
              prompt: thPrompt,
            },
            arousal:{
              remarks: arRemarks,
              key: arKey,
              prompt: arPrompt,
            }
          },

          proprioceptiveDiscrimination:{
            remarks: prRemarks,
            key: prKey,
            prompt: prPrompt,
          },

          vestibularDiscrimination:{
            remarks: veRemarks,
            key: veKey,
            prompt: vePrompt,
          },

          tactileDiscrimination:{
            toolManipulation:{
              remarks: toRemarks,
              key: toKey,
              prompt: toPrompt,
            },
            visionOccluded:{
              remarks: viRemarks,
              key: viKey,
              prompt: viPrompt,
            }
          },

          visual:{
            acuity:{
              remarks: acRemarks,
              key: acKey,
              prompt: acPrompt,
            },
            eyeStrain:{
              remarks: eyRemarks,
              key: eyKey,
              prompt: eyPrompt,
            },
            dissociation:{
              remarks: diRemarks,
              key: diKey,
              prompt: diPrompt,
            },
            generalEyeMovements:{
              remarks: geRemarks,
              key: geKey,
              prompt: gePrompt,
            },
            perceptual:{
              remarks: peRemarks,
              key: peKey,
              prompt: pePrompt,
            },
            quickLocalisation:{
              remarks: quRemarks,
              key: quKey,
              prompt: quPrompt,
            }
          },

          postural:{
            muscleTone:{
              remarks: muRemarks,
              key: muKey,
              prompt: muPrompt,
            },
            reflex:{
              remarks: reRemarks,
              key: reKey,
              prompt: rePrompt,
            },
            endurance:{
              remarks: enRemarks,
              key: enKey,
              prompt: enPrompt,
            },
            posturalControl:{
              remarks: poRemarks,
              key: poKey,
              prompt: poPrompt,
            },
            gait:{
              remarks: gaRemarks,
              key: gaKey,
              prompt: gaPrompt,
            }
          },

          bilateralIntegration:{
            midlineCrossing:{
              remarks: miRemarks,
              key: miKey,
              prompt: miPrompt,
            },
            symmetrical:{
              remarks: syRemarks,
              key: syKey,
              prompt: syPrompt,
            },
            asymmetrical:{
              remarks: asRemarks,
              key: asKey,
              prompt: asPrompt,
            },
            reciprocal:{
              remarks: recRemarks,
              key: recKey,
              prompt: recPrompt,
            }
          },

          praxis:{
            ideation:{
              remarks: idRemarks,
              key: idKey,
              prompt: idPrompt,
            },
            execution:{
              remarks: exRemarks,
              key: exKey,
              prompt: exPrompt,
            },
            motorPlanning:{
              remarks: moRemarks,
              key: moKey,
              prompt: moPrompt,
            }
          },

          grossMotor:{
            remarks: grRemarks,
            key: grKey,
            prompt: grPrompt,
          },

          fineMotor:{
            strength:{
              remarks: stRemarks,
              key: stKey,
              prompt: stPrompt,
            },
            grip:{
              remarks: griRemarks,
              key: griKey,
              prompt: griPrompt,
            },
            isolationWrist:{
              remarks: iwRemarks,
              key: iwKey,
              prompt: iwPrompt,
            },
            isolationFingers:{
              remarks: ifRemarks,
              key: ifKey,
              prompt: ifPrompt,
            }
          },

          auditoryAndLanguage:{
            articulation:{
              remarks: artRemarks,
              key: artKey,
              prompt: artPrompt,
            },
            followingInstructions:{
              remarks: foRemarks,
              key: foKey,
              prompt: foPrompt,
            }
          },

          adl:{
            remarks: adlRemarks,
            key: adlKey,
            prompt: adlPrompt,
          },

          emotional:{
            remarks: emRemarks,
            key: emKey,
            prompt: emPrompt,
          },
        })
      })
    }

    submitS: Subscription;
    editFunction(){
      let data ={
        //session_master_id: this.otSessionForm.get('session_master_id').value,
          sensoryModulation:{
            threshold:{
              remarks: this.otSessionForm.get('sensoryModulation.threshold.remarks').value,
              key: this.otSessionForm.get('sensoryModulation.threshold.key').value,
              prompt: this.otSessionForm.get('sensoryModulation.threshold.prompt').value
            },
            arousal:{
              remarks: this.otSessionForm.get('sensoryModulation.arousal.remarks').value,
              key: this.otSessionForm.get('sensoryModulation.arousal.key').value,
              prompt: this.otSessionForm.get('sensoryModulation.arousal.prompt').value
            }
          },


          proprioceptiveDiscrimination:{
            remarks: this.otSessionForm.get('proprioceptiveDiscrimination.remarks').value,
            key: this.otSessionForm.get('proprioceptiveDiscrimination.key').value,
            prompt: this.otSessionForm.get('proprioceptiveDiscrimination.prompt').value
          },


          vestibularDiscrimination:{
            remarks: this.otSessionForm.get('vestibularDiscrimination.remarks').value,
            key: this.otSessionForm.get('vestibularDiscrimination.key').value,
            prompt: this.otSessionForm.get('vestibularDiscrimination.prompt').value
          },


          tactileDiscrimination:{
            toolManipulation:{
              remarks: this.otSessionForm.get('tactileDiscrimination.toolManipulation.remarks').value,
              key: this.otSessionForm.get('tactileDiscrimination.toolManipulation.key').value,
              prompt: this.otSessionForm.get('tactileDiscrimination.toolManipulation.prompt').value
            },
            visionOccluded:{
              remarks: this.otSessionForm.get('tactileDiscrimination.visionOccluded.remarks').value,
              key: this.otSessionForm.get('tactileDiscrimination.visionOccluded.key').value,
              prompt: this.otSessionForm.get('tactileDiscrimination.visionOccluded.prompt').value
            }
          },


          visual:{
            acuity:{
              remarks: this.otSessionForm.get('visual.acuity.remarks').value,
              key: this.otSessionForm.get('visual.acuity.key').value,
              prompt: this.otSessionForm.get('visual.acuity.prompt').value
            },
            eyeStrain:{
              remarks: this.otSessionForm.get('visual.eyeStrain.remarks').value,
              key: this.otSessionForm.get('visual.eyeStrain.key').value,
              prompt: this.otSessionForm.get('visual.eyeStrain.prompt').value
            },
            quickLocalisation:{
              remarks: this.otSessionForm.get('visual.quickLocalisation.remarks').value,
              key: this.otSessionForm.get('visual.quickLocalisation.key').value,
              prompt: this.otSessionForm.get('visual.quickLocalisation.prompt').value
            },
            generalEyeMovements:{
              remarks: this.otSessionForm.get('visual.generalEyeMovements.remarks').value,
              key: this.otSessionForm.get('visual.generalEyeMovements.key').value,
              prompt: this.otSessionForm.get('visual.generalEyeMovements.prompt').value
            },
            dissociation:{
              remarks: this.otSessionForm.get('visual.dissociation.remarks').value,
              key: this.otSessionForm.get('visual.dissociation.key').value,
              prompt: this.otSessionForm.get('visual.dissociation.prompt').value
            },
            perceptual:{
              remarks: this.otSessionForm.get('visual.perceptual.remarks').value,
              key: this.otSessionForm.get('visual.perceptual.key').value,
              prompt: this.otSessionForm.get('visual.perceptual.prompt').value
            }
          },


          postural:{
            muscleTone:{
              remarks: this.otSessionForm.get('postural.muscleTone.remarks').value,
              key: this.otSessionForm.get('postural.muscleTone.key').value,
              prompt: this.otSessionForm.get('postural.muscleTone.prompt').value
            },
            reflex:{
              remarks: this.otSessionForm.get('postural.reflex.remarks').value,
              key: this.otSessionForm.get('postural.reflex.key').value,
              prompt: this.otSessionForm.get('postural.reflex.prompt').value
            },
            endurance:{
              remarks: this.otSessionForm.get('postural.endurance.remarks').value,
              key: this.otSessionForm.get('postural.endurance.key').value,
              prompt: this.otSessionForm.get('postural.endurance.prompt').value
            },
            posturalControl:{
              remarks: this.otSessionForm.get('postural.posturalControl.remarks').value,
              key: this.otSessionForm.get('postural.posturalControl.key').value,
              prompt: this.otSessionForm.get('postural.posturalControl.prompt').value
            },
            gait:{
              remarks: this.otSessionForm.get('postural.gait.remarks').value,
              key: this.otSessionForm.get('postural.gait.key').value,
              prompt: this.otSessionForm.get('postural.gait.prompt').value
            }
          },


          bilateralIntegration:{
            midlineCrossing:{
              remarks: this.otSessionForm.get('bilateralIntegration.midlineCrossing.remarks').value,
              key: this.otSessionForm.get('bilateralIntegration.midlineCrossing.key').value,
              prompt: this.otSessionForm.get('bilateralIntegration.midlineCrossing.prompt').value
            },
            symmetrical:{
              remarks: this.otSessionForm.get('bilateralIntegration.symmetrical.remarks').value,
              key: this.otSessionForm.get('bilateralIntegration.symmetrical.key').value,
              prompt: this.otSessionForm.get('bilateralIntegration.symmetrical.prompt').value
            },
            asymmetrical:{
              remarks: this.otSessionForm.get('bilateralIntegration.asymmetrical.remarks').value,
              key: this.otSessionForm.get('bilateralIntegration.asymmetrical.key').value,
              prompt: this.otSessionForm.get('bilateralIntegration.asymmetrical.prompt').value
            },
            reciprocal:{
              remarks: this.otSessionForm.get('bilateralIntegration.reciprocal.remarks').value,
              key: this.otSessionForm.get('bilateralIntegration.reciprocal.key').value,
              prompt: this.otSessionForm.get('bilateralIntegration.reciprocal.prompt').value
            }
          },


          praxis:{
            ideation:{
              remarks: this.otSessionForm.get('praxis.ideation.remarks').value,
              key: this.otSessionForm.get('praxis.ideation.key').value,
              prompt: this.otSessionForm.get('praxis.ideation.prompt').value
            },
            motorPlanning:{
              remarks: this.otSessionForm.get('praxis.motorPlanning.remarks').value,
              key: this.otSessionForm.get('praxis.motorPlanning.key').value,
              prompt: this.otSessionForm.get('praxis.motorPlanning.prompt').value
            },
            execution:{
              remarks: this.otSessionForm.get('praxis.execution.remarks').value,
              key: this.otSessionForm.get('praxis.execution.key').value,
              prompt: this.otSessionForm.get('praxis.execution.prompt').value
            }
          },


          grossMotor:{
            remarks: this.otSessionForm.get('grossMotor.remarks').value,
            key: this.otSessionForm.get('grossMotor.key').value,
            prompt: this.otSessionForm.get('grossMotor.prompt').value
          },


          fineMotor:{
            strength:{
              remarks: this.otSessionForm.get('fineMotor.strength.remarks').value,
              key: this.otSessionForm.get('fineMotor.strength.key').value,
              prompt: this.otSessionForm.get('fineMotor.strength.prompt').value
            },
            grip:{
              remarks: this.otSessionForm.get('fineMotor.grip.remarks').value,
              key: this.otSessionForm.get('fineMotor.grip.key').value,
              prompt: this.otSessionForm.get('fineMotor.grip.prompt').value
            },
            isolationWrist:{
              remarks: this.otSessionForm.get('fineMotor.isolationWrist.remarks').value,
              key: this.otSessionForm.get('fineMotor.isolationWrist.key').value,
              prompt: this.otSessionForm.get('fineMotor.isolationWrist.prompt').value
            },
            isolationFingers:{
              remarks: this.otSessionForm.get('fineMotor.isolationFingers.remarks').value,
              key: this.otSessionForm.get('fineMotor.isolationFingers.key').value,
              prompt: this.otSessionForm.get('fineMotor.isolationFingers.prompt').value
            }
          },


          auditoryAndLanguage:{
            articulation:{
              remarks: this.otSessionForm.get('auditoryAndLanguage.articulation.remarks').value,
              key: this.otSessionForm.get('auditoryAndLanguage.articulation.key').value,
              prompt: this.otSessionForm.get('auditoryAndLanguage.articulation.prompt').value
            },
            followingInstructions:{
              remarks: this.otSessionForm.get('auditoryAndLanguage.followingInstructions.remarks').value,
              key: this.otSessionForm.get('auditoryAndLanguage.followingInstructions.key').value,
              prompt: this.otSessionForm.get('auditoryAndLanguage.followingInstructions.prompt').value
            }
          },


          adl:{
            remarks: this.otSessionForm.get('adl.remarks').value,
            key: this.otSessionForm.get('adl.key').value,
            prompt: this.otSessionForm.get('adl.prompt').value
          },


          emotional:{
            remarks: this.otSessionForm.get('emotional.remarks').value,
            key: this.otSessionForm.get('emotional.key').value,
            prompt: this.otSessionForm.get('emotional.prompt').value
          }
      }
      this.submitS = this.therapistService.editOtSessionData(data, this.activatedRoute.snapshot.params['id']).subscribe((res)=>{
        history.back()
        this._snackBar.open(" Upated successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        console.log(error)
        alert(error)
      }))
    }

    clearControls(){
      this.otSessionForm.reset()
      this.otSessionForm.setErrors(null)
      Object.keys(this.otSessionForm.controls).forEach(key=>{this.otSessionForm.get(key).setErrors(null)})
    }
  }


