import { StAssessmentForm } from '../../../models/stAssessmentForm';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-st-assessment-form',
  templateUrl: './edit-st-assessment-form.component.html',
  styleUrls: ['./edit-st-assessment-form.component.scss']
})
export class EditStAssessmentFormComponent implements OnInit, OnDestroy {

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

  ngOnDestroy(): void {
    this.stSubcription.unsubscribe();
    if(this.submitS){
      this.submitS.unsubscribe();
    }
  }

  stSubcription: Subscription
  ngOnInit(): void {
    this.stSubcription = this.editAssessment();
  }

  stData : StAssessmentForm;
  id : any;
  editAssessment(){
    return this.therapistService.getStAssessmentId(this.activatedRoute.snapshot.params['id']).subscribe((st)=>{
      this.stData = st
      this.id = this.stData._id


      let childStrength = this.stData.childStrength.toString()
      let parentConcern = this.stData.parentConcern.toString()
      let babbling = this.stData.babbling.toString()
      let babblingRemarks = this.stData.babblingRemarks.toString()
      let firstWord = this.stData.firstWord.toString()
      let firstWordRemarks = this.stData.firstWordRemarks.toString()
      let twoWord = this.stData.twoWord.toString()
      let twoWordRemarks = this.stData.twoWordRemarks.toString()
      let regression = this.stData.regression.toString()
      let regressionRemarks = this.stData.regressionRemarks.toString()
      let impressionSpeech = this.stData.impressionSpeech.toString()
      let neckControl = this.stData.neckControl.toString()
      let neckControlRemarks = this.stData.neckControlRemarks.toString()
      let sitting = this.stData.sitting.toString()
      let sittingRemarks = this.stData.sittingRemarks.toString()
      let walking = this.stData.walking.toString()
      let walkingRemarks = this.stData.walkingRemarks.toString()
      let impressionMotor = this.stData.impressionMotor.toString()
      let structureLip = this.stData.structureLip.toString()
      let FunctionLip = this.stData.FunctionLip.toString()
      let structureTounge = this.stData.structureTounge.toString()
      let functionTounge = this.stData.functionTounge.toString()
      let structureTeeth = this.stData.structureTeeth.toString()
      let functionTeeth = this.stData.functionTeeth.toString()
      let structureAlveolus = this.stData.structureAlveolus.toString()
      let functionAlveolus = this.stData.functionAlveolus.toString()
      let structurePalate = this.stData.structurePalate.toString()
      let functionPalate = this.stData.functionPalate.toString()
      let structureUvula = this.stData.structureUvula.toString()
      let functionUvula = this.stData.functionUvula.toString()
      let structureMandible = this.stData.structureMandible.toString()
      let functionMandible = this.stData.functionMandible.toString()
      let sucking = this.stData.sucking.toString()
      let swallowing = this.stData.swallowing.toString()
      let biting = this.stData.biting.toString()
      let chewing = this.stData.chewing.toString()
      let blowing = this.stData.blowing.toString()
      let drooling = this.stData.drooling.toString()
      let otherConsultation = this.stData.otherConsultation.toString()
      let eyeContact = this.stData.eyeContact.toString()
      let attentionConcentration = this.stData.attentionConcentration.toString()
      let sittingTolerance = this.stData.sittingTolerance.toString()
      let speechSkills = this.stData.speechSkills.toString()
      let fluencyProfile = this.stData.fluencyProfile.toString()
      let speechRate = this.stData.speechRate.toString()
      let effort = this.stData.effort.toString()
      let prosody = this.stData.prosody.toString()
      let speechRating = this.stData.speechRating.toString()
      let stimulability = this.stData.stimulability.toString()
      let phonologyProfile = this.stData.phonologyProfile.toString()
      let pitch = this.stData.pitch.toString()
      let loudness = this.stData.loudness.toString()
      let quality = this.stData.quality.toString()
      let resonance = this.stData.resonance.toString()
      let languageProfile = this.stData.languageProfile.toString()
      let comprehension = this.stData.comprehension.toString()
      let receptionMode = this.stData.receptionMode.toString()
      let expression = this.stData.expression.toString()
      let expressionMode = this.stData.expressionMode.toString()
      let parentChildIntraction = this.stData.parentChildIntraction.toString()
      let semanticRelation = this.stData.semanticRelation.toString()
      let attribution = this.stData.attribution.toString()
      let action = this.stData.action.toString()
      let locativeAction = this.stData.locativeAction.toString()
      let existence = this.stData.existence.toString()
      let nonExistence = this.stData.nonExistence.toString()
      let denial = this.stData.denial.toString()
      let rejection = this.stData.rejection.toString()
      let recurrence = this.stData.recurrence.toString()
      let possession = this.stData.possession.toString()
      let playSkills = this.stData.playSkills.toString()
      let greetingSkill = this.stData.greetingSkill.toString()
      let requesting = this.stData.requesting.toString()
      let turnSkill = this.stData.turnSkill.toString()
      let topicInitiation = this.stData.topicInitiation.toString()
      let topicMaintenance = this.stData.topicMaintenance.toString()
      let topicTermination = this.stData.topicTermination.toString()
      let socialSmile = this.stData.socialSmile.toString()
      let reciprocalSmile = this.stData.reciprocalSmile.toString()
      let jointAttention = this.stData.jointAttention.toString()
      let minglingPeers = this.stData.minglingPeers.toString()
      let temperTantrums = this.stData.temperTantrums.toString()
      let selfBehaviour = this.stData.selfBehaviour.toString()
      let hyperActivity = this.stData.hyperActivity.toString()
      let selfHelp = this.stData.selfHelp.toString()
      let toiletIndication = this.stData.toiletIndication.toString()
      let hungerIndication = this.stData.hungerIndication.toString()
      let bladderControl = this.stData.bladderControl.toString()
      let parentChildIntractionBehaviour = this.stData.parentChildIntractionBehaviour.toString()
      let matching = this.stData.matching.toString()
      let association = this.stData.association.toString()
      let sequencing = this.stData.sequencing.toString()
      let categorization = this.stData.categorization.toString()
      let logicalReasoning = this.stData.logicalReasoning.toString()
      let problemSolving = this.stData.problemSolving.toString()
      let memory = this.stData.memory.toString()
      let hearing = this.stData.hearing.toString()
      let vision = this.stData.vision.toString()
      let testAdminstered = this.stData.testAdminstered.toString()
      let impression = this.stData.impression.toString()
      let admissionAge = this.stData.admissionAge.toString()
      let academicBreakdown = this.stData.academicBreakdown.toString()
      let communicateParticipation = this.stData.communicateParticipation.toString()
      let provisionalDiagnosis = this.stData.provisionalDiagnosis.toString()
      let familyStrength = this.stData.familyStrength.toString()
      let familyBarriers = this.stData.familyBarriers.toString()
      let counselling = this.stData.counselling.toString()
      let goalsExplained = this.stData.goalsExplained.toString()
      let recommendation = this.stData.recommendation.toString()
      let overall = this.stData.overall.toString()

      this.stAssessmentForm.patchValue({
        childStrength: childStrength,
        parentConcern : parentConcern,
        babbling : babbling,
        babblingRemarks: babblingRemarks,
        firstWord : firstWord,
        firstWordRemarks: firstWordRemarks,
        twoWord : twoWord,
        twoWordRemarks: twoWordRemarks,
        regression : regression,
        regressionRemarks: regressionRemarks,
        impressionSpeech : impressionSpeech,
        neckControl : neckControl,
        neckControlRemarks: neckControlRemarks,
        sitting : sitting,
        sittingRemarks: sittingRemarks,
        walking : walking,
        walkingRemarks: walkingRemarks,
        impressionMotor : impressionMotor,
        structureLip: structureLip,
        FunctionLip : FunctionLip,
        structureTounge : structureTounge,
        functionTounge : functionTounge,
        structureTeeth : structureTeeth,
        functionTeeth : functionTeeth,
        structureAlveolus : structureAlveolus,
        functionAlveolus : functionAlveolus,
        structurePalate : structurePalate,
        functionPalate : functionPalate,
        structureUvula : structureUvula,
        functionUvula : functionUvula,
        structureMandible : structureMandible,
        functionMandible : functionMandible,
        sucking : sucking,
        swallowing : swallowing,
        biting : biting,
        chewing : chewing,
        blowing : blowing,
        drooling : drooling,
        otherConsultation : otherConsultation,
        eyeContact : eyeContact,
        attentionConcentration : attentionConcentration,
        sittingTolerance : sittingTolerance,
        speechSkills : speechSkills,
        fluencyProfile : fluencyProfile,
        speechRate : speechRate,
        effort : effort,
        prosody : prosody,
        speechRating : speechRating,
        stimulability : stimulability,
        phonologyProfile : phonologyProfile,
        pitch : pitch,
        loudness : loudness,
        quality : quality,
        resonance : resonance,
        languageProfile : languageProfile,
        comprehension : comprehension,
        receptionMode : receptionMode,
        expression : expression,
        expressionMode : expressionMode,
        parentChildIntraction : parentChildIntraction,
        semanticRelation: semanticRelation,
        attribution : attribution,
        action : action,
        locativeAction : locativeAction,
        existence : existence,
        nonExistence : nonExistence,
        denial : denial,
        rejection : rejection,
        recurrence : recurrence,
        possession : possession,
        playSkills : playSkills,
        greetingSkill : greetingSkill,
        requesting : requesting,
        turnSkill : turnSkill,
        topicInitiation : topicInitiation,
        topicMaintenance : topicMaintenance,
        topicTermination : topicTermination,
        socialSmile : socialSmile,
        reciprocalSmile : reciprocalSmile,
        jointAttention : jointAttention,
        minglingPeers : minglingPeers,
        temperTantrums : temperTantrums,
        selfBehaviour : selfBehaviour,
        hyperActivity : hyperActivity,
        selfHelp : selfHelp,
        toiletIndication : toiletIndication,
        hungerIndication : hungerIndication,
        bladderControl : bladderControl,
        parentChildIntractionBehaviour : parentChildIntractionBehaviour,
        matching : matching,
        association : association,
        sequencing : sequencing,
        categorization : categorization,
        logicalReasoning : logicalReasoning,
        problemSolving : problemSolving,
        memory : memory,
        hearing : hearing,
        vision : vision,
        testAdminstered : testAdminstered,
        impression : impression,
        admissionAge : admissionAge,
        academicBreakdown : academicBreakdown,
        communicateParticipation : communicateParticipation,
        provisionalDiagnosis : provisionalDiagnosis,
        familyStrength : familyStrength,
        familyBarriers : familyBarriers,
        counselling : counselling,
        goalsExplained : goalsExplained,
        recommendation : recommendation,
        overall : overall
      })
    })
  }

