import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-client-routine-form',
  templateUrl: './edit-client-routine-form.component.html',
  styleUrls: ['./edit-client-routine-form.component.scss']
})
export class EditClientRoutineFormComponent implements OnInit, OnDestroy {

  constructor(private fb : FormBuilder, private adminService : AdminService, private route : ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe();
    }
  }

  routineForm = this.fb.group({
    clientid :'',
    feedAge:[''],
    feedAgeTest: [''],
    goodAppetitie:[''],

    goodAppetitieRadio:[''],
    messyEater:[''],
    messyEaterRadio:[''],
    foodPreference:[''],
    foodPreferenceRadio:[''],
    tasteAndTexture:[''],
    tasteAndTextureRadio:[''],
    ageAppropriate:[''],
    ageAppropriateRadio:[''],
    canDoUpButtons:[''],
    canDoUpButtonsRadio:[''],
    canPutOnSocks:[''],
    canPutOnSocksRadio:[''],
    canPutOnShoes:[''],
    canPutOnShoesRadio:[''],

    toiletTrained:[''],
    toiletRemarks:[''],
    dayAndNight:[''],
    toiletNight:[''],
    accidents:[''],
    toiletPaperUse:[''],
    managingClothing:[''],
    washingHands:[''],
    bathingAndBrushing:[''],
    typicalNightSleep:[''],
    timeOfSleep:[''],
    remarksSleep:[''],
    typicalWakeup:[''],
    timeOfWakeup:[''],
    remarksWakeUp:[''],
    homework:[''],
    remarksHomework:[''],
    routineStrategies:[''],
    difficultSituation:[''],
    remarksChildBehaviour :[''],
    howYouKnowAboutUs:[''],
    agreement:false
  });


  sleeps=[
    {name:'Continuous'},
    {name:'disturbed'},
    {name:'takes time to fall asleep'},
    {name:'needs rocking carrying stroking etc.'},
    //{name:'Time of Sleep'}
  ];

  wakeup=[
    {name:'Independent waking up'},
    {name:'Needs to be woken up'},
    //{name:'Time of Waking Up'}
  ];

  homework=[
    {name:'Adult supervision'},
    {name:'Breaks needed'},
    {name:'Frequency of breaks'},
    {name:'Needs music'},
    {name:'Continuous verbal prompts'},
    {name:'Any other reinforcers as external supports'}
  ];

  difficult=[
    {name:'Parents hugs or calm voice'},
    {name:'Carrying'},
    {name:'Rocking, music, calm down corner'},
    {name:'A favourite toy or pillow'},
    {name:'Movement breaks'}];

  selections =[
    {name:'Never'},
    {name:'Sometimes'},
    {name:'Usually'},
    {name:'Always'},
    {name:'Unsure'},
  ]


  infoSubscription: Subscription;
  ngOnInit(): void {
    this.editInfo();
  }

  id : any;
  client : any;
  editInfo(){
    this.infoSubscription = this.adminService.getClientInfo(this.route.snapshot.paramMap.get('id')).subscribe((client)=>{
      this.client = client
      let feedAgeEdit = this.client.routine.feedAge.toString()
      let goodAppetitieEdit = this.client.routine.goodAppetitie.toString()
      let messyEaterEdit = this.client.routine.messyEater.toString()
      let foodPreferenceEdit = this.client.routine.foodPreference.toString()
      let tasteAndTextureEdit = this.client.routine.tasteAndTexture.toString()
      let ageAppropriateEdit = this.client.routine.ageAppropriate
      let canDoUpButtonsEdit = this.client.routine.canDoUpButtons.toString()
      let canPutOnSocksEdit = this.client.routine.canPutOnSocks.toString()
      let canPutOnShoesEdit = this.client.routine.canPutOnShoes.toString()
      let toiletTrainedEdit = this.client.routine.toiletTrained.toString()
      let toiletRemarksEdit=this.client.routine.toiletRemarks.toString()
      let dayAndNightEdit = this.client.routine.dayAndNight.toString()
      let toiletNightEdit = this.client.routine.toiletNight.toString()
      // let toiletingAndBathEdit = this.client.routine.toiletingAndBath.toString()
      // let toiletiTrainedEdit = this.client.routine.toiletiTrained.toString()
      let accidentsEdit = this.client.routine.accidents.toString()
      let toiletPaperUseEdit = this.client.routine.toiletPaperUse.toString()
      let managingClothingEdit = this.client.routine.managingClothing.toString()
      let washingHandsEdit = this.client.routine.washingHands.toString()
      let bathingAndBrushingEdit = this.client.routine.bathingAndBrushing.toString()
      let typicalNightSleepEdit = this.client.routine.typicalNightSleep.toString()
      let timeOfSleepEdit = this.client.routine.timeOfSleep.toString()
      let remarksSleepEdit = this.client.routine.remarksSleep.toString()
      let typicalWakeupEdit = this.client.routine.typicalWakeup.toString()
      let timeOfWakeupEdit = this.client.routine.timeOfWakeup.toString()
      let remarksWakeUpEdit = this.client.routine.remarksWakeUp.toString()
      let homeworkEdit = this.client.routine.homework.toString()
      let remarksHomeworkEdit = this.client.routine.remarksHomework.toString()
      let routineStrategiesEdit = this.client.routine.routineStrategies.toString()
      let difficultSituationEdit = this.client.routine.difficultSituation.toString()
      let remarksChildBehaviourEdit = this.client.routine.remarksChildBehaviour.toString()
      //let movementBreaksEdit = this.client.routine.movementBreaks.toString()
      let howYouKnowAboutUsEdit = this.client.routine.howYouKnowAboutUs.toString()
      if(feedAgeEdit) {
        this.routineForm.get("feedAgeTest").setValue('false')
      }
      else
      {
        this.routineForm.get("feedAgeTest").setValue('true')
      }
      if(goodAppetitieEdit) {
        this.routineForm.get("goodAppetitieRadio").setValue('false')
      }
      else{
        this.routineForm.get("goodAppetitieRadio").setValue('true')
      }

      if(messyEaterEdit) {
        this.routineForm.get("messyEaterRadio").setValue('false')
      }
      else{
        this.routineForm.get("messyEaterRadio").setValue('true')
      }

      if(foodPreferenceEdit) {
        this.routineForm.get("foodPreferenceRadio").setValue('false')
      }
      else{
        this.routineForm.get("foodPreferenceRadio").setValue('true')
      }

      if(tasteAndTextureEdit) {
        this.routineForm.get("tasteAndTextureRadio").setValue('false')
      }
      else{
        this.routineForm.get("tasteAndTextureRadio").setValue('true')
      }

      if(ageAppropriateEdit) {
        this.routineForm.get("ageAppropriateRadio").setValue('false')
      }
      else{
        this.routineForm.get("ageAppropriateRadio").setValue('true')
      }

      if(canDoUpButtonsEdit) {
        this.routineForm.get("canDoUpButtonsRadio").setValue('false')
      }
      else{
        this.routineForm.get("canDoUpButtonsRadio").setValue('true')
      }

      if(canPutOnSocksEdit) {
        this.routineForm.get("canPutOnSocksRadio").setValue('false')
      }
      else{
        this.routineForm.get("canPutOnSocksRadio").setValue('true')
      }

      if(canPutOnShoesEdit) {
        this.routineForm.get("canPutOnShoesRadio").setValue('false')
      }
      else{
        this.routineForm.get("canPutOnShoesRadio").setValue('true')
      }

      this.routineForm.patchValue({
        feedAge : feedAgeEdit,
        goodAppetitie : goodAppetitieEdit,
        messyEater : messyEaterEdit,
        foodPreference : foodPreferenceEdit,
        tasteAndTexture : tasteAndTextureEdit,
        ageAppropriate : ageAppropriateEdit,
        canDoUpButtons : canDoUpButtonsEdit,
        canPutOnSocks : canPutOnSocksEdit,
        canPutOnShoes : canPutOnShoesEdit,
        toiletTrained : toiletTrainedEdit,
        toiletRemarks: toiletRemarksEdit,
        dayAndNight : dayAndNightEdit,
        toiletNight: toiletNightEdit,
        accidents : accidentsEdit,
        toiletPaperUse : toiletPaperUseEdit,
        managingClothing : managingClothingEdit,
        washingHands : washingHandsEdit,
        bathingAndBrushing : bathingAndBrushingEdit,
        typicalNightSleep : typicalNightSleepEdit,
        timeOfSleep : timeOfSleepEdit,
        remarksSleep : remarksSleepEdit,
        typicalWakeup : typicalWakeupEdit,
        timeOfWakeup : timeOfWakeupEdit,
        remarksWakeUp : remarksWakeUpEdit,
        homework : homeworkEdit,
        remarksHomework : remarksHomeworkEdit,
        routineStrategies : routineStrategiesEdit,
        difficultSituation : difficultSituationEdit,
        remarksChildBehaviour : remarksChildBehaviourEdit,
        //movementBreaks : movementBreaksEdit,
        howYouKnowAboutUs : howYouKnowAboutUsEdit,
      })
    })
  }

  submit: Subscription;
  onSubmit(){
    if(this.routineForm.get('feedAgeTest').value=='true')
{
  this.routineForm.get('feedAge').setValue('')  // feedage true, no rmearks
}
if(this.routineForm.get('goodAppetitieRadio').value=='true')
{
  this.routineForm.get('goodAppetitie').setValue('')
}

if(this.routineForm.get('messyEaterRadio').value=='true')
{
  this.routineForm.get('messyEater').setValue('')
}

if(this.routineForm.get('foodPreferenceRadio').value=='true')
{
  this.routineForm.get('foodPreference').setValue('')
}


if(this.routineForm.get('tasteAndTextureRadio').value=='true')
{
  this.routineForm.get('tasteAndTexture').setValue('')
}

if(this.routineForm.get('ageAppropriateRadio').value=='true')
{
  this.routineForm.get('ageAppropriate').setValue('')
}

if(this.routineForm.get('canDoUpButtonsRadio').value=='true')
{
  this.routineForm.get('canDoUpButtons').setValue('')
}

if(this.routineForm.get('canPutOnSocksRadio').value=='true')
{
  this.routineForm.get('canPutOnSocks').setValue('')
}

if(this.routineForm.get('canPutOnShoesRadio').value=='true')
{
  this.routineForm.get('canPutOnShoes').setValue('')
}


let data ={
      feedAge : this.routineForm.get('feedAge').value,
      goodAppetitie : this.routineForm.get('goodAppetitie').value,
      messyEater : this.routineForm.get('messyEater').value,
      foodPreference : this.routineForm.get('foodPreference').value,
      tasteAndTexture : this.routineForm.get('tasteAndTexture').value,
      ageAppropriate : this.routineForm.get('ageAppropriate').value,
      canDoUpButtons : this.routineForm.get('canDoUpButtons').value,
      canPutOnSocks : this.routineForm.get('canPutOnSocks').value,
      canPutOnShoes : this.routineForm.get('canPutOnShoes').value,
      toiletTrained : this.routineForm.get('toiletTrained').value,
      dayAndNight : this.routineForm.get('dayAndNight').value,
      toiletNight: this.routineForm.get('toiletNight').value,
      accidents : this.routineForm.get('accidents').value,
      toiletRemarks : this.routineForm.get('toiletRemarks').value,
      toiletPaperUse : this.routineForm.get('toiletPaperUse').value,
      managingClothing : this.routineForm.get('managingClothing').value,
      washingHands : this.routineForm.get('washingHands').value,
      bathingAndBrushing : this.routineForm.get('bathingAndBrushing').value,
      typicalNightSleep : this.routineForm.get('typicalNightSleep').value,
      timeOfSleep : this.routineForm.get('timeOfSleep').value,
      remarksSleep : this.routineForm.get('remarksSleep').value,
      typicalWakeup : this.routineForm.get('typicalWakeup').value,
      timeOfWakeup : this.routineForm.get('timeOfWakeup').value,
      remarksWakeUp : this.routineForm.get('remarksWakeUp').value,
      homework : this.routineForm.get('homework').value,
      remarksHomework : this.routineForm.get('remarksHomework').value,
      routineStrategies : this.routineForm.get('routineStrategies').value,
      difficultSituation : this.routineForm.get('difficultSituation').value,
      remarksChildBehaviour : this.routineForm.get('remarksChildBehaviour').value,
      //movementBreaks : this.routineForm.get('movementBreaks').value,
      howYouKnowAboutUs : this.routineForm.get('howYouKnowAboutUs').value

    }

    this.submit = this.adminService.editRoutineForm(data, this.route.snapshot.params['id']).subscribe((data)=>{
      history.back();
      this._snackBar.open("Updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          alert(error)
        }))
  }

  clearControls(){
    this.routineForm.reset()
  }

}
