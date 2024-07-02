import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BtSessionData } from '../../../models/btSessionData';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { Activities, Activity } from '../../../models/activity';

@Component({
  selector: 'app-edit-bt-data',
  templateUrl: './edit-bt-data.component.html',
  styleUrls: ['./edit-bt-data.component.scss']
})
export class EditBtDataComponent implements OnInit, OnDestroy {

  constructor(private fb : FormBuilder, private route : ActivatedRoute, private therapistService : TherapistService, private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.btSubscription.unsubscribe();
    if(this.submitS){
      this.submitS.unsubscribe()
    }
  }

  btSessionForm = this.fb.group({
    sitting : [''],
    remarksSitting : [''],
    eyeContact : [''],
    remarksEyeContact : [''],
    attention : [''],
    remarksAttention : [''],
    mood : [''],
    remarksMood : [''],
    activities : [''],
    remarksActivities : [''],
    comprehensionInstructions : [''],
    remarksComprehensionInstructions : [''],
    responseInstructions : [''],
    remarksResponseInstructions :[''],
    waiting : [''],
    remarksWaiting : [''],
    compliance : [''],
    remarksCompliance : [''],
    behaviour : [''],
    remarksBehaviour : [''],
    communication : [''],
    remarksCommunication :[''],
    throwThings : [''],
    remarksThrowThings : [''],
    tearsThings : [''],
    remarksTearsThings : [''],
    angryProne : [''],
    remarksAngryProne : [''],
    selfInjurious : [''],
    remarksSelfInjurious : [''],
    repetitive : [''],
    remarksRepetitive : [''],
    tantrums : [''],
    remarksTantrums : [''],
    climbsFurniture : [''],
    remarksClimbsFurniture : [''],
    disruptiveBehaviour : [''],
    remarksDisruptiveBehaviour : ['']
  });

  btSubscription: Subscription;
  sessiomMasterId:any;
  activitys :any;
  ngOnInit(): void {
    this.editActivityData()
  
  
    this.btSubscription = this.editBtData()
    this.therapistService.getBtSessionDataId(this.route.snapshot.params['id']).subscribe((res)=>{
  
      this.Response = res;
      this.sessionMasterId = res.session_master_id
     
      this.therapistService.getActivityBySessionMasterId(this.sessionMasterId).subscribe((res)=>{
 
        this.activityId = res._id
      })
    })


  }

  keys =[
    {name:'Poor',value:'1'},
    {name:'Some Attempt',value:'2'},
    {name:'Emerging',value:'3'},
    {name:'Good',value:'4'},
    {name:'Excellent',value:'5'}
  ]

  grades =[
    {name:'Never',value:'1'},
    {name:'Rarely',value:'2'},
    {name:'Occasional',value:'3'},
    {name:'Sometimes',value:'4'},
    {name:'Always',value:'5'}
  ]

  bt: any;
  id: any
  btSessionId: '';
  btSessionData : BtSessionData[]=[];
  btData : BtSessionData;
  dataS: Subscription;


