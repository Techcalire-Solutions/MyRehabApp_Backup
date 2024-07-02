import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { SeGoal } from '../../../models/seGoal';
import { SeDatas, SeSessionData } from '../../../models/seSessionData';
import { SessionMaster } from '../../../models/sessionMaster';
import { StSessionData } from '../../../models/stSessionData';
import { TherapistService } from '../../../therapist.service';

@Component({
  selector: 'app-edit-se-data',
  templateUrl: './edit-se-data.component.html',
  styleUrls: ['./edit-se-data.component.scss']
})
export class EditSeDataComponent implements OnInit, OnDestroy {
  seSessionForm = this.fb.group({
    goal : [{value : '', disabled: true}],
    activities: '',
    response: '',
    notes: '',
    status: false
  });


  constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private _http: AdminService) {
  }

  ngOnDestroy(): void {
    this.seSubscription.unsubscribe()
        if(this.submitS){
      this.submitS.unsubscribe()
    }
    if(this.seDataS){
      this.seDataS.unsubscribe()
    }
    if(this.goalS){
      this.goalS.unsubscribe()
    }
  }

  seSubscription: Subscription;
  ngOnInit(): void {
    //this.getSeGoal()
    this.seSubscription = this.loadSeData()

    this.seId = this.activatedRoute.snapshot.params['seId'];
    this.sessionId = this.activatedRoute.snapshot.params['sessionId'];
    this.arrayId = this.activatedRoute.snapshot.params['arrayId'];
  }

  seGoals : SeGoal[] = [];

  session: SeSessionData[] =[]
  selectedData : SeDatas;
  sessionId : String
  seId : String;
  arrayId : String;
  data : SeDatas;
  seData : any;
  loadSeData(){
    //GET SE SESSION DATA
    let arrayId = this.activatedRoute.snapshot.paramMap.get('arrayId');
    let seId = this.activatedRoute.snapshot.paramMap.get('seId');

    return this.therapistService.getSeData(seId, arrayId).subscribe((data)=>{
      this.seData = data['seDatas'].filter((x: any) => x._id == arrayId)

         //Populate the object by the ID
      let editGoal = this.seData[0].goal.goal.toString();
      let editAct = this.seData[0].activities.toString();
      let editRes = this.seData[0].response.toString();
      let editNotes = this.seData[0].notes.toString();
      let editStatus = this.seData[0].status;

      this.seSessionForm.patchValue({
      goal: editGoal,
      activities: editAct,
      response: editRes,
      notes: editNotes,
      status: editStatus
      })

    })
  }


  se: any;
  submitS: Subscription;
  seDataS: Subscription;
  editFunction(){
    let arrayId = this.activatedRoute.snapshot.paramMap.get('arrayId');
    let seId = this.activatedRoute.snapshot.paramMap.get('seId');


    let data = {
      goal : this.seSessionForm.get('goal').value,
      activities : this.seSessionForm.get('activities').value,
      response : this.seSessionForm.get('response').value,
      notes : this.seSessionForm.get('notes').value,
      status : this.seSessionForm.get('status').value,
    }

    this.seDataS = this.therapistService.getSeData(seId, arrayId).subscribe((data)=>{
      this.seData = data['seDatas'].filter(x => x._id == arrayId)
    })

    let dataStatus = {status : data.status}
    this.updateSeGoalStatus(dataStatus, this.seData[0].goal._id)

    this.submitS = this.therapistService.editSeSessionData(data, this.seId, this.arrayId).subscribe((res)=>{
    this.se = res
    history.back()
    this._snackBar.open("Updated successfully...","" ,{duration:3000})
      //this.clearControls()
    },(error=>{
    
      alert(error)
    }))
  }

  goalS: Subscription;
  updateSeGoalStatus(data,id){
    this.therapistService.updateSeGoalStatus(data,id).subscribe((status)=>{})
  }

  clearControls(){
    this.seSessionForm.reset();
    this.seSessionForm.setErrors(null)
    Object.keys(this.seSessionForm.controls).forEach(key=>{this.seSessionForm.get(key).setErrors(null)})
  }
}