  st :any;
  submitS: Subscription;
  onSubmit(){
    let data = {
        childStrength: this.stAssessmentForm.get('childStrength').value,
        parentConcern : this.stAssessmentForm.get('parentConcern').value,
        babbling : this.stAssessmentForm.get('babbling').value,
        babblingRemarks : this.stAssessmentForm.get('babblingRemarks').value,
        firstWord : this.stAssessmentForm.get('firstWord').value,
        firstWordRemarks : this.stAssessmentForm.get('firstWordRemarks').value,
        twoWord : this.stAssessmentForm.get('twoWord').value,
        twoWordRemarks : this.stAssessmentForm.get('twoWordRemarks').value,
        regression : this.stAssessmentForm.get('regression').value,
        regressionRemarks : this.stAssessmentForm.get('regressionRemarks').value,
        impressionSpeech : this.stAssessmentForm.get('impressionSpeech').value,
        neckControl : this.stAssessmentForm.get('neckControl').value,
        neckControlRemarks: this.stAssessmentForm.get('neckControl').value,
        sitting : this.stAssessmentForm.get('sitting').value,
        sittingRemarks : this.stAssessmentForm.get('sittingRemarks').value,
        walking : this.stAssessmentForm.get('walking').value,
        walkingRemarks : this.stAssessmentForm.get('walkingRemarks').value,
        impressionMotor : this.stAssessmentForm.get('impressionMotor').value,
        structureLip: this.stAssessmentForm.get('structureLip').value,
        FunctionLip : this.stAssessmentForm.get('FunctionLip').value,
        structureTounge : this.stAssessmentForm.get('structureTounge').value,
        functionTounge : this.stAssessmentForm.get('functionTounge').value,
        structureTeeth : this.stAssessmentForm.get('structureTeeth').value,
        functionTeeth : this.stAssessmentForm.get('functionTeeth').value,
        structureAlveolus : this.stAssessmentForm.get('structureAlveolus').value,
        functionAlveolus : this.stAssessmentForm.get('functionAlveolus').value,
        structurePalate : this.stAssessmentForm.get('structurePalate').value,
        functionPalate : this.stAssessmentForm.get('functionPalate').value,
        structureUvula : this.stAssessmentForm.get('structureUvula').value,
        functionUvula : this.stAssessmentForm.get('functionUvula').value,
        structureMandible : this.stAssessmentForm.get('structureMandible').value,
        functionMandible : this.stAssessmentForm.get('functionMandible').value,
        sucking : this.stAssessmentForm.get('sucking').value,
        swallowing : this.stAssessmentForm.get('swallowing').value,
        biting : this.stAssessmentForm.get('biting').value,
        chewing : this.stAssessmentForm.get('chewing').value,
        blowing : this.stAssessmentForm.get('blowing').value,
        drooling : this.stAssessmentForm.get('drooling').value,
        otherConsultation : this.stAssessmentForm.get('otherConsultation').value,
        eyeContact : this.stAssessmentForm.get('eyeContact').value,
        attentionConcentration : this.stAssessmentForm.get('attentionConcentration').value,
        sittingTolerance : this.stAssessmentForm.get('sittingTolerance').value,
        speechSkills : this.stAssessmentForm.get('speechSkills').value,
        fluencyProfile : this.stAssessmentForm.get('fluencyProfile').value,
        speechRate : this.stAssessmentForm.get('speechRate').value,
        effort : this.stAssessmentForm.get('effort').value,
        prosody : this.stAssessmentForm.get('prosody').value,
        speechRating : this.stAssessmentForm.get('speechRating').value,
        stimulability : this.stAssessmentForm.get('stimulability').value,
        phonologyProfile : this.stAssessmentForm.get('phonologyProfile').value,
        pitch : this.stAssessmentForm.get('pitch').value,
        loudness : this.stAssessmentForm.get('loudness').value,
        quality : this.stAssessmentForm.get('quality').value,
        resonance : this.stAssessmentForm.get('resonance').value,
        languageProfile : this.stAssessmentForm.get('languageProfile').value,
        comprehension : this.stAssessmentForm.get('comprehension').value,
        receptionMode : this.stAssessmentForm.get('receptionMode').value,
        expression : this.stAssessmentForm.get('expression').value,
        expressionMode : this.stAssessmentForm.get('expressionMode').value,
        parentChildIntraction : this.stAssessmentForm.get('parentChildIntraction').value,
        semanticRelation: this.stAssessmentForm.get('semanticRelation').value,
        attribution : this.stAssessmentForm.get('attribution').value,
        action : this.stAssessmentForm.get('action').value,
        locativeAction : this.stAssessmentForm.get('locativeAction').value,
        existence : this.stAssessmentForm.get('existence').value,
        nonExistence : this.stAssessmentForm.get('nonExistence').value,
        denial : this.stAssessmentForm.get('denial').value,
        rejection : this.stAssessmentForm.get('rejection').value,
        recurrence : this.stAssessmentForm.get('recurrence').value,
        possession : this.stAssessmentForm.get('possession').value,
        playSkills : this.stAssessmentForm.get('playSkills').value,
        greetingSkill : this.stAssessmentForm.get('greetingSkill').value,
        requesting : this.stAssessmentForm.get('requesting').value,
        turnSkill : this.stAssessmentForm.get('turnSkill').value,
        topicInitiation : this.stAssessmentForm.get('topicInitiation').value,
        topicMaintenance : this.stAssessmentForm.get('topicMaintenance').value,
        topicTermination : this.stAssessmentForm.get('topicTermination').value,
        socialSmile : this.stAssessmentForm.get('socialSmile').value,
        reciprocalSmile : this.stAssessmentForm.get('reciprocalSmile').value,
        jointAttention : this.stAssessmentForm.get('jointAttention').value,
        minglingPeers : this.stAssessmentForm.get('minglingPeers').value,
        temperTantrums : this.stAssessmentForm.get('temperTantrums').value,
        selfBehaviour : this.stAssessmentForm.get('selfBehaviour').value,
        hyperActivity : this.stAssessmentForm.get('hyperActivity').value,
        selfHelp : this.stAssessmentForm.get('selfHelp').value,
        toiletIndication : this.stAssessmentForm.get('toiletIndication').value,
        hungerIndication : this.stAssessmentForm.get('hungerIndication').value,
        bladderControl : this.stAssessmentForm.get('bladderControl').value,
        parentChildIntractionBehaviour : this.stAssessmentForm.get('parentChildIntractionBehaviour').value,
        matching : this.stAssessmentForm.get('matching').value,
        association : this.stAssessmentForm.get('association').value,
        sequencing : this.stAssessmentForm.get('sequencing').value,
        categorization : this.stAssessmentForm.get('categorization').value,
        logicalReasoning : this.stAssessmentForm.get('logicalReasoning').value,
        problemSolving : this.stAssessmentForm.get('problemSolving').value,
        memory : this.stAssessmentForm.get('memory').value,
        hearing : this.stAssessmentForm.get('hearing').value,
        vision : this.stAssessmentForm.get('vision').value,
        testAdminstered : this.stAssessmentForm.get('testAdminstered').value,
        impression : this.stAssessmentForm.get('impression').value,
        admissionAge : this.stAssessmentForm.get('admissionAge').value,
        academicBreakdown : this.stAssessmentForm.get('academicBreakdown').value,
        communicateParticipation : this.stAssessmentForm.get('communicateParticipation').value,
        provisionalDiagnosis : this.stAssessmentForm.get('provisionalDiagnosis').value,
        familyStrength : this.stAssessmentForm.get('familyStrength').value,
        familyBarriers : this.stAssessmentForm.get('familyBarriers').value,
        counselling : this.stAssessmentForm.get('counselling').value,
        goalsExplained : this.stAssessmentForm.get('goalsExplained').value,
        recommendation : this.stAssessmentForm.get('recommendation').value,
        overall : this.stAssessmentForm.get('overall').value
    }
      this.submitS = this.therapistService.editStAssessmentForm(data, this.activatedRoute.snapshot.params['id']).subscribe((res)=>{
      this.st = res;
      history.back()
      this._snackBar.open("Updated successfully...","" ,{duration:3000})
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