  editBtData(){
    return this.therapistService.getBtSessionDataId(this.route.snapshot.params['id']).subscribe((bt)=>{
      this.btData = bt
      this.btSessionData.push(bt)
      this.id = this.btData._id

    //Populate the object by the ID
      let sittingEdit = this.btData.sitting.toString();
      let remarksSittingEdit = this.btData.remarksSitting.toString();
      let eyeContactEdit = this.btData.eyeContact.toString();
      let remarksEyeContactEdit = this.btData.remarksEyeContact.toString();
      let attentionEdit = this.btData.attention.toString();
      let remarksAttentionEdit = this.btData.remarksAttention.toString();
      let moodEdit = this.btData.mood.toString();
      let remarksMoodEdit = this.btData.remarksMood.toString();
      let activitiesEdit = this.btData.activities.toString();
      let remarksActivitiesEdit = this.btData.remarksActivities.toString();
      let comprehensionInstructionsEdit = this.btData.comprehensionInstructions.toString();
      let remarksComprehensionInstructionsEdit = this.btData.remarksComprehensionInstructions.toString();
      let responseInstructionsEdit = this.btData.responseInstructions.toString();
      let remarksResponseInstructionsEdit = this.btData.remarksResponseInstructions.toString();
      let waitingEdit = this.btData.waiting.toString();
      let remarksWaitingEdit = this.btData.remarksWaiting.toString();
      let complianceEdit = this.btData.compliance.toString();
      let remarksComplianceEdit = this.btData.remarksCompliance.toString();
      let behaviourEdit = this.btData.behaviour.toString();
      let remarksBehaviourEdit = this.btData.remarksBehaviour.toString();
      let communicationEdit = this.btData.communication.toString();
      let remarksCommunicationEdit = this.btData.remarksCommunication.toString();

      let throwThingsEdit = this.btData.throwThings.toString();
      let remarksThrowThingsEdit = this.btData.remarksThrowThings.toString();
      let tearsThingsEdit = this.btData.tearsThings.toString();
      let remarksTearsThingsEdit = this.btData.remarksTearsThings.toString();
      let angryProneEdit = this.btData.angryProne.toString();
      let remarksAngryProneEdit = this.btData.remarksAngryProne.toString();
      let selfInjuriousEdit = this.btData.selfInjurious.toString();
      let remarksSelfInjuriousEdit = this.btData.remarksSelfInjurious.toString();
      let repetitiveEdit = this.btData.repetitive.toString();
      let remarksRepetitiveEdit = this.btData.remarksRepetitive.toString();
      let tantrumsEdit = this.btData.tantrums.toString();
      let remarksTantrumsEdit = this.btData.remarksTantrums.toString();
      let climbsFurnitureEdit = this.btData.climbsFurniture.toString();
      let remarksClimbsFurnitureEdit = this.btData.remarksClimbsFurniture.toString();
      let disruptiveBehaviourEdit = this.btData.disruptiveBehaviour.toString();
      let remarksDisruptiveBehaviourEdit = this.btData.remarksDisruptiveBehaviour.toString();


      this.btSessionForm.patchValue({
        sitting : sittingEdit,
        remarksSitting : remarksSittingEdit,
        eyeContact : eyeContactEdit,
        remarksEyeContact : remarksEyeContactEdit,
        attention : attentionEdit,
        remarksAttention : remarksAttentionEdit,
        mood : moodEdit,
        remarksMood : remarksMoodEdit,
        activities : activitiesEdit,
        remarksActivities : remarksActivitiesEdit,
        comprehensionInstructions : comprehensionInstructionsEdit,
        remarksComprehensionInstructions : remarksComprehensionInstructionsEdit,
        responseInstructions : responseInstructionsEdit,
        remarksResponseInstructions : remarksResponseInstructionsEdit,
        waiting : waitingEdit,
        remarksWaiting : remarksWaitingEdit,
        compliance : complianceEdit,
        remarksCompliance : remarksComplianceEdit,
        behaviour : behaviourEdit,
        remarksBehaviour : remarksBehaviourEdit,
        communication : communicationEdit,
        remarksCommunication : remarksCommunicationEdit,

        throwThings : throwThingsEdit,
        remarksThrowThings : remarksThrowThingsEdit,
        tearsThings : tearsThingsEdit,
        remarksTearsThings : remarksTearsThingsEdit,
        angryProne : angryProneEdit,
        remarksAngryProne : remarksAngryProneEdit,
        selfInjurious : selfInjuriousEdit,
        remarksSelfInjurious : remarksSelfInjuriousEdit,
        repetitive : repetitiveEdit,
        remarksRepetitive : remarksRepetitiveEdit,
        tantrums : tantrumsEdit,
        remarksTantrums : remarksTantrumsEdit,
        climbsFurniture : climbsFurnitureEdit,
        remarksClimbsFurniture : remarksClimbsFurnitureEdit,
        disruptiveBehaviour : disruptiveBehaviourEdit,
        remarksDisruptiveBehaviour : remarksDisruptiveBehaviourEdit
      })
  })}

  submitS: Subscription;
  onSubmit(){
    let data ={
      sitting : this.btSessionForm.get('sitting').value,
      remarksSitting : this.btSessionForm.get('remarksSitting').value,
      eyeContact : this.btSessionForm.get('eyeContact').value,
      remarksEyeContact : this.btSessionForm.get('remarksEyeContact').value,
      attention : this.btSessionForm.get('attention').value,
      remarksAttention : this.btSessionForm.get('remarksAttention').value,
      mood : this.btSessionForm.get('mood').value,
      remarksMood : this.btSessionForm.get('remarksMood').value,
      activities : this.btSessionForm.get('activities').value,
      remarksActivities : this.btSessionForm.get('remarksActivities').value,
      comprehensionInstructions : this.btSessionForm.get('comprehensionInstructions').value,
      remarksComprehensionInstructions : this.btSessionForm.get('remarksComprehensionInstructions').value,
      responseInstructions : this.btSessionForm.get('responseInstructions').value,
      remarksResponseInstructions : this.btSessionForm.get('remarksResponseInstructions').value,
      waiting : this.btSessionForm.get('waiting').value,
      remarksWaiting : this.btSessionForm.get('remarksWaiting').value,
      compliance : this.btSessionForm.get('compliance').value,
      remarksCompliance : this.btSessionForm.get('remarksCompliance').value,
      behaviour : this.btSessionForm.get('behaviour').value,
      remarksBehaviour : this.btSessionForm.get('remarksBehaviour').value,
      communication : this.btSessionForm.get('communication').value,
      remarksCommunication : this.btSessionForm.get('remarksCommunication').value,

      throwThings : this.btSessionForm.get('throwThings').value,
      remarksThrowThings : this.btSessionForm.get('remarksThrowThings').value,
      tearsThings : this.btSessionForm.get('tearsThings').value,
      remarksTearsThings : this.btSessionForm.get('remarksTearsThings').value,
      angryProne : this.btSessionForm.get('angryProne').value,
      remarksAngryProne : this.btSessionForm.get('remarksAngryProne').value,
      selfInjurious : this.btSessionForm.get('selfInjurious').value,
      remarksSelfInjurious : this.btSessionForm.get('remarksSelfInjurious').value,
      repetitive : this.btSessionForm.get('repetitive').value,
      remarksRepetitive : this.btSessionForm.get('remarksRepetitive').value,
      tantrums : this.btSessionForm.get('tantrums').value,
      remarksTantrums : this.btSessionForm.get('remarksTantrums').value,
      climbsFurniture : this.btSessionForm.get('climbsFurniture').value,
      remarksClimbsFurniture : this.btSessionForm.get('remarksClimbsFurniture').value,
      disruptiveBehaviour : this.btSessionForm.get('disruptiveBehaviour').value,
      remarksDisruptiveBehaviour : this.btSessionForm.get('remarksDisruptiveBehaviour').value
    }
    this.submitS = this.therapistService.editBtSessionData(data, this.route.snapshot.params['id']).subscribe((res)=>{
      // history.back()
      this._snackBar.open("Updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)

    }))
  }

