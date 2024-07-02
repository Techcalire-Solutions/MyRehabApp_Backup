import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BtAssessmentForm } from '../../../models/btAssessmentForm';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-bt-assessment-form',
  templateUrl: './edit-bt-assessment-form.component.html',
  styleUrls: ['./edit-bt-assessment-form.component.scss']
})
export class EditBtAssessmentFormComponent implements OnInit, OnDestroy {

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
    vsms: [],
    ddst: [],
    sfbt: [],
    gdt: [],
    bkt: [],
    mchat: [],
    vanderbelt: [],
    dpcl: [],
    nimhans: [],
    testFindings: [''],
    impression: [''],
    actionPlanforFuture: ['']
  });

  constructor(private fb: FormBuilder ,private therapistService:TherapistService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.btSubscription.unsubscribe();

    if(this.submitS){
      this.submitS.unsubscribe();
    }
  }

  btSubscription: Subscription;
  ngOnInit(): void {
    this.btSubscription = this.editAssessment();
  }

  btData : BtAssessmentForm;
  id : any;
  editAssessment(){
    return this.therapistService.getBtAssessmentId(this.activatedRoute.snapshot.params['id']).subscribe((st)=>{
      this.btData = st
      this.id = this.btData._id

      let kco = this.btData.kco.toString()
      let informants = this.btData.informants.toString()
      let presentingConcerns = this.btData.presentingConcerns.toString()
      let personalHistory = this.btData.personalHistory.toString()
      let gadgetExposure = this.btData.gadgetExposure.toString()
      let seizure = this.btData.seizure.toString()
      let drugUsage = this.btData.drugUsage.toString()
      let therapyHistory = this.btData.therapyHistory.toString()
      let familyHistory = this.btData.familyHistory.toString()
      let developmentalMilestones = this.btData.developmentalMilestones.toString()
      let occupationalHistory = this.btData.occupationalHistory.toString()
      let schoolHistory = this.btData.schoolHistory.toString()
      let behaviouralConcerns = this.btData.behaviouralConcerns.toString()
      let physicalAppearance = this.btData.physicalAppearance.toString()
      let activityLevel = this.btData.activityLevel.toString()
      let attentionConcentration = this.btData.attentionConcentration.toString()
      let emotionalRegulation = this.btData.emotionalRegulation.toString()
      let attachment = this.btData.attachment.toString()
      let vsms = this.btData.vsms
      let ddst = this.btData.ddst
      let sfbt = this.btData.sfbt
      let gdt = this.btData.gdt
      let bkt = this.btData.bkt
      let mchat = this.btData.mchat
      let vanderbelt = this.btData.vanderbelt
      let dpcl = this.btData.dpcl
      let nimhans = this.btData.nimhans
      let testFindings = this.btData.testFindings.toString()
      let impression = this.btData.impression.toString()
      let actionPlanforFuture = this.btData.actionPlanforFuture.toString()

      this.btAssessmentForm.patchValue({
        kco: kco,
        informants: informants,
        presentingConcerns: presentingConcerns,
        personalHistory: personalHistory,
        gadgetExposure:gadgetExposure,
        seizure: seizure,
        drugUsage: drugUsage,
        therapyHistory: therapyHistory,
        familyHistory: familyHistory,
        developmentalMilestones: developmentalMilestones,
        occupationalHistory: occupationalHistory,
        schoolHistory: schoolHistory,
        behaviouralConcerns: behaviouralConcerns,
        physicalAppearance: physicalAppearance,
        activityLevel: activityLevel,
        attentionConcentration: attentionConcentration,
        emotionalRegulation: emotionalRegulation,
        attachment: attachment,
        vsms: vsms,
        ddst: ddst,
        sfbt: sfbt,
        gdt: gdt,
        bkt: bkt,
        mchat: mchat,
        vanderbelt: vanderbelt,
        dpcl: dpcl,
        nimhans: nimhans,
        testFindings: testFindings,
        impression: impression,
        actionPlanforFuture: actionPlanforFuture
      })
    })
  }

  bt : any;
  submitS: Subscription;
  onSubmit(){
    let data = {
      kco: this.btAssessmentForm.get('kco').value,
      informants: this.btAssessmentForm.get('informants').value,
      presentingConcerns: this.btAssessmentForm.get('presentingConcerns').value,
      personalHistory: this.btAssessmentForm.get('personalHistory').value,
      gadgetExposure:this.btAssessmentForm.get('gadgetExposure').value,
      seizure: this.btAssessmentForm.get('seizure').value,
      drugUsage: this.btAssessmentForm.get('drugUsage').value,
      therapyHistory: this.btAssessmentForm.get('therapyHistory').value,
      familyHistory: this.btAssessmentForm.get('familyHistory').value,
      developmentalMilestones: this.btAssessmentForm.get('developmentalMilestones').value,
      occupationalHistory: this.btAssessmentForm.get('occupationalHistory').value,
      schoolHistory: this.btAssessmentForm.get('schoolHistory').value,
      behaviouralConcerns: this.btAssessmentForm.get('behaviouralConcerns').value,
      physicalAppearance: this.btAssessmentForm.get('physicalAppearance').value,
      activityLevel: this.btAssessmentForm.get('activityLevel').value,
      attentionConcentration: this.btAssessmentForm.get('attentionConcentration').value,
      emotionalRegulation: this.btAssessmentForm.get('emotionalRegulation').value,
      attachment: this.btAssessmentForm.get('attachment').value,
      vsms: this.btAssessmentForm.get('vsms').value,
      ddst: this.btAssessmentForm.get('ddst').value,
      sfbt: this.btAssessmentForm.get('sfbt').value,
      gdt: this.btAssessmentForm.get('gdt').value,
      bkt: this.btAssessmentForm.get('bkt').value,
      mchat: this.btAssessmentForm.get('mchat').value,
      vanderbelt: this.btAssessmentForm.get('vanderbelt').value,
      dpcl: this.btAssessmentForm.get('dpcl').value,
      nimhans: this.btAssessmentForm.get('nimhans').value,
      testFindings: this.btAssessmentForm.get('testFindings').value,
      impression: this.btAssessmentForm.get('impression').value,
      actionPlanforFuture: this.btAssessmentForm.get('actionPlanforFuture').value
    }
    this.submitS = this.therapistService.editBtAssessmentForm(data, this.activatedRoute.snapshot.params['id']).subscribe((res)=>{
      this.bt = res;
      history.back()
      this._snackBar.open("Updated successfully...","" ,{duration:3000})
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

