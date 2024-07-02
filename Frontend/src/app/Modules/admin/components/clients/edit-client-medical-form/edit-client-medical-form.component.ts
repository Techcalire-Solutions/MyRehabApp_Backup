import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-client-medical-form',
  templateUrl: './edit-client-medical-form.component.html',
  styleUrls: ['./edit-client-medical-form.component.scss']
})
export class EditClientMedicalFormComponent implements OnInit,OnDestroy {
  consumption: string;


  constructor(private fb : FormBuilder, private adminService : AdminService, private route : ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
    if(this.submit){
      this.submit.unsubscribe();
    }
  }

    medicalForm = this.fb.group({
      clientid : '',
      pregnancy: [''],
      typeOfDelivery: [''],
      alcohol: [false],
      smoking: [false],
      medications : [''],
      pregnancyComplications: [''],
      pregnancyType : [''],
      prematureMonths: [''],
      babyCry: [''],
      feedingProblem: [''],
      sleepProblem: [''],
      birthWeight: [''],
      birthCompilcation: [''],
      importantIllness : [''],
      medicalCondition : [''],
      consanguineousMarriageHistory : [''],
      history : [''],
      remarksVision : [''],
      eyeTest : [],
      useGlass : [],
      eyeProblem : [],
      hearingTest : [],
      remarksHearing : [''],
      hearingAid : [],
      earProblem : [],
      investigationConducted : [''],
      currentMedication : [''],
      previoustMedication : [''],
      allergies : [''],
      actualTherapies : [''],
      previousTherapies : [''],
      headRaise : [''],
      rollOver : [''],
      independentSitting : [''],
      crawled : [''],
      pulledToStand : [''],
      independentStanding :[''],
      walking : [''],
      spoon : [''],
      babbling : [''],
      saidFirstWords : [''],
      presentLanguage : [''],
      fingerFeeding:[''],
      dress:[''],
      cloudinary_id:'',
      file_url:'',
      habits: [''],
      consumption:['']
    });

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.editInfo();
  }

  id : any;
  client : any;
  editInfo(){
    this.infoSubscription = this.adminService.getClientInfo(this.route.snapshot.paramMap.get('id')).subscribe((client)=>{
      this.client = client

      let pregnancyEdit = this.client.medical.pregnancy
      let typeOfDeliveryEdit = this.client.medical.typeOfDelivery
      let alcoholEdit = this.client.medical.alcohol
      let smokingEdit = this.client.medical.smoking
      let medicationsEdit = this.client.medical.medications
      let pregnancyComplicationsEdit = this.client.medical.pregnancyComplications
      let pregnancyTypeEdit = this.client.medical.pregnancyType
      let prematureMonthsEdit = this.client.medical.prematureMonths
      let babyCryEdit = this.client.medical.babyCry
      let feedingProblemEdit = this.client.medical.feedingProblem
      let sleepProblemEdit = this.client.medical.sleepProblem
      let birthWeightEdit = this.client.medical.birthWeight
      let birthCompilcationEdit = this.client.medical.birthCompilcation
      let importantIllnessEdit = this.client.medical.importantIllness
      let medicalConditionEdit = this.client.medical.medicalCondition
      let consanguineousMarriageHistoryEdit = this.client.medical.consanguineousMarriageHistory
      let historyEdit = this.client.medical.history
      let remarksVisionEdit = this.client.medical.remarksVision
      let eyeTestEdit = this.client.medical.eyeTest
      let useGlassEdit = this.client.medical.useGlass
      let eyeProblemEdit = this.client.medical.eyeProblem
      let remarksHearingEdit = this.client.medical.remarksHearing
      let hearingTestEdit = this.client.medical.hearingTest
      let hearingAidEdit = this.client.medical.hearingAid
      let earProblemEdit = this.client.medical.earProblem
      let currentMedicationEdit = this.client.medical.currentMedication
      let previoustMedicationEdit = this.client.medical.previoustMedication
      let allergiesEdit = this.client.medical.allergies
      let actualTherapiesEdit = this.client.medical.actualTherapies
      let previousTherapiesEdit = this.client.medical.previousTherapies
      let headRaiseEdit = this.client.medical.headRaise
      let rollOverEdit = this.client.medical.rollOver
      let independentSittingEdit = this.client.medical.independentSitting
      let crawledEdit = this.client.medical.crawled
      let pulledToStandEdit = this.client.medical.pulledToStand
      let independentStandingEdit = this.client.medical.independentStanding
      let walkingEdit = this.client.medical.walking
      let dressEdit = this.client.medical.dress
      let spoonEdit = this.client.medical.spoon
      let saidFirstWordsEdit = this.client.medical.saidFirstWords
      let babblingEdit = this.client.medical.babbling
      let presentLanguageEdit = this.client.medical.presentLanguage
      let fingerFeedingEdit = this.client.medical.fingerFeeding
      // let pregnancyEdit = this.client.medical.pregnancy
      // let pregnancyEdit = this.client.medical.pregnancy
  

      if (smokingEdit || alcoholEdit) {
        this.consumption = "true";
      } else {
        this.consumption = '';
      }
      this.medicalForm.patchValue({
        pregnancy : pregnancyEdit,
        typeOfDelivery : typeOfDeliveryEdit,
        alcohol : alcoholEdit,
        smoking : smokingEdit,
        medications : medicationsEdit,
        pregnancyComplications : pregnancyComplicationsEdit,
        pregnancyType : pregnancyTypeEdit,
        prematureMonths : prematureMonthsEdit,
        babyCry : babyCryEdit,
        feedingProblem : feedingProblemEdit,
        sleepProblem : sleepProblemEdit,
        birthWeight : birthWeightEdit,
        birthCompilcation : birthCompilcationEdit,
        importantIllness :importantIllnessEdit,
        medicalCondition : medicalConditionEdit,
        consanguineousMarriageHistory : consanguineousMarriageHistoryEdit,
        history : historyEdit,
        remarksVision : remarksVisionEdit,
        eyeTest : eyeTestEdit,
        useGlass : useGlassEdit,
        eyeProblem : eyeProblemEdit,
        remarksHearing : remarksHearingEdit,
        hearingTest : hearingTestEdit,
        hearingAid : hearingAidEdit,
        earProblem : earProblemEdit,
        currentMedication : currentMedicationEdit,
        previoustMedication : previoustMedicationEdit,
        allergies : allergiesEdit,
        actualTherapies : actualTherapiesEdit,
        previousTherapies : previousTherapiesEdit,
        headRaise : headRaiseEdit,
        rollOver : rollOverEdit,
        independentSitting :independentSittingEdit,
        crawled : crawledEdit,
        pulledToStand : pulledToStandEdit,
        independentStanding :independentStandingEdit,
        walking :walkingEdit,
        saidFirstWords : saidFirstWordsEdit,
        spoon : spoonEdit,
        dress : dressEdit,
        babbling : babblingEdit,
        presentLanguage : presentLanguageEdit,
        fingerFeeding : fingerFeedingEdit,
        consumption: this.consumption
        // cloudinary_id :
        // file_url :
      })
    })
  }

  submit: Subscription;
  onSubmit(){
    if(this.medicalForm.get('consumption').value === 'false'){
      this.medicalForm.get('alcohol').setValue(false);
      this.medicalForm.get('smoking').setValue(false);
    }
    let data = {
      pregnancy : this.medicalForm.get('pregnancy').value,
      typeOfDelivery : this.medicalForm.get('typeOfDelivery').value,
      alcohol : this.medicalForm.get('alcohol').value,
      smoking : this.medicalForm.get('smoking').value,
      medications : this.medicalForm.get('medications').value,
      pregnancyComplications : this.medicalForm.get('pregnancyComplications').value,
      pregnancyType : this.medicalForm.get('pregnancyType').value,
      prematureMonths : this.medicalForm.get('prematureMonths').value,
      babyCry : this.medicalForm.get('babyCry').value,
      feedingProblem : this.medicalForm.get('feedingProblem').value,
      sleepProblem : this.medicalForm.get('sleepProblem').value,
      birthWeight : this.medicalForm.get('birthWeight').value,
      birthCompilcation : this.medicalForm.get('birthCompilcation').value,
      importantIllness : this.medicalForm.get('importantIllness').value,
      medicalCondition : this.medicalForm.get('medicalCondition').value,
      consanguineousMarriageHistory : this.medicalForm.get('consanguineousMarriageHistory').value,
      history : this.medicalForm.get('history').value,
      remarksVision : this.medicalForm.get('remarksVision').value,
      eyeTest : this.medicalForm.get('eyeTest').value,
      useGlass : this.medicalForm.get('useGlass').value,
      eyeProblem : this.medicalForm.get('eyeProblem').value,
      remarksHearing : this.medicalForm.get('remarksHearing').value,
      hearingTest : this.medicalForm.get('hearingTest').value,
      hearingAid : this.medicalForm.get('hearingAid').value,
      earProblem : this.medicalForm.get('earProblem').value,
      currentMedication : this.medicalForm.get('currentMedication').value,
      previoustMedication : this.medicalForm.get('previoustMedication').value,
      allergies : this.medicalForm.get('allergies').value,
      actualTherapies : this.medicalForm.get('actualTherapies').value,
      previousTherapies : this.medicalForm.get('previousTherapies').value,
      headRaise : this.medicalForm.get('headRaise').value,
      rollOver : this.medicalForm.get('rollOver').value,
      independentSitting : this.medicalForm.get('independentSitting').value,
      crawled : this.medicalForm.get('crawled').value,
      pulledToStand : this.medicalForm.get('pulledToStand').value,
      independentStanding : this.medicalForm.get('independentStanding').value,
      walking : this.medicalForm.get('walking').value,
      dress : this.medicalForm.get('dress').value,
      spoon : this.medicalForm.get('spoon').value,
      saidFirstWords : this.medicalForm.get('saidFirstWords').value,
      babbling : this.medicalForm.get('babbling').value,
      presentLanguage : this.medicalForm.get('presentLanguage').value,
      fingerFeeding : this.medicalForm.get('fingerFeeding').value,
      // pregnancy : this.medicalForm.get('pregnancy').value,
      // pregnancy : this.medicalForm.get('pregnancy').value,
      // pregnancy : this.medicalForm.get('pregnancy').value,
    }


    this.submit = this.adminService.editMedicalForm(data, this.route.snapshot.params['id']).subscribe((data)=>{
      history.back();
      this._snackBar.open("Updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          alert(error)
        }))
  }

  clearControls(){
    this.medicalForm.reset()
  }

}