  clearControls(){
    this.btSessionForm.reset()
    this.btSessionForm.setErrors(null)
    Object.keys(this.btSessionForm.controls).forEach(key=>{this.btSessionForm.get(key).setErrors(null)})
  }

  // --------activity--------------------
  

activityForm = this.fb.group({
  sessionMasterId: this.route.snapshot.params['id'],
  activityDetails: this.fb.array([]),
  activityStatus: [false]




});








activity()  {
  return this.activityForm.get("activityDetails") as FormArray
}

newActivity() {
  return this.fb.group({
    activity: [''],
    response:[''],
    status:[false]


  })
}



  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;






  isNextStepEnabled :boolean=false

  activities = [
    { value: '1', name: 'Puzzle activities' },
    { value: '2', name: 'Two puzzle activities' },
    { value: '3', name: 'Peg board activates' },
    { value: '4', name: 'Focusing on breathing' },
    { value: '5', name: 'Grounding technique' },
    { value: '6', name: 'Sorting' },
    { value: '7', name: 'Matching – Colour patterns, shapes, designs, and shadows image' },
    { value: '8', name: 'Spot the difference game' },
    { value: '9', name: 'Find the odd one' },
    { value: '10', name: 'Stacking Cups' },
    { value: '11', name: 'Building blocks' },
    { value: '12', name: 'Prewriting Skills – Drawing lines, Circles, triangles' },
    { value: '13', name: 'Tracing – (With one hand or both hands or with pencils)' },
    { value: '14', name: 'Lacing' },
    { value: '15', name: 'Scissor skills' },
    { value: '16', name: 'Copy the pattern' },
    { value: '17', name: 'Complete the figure' },
    { value: '18', name: 'Dot joining activates' },
    { value: '19', name: 'Rote counting' },
    { value: '20', name: 'String Beading' },
    { value: '21', name: 'Recreating patterns using blocks, beads, dominos' },
    { value: '22', name: 'Worksheets' }
  ];





  addActivity() {
    this.activity().push(this.newActivity());
  }

  removeActivity(i:number) {
    this.activity().removeAt(i);
  }
  // clientActivity: Activity[]=[]
  toggleStatus: boolean = false;
  activityId: string = '';


  




  cancel(){
    // this.router.navigateByUrl('/therapist')
  }







  activityToggle: boolean = false;

  onSingleActivityEvent(event: any, id: any): void {
    this.activityToggle = event.checked;

    if (this.activityToggle) {
      // Your logic when the activity is toggled
    }
  }
  //----------------------edit activity----------------------------------------------------------------

  




  Response : any;
  sessionMasterId:any

  editActivityData() {
    this.therapistService.getBtSessionDataId(this.route.snapshot.params['id']).subscribe((res) => {

      this.Response = res;
      this.sessionMasterId = res.session_master_id; // Accessing the sessionMasterId from the response
      this.therapistService.getActivitybyId(this.sessionMasterId).subscribe((activity: Activity) => {
  
        // Clear existing form array before patching
        const activityFormArray = this.activityForm.get('activityDetails') as FormArray;
        activityFormArray.clear();
    
        // Patch the form with activity data
        activity.activityDetails.forEach((act: any) => {
          this.addActivity(); // Add a new activity row
          const lastIndex = this.activity().length - 1;
          this.activity().at(lastIndex).patchValue({
            activity: act.activity,
            response: act.response,
            status: act.status
          });
        });
      });
    });
  }
  

  actv :any
  onActivitySubmit() {
   const data = {
     sessionMasterId: this.activityForm.get('sessionMasterId')?.value,
     activityDetails: this.activityForm.get('activityDetails')?.value,
     activityStatus: this.activityForm.get('activityStatus').value
   };
 
  
 this.therapistService.editActivity( this.activityId,data).subscribe(
     (res) => {
       history.back();
       this._snackBar.open("Activity Updated successfully...", "", { duration: 3000 });
       this.clearControls();
     },
     (error) => {

     }
   );
 }
 

 }









