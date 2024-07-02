import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-client-school-form',
  templateUrl: './edit-client-school-form.component.html',
  styleUrls: ['./edit-client-school-form.component.scss']
})
export class EditClientSchoolFormComponent implements OnInit,OnDestroy {

  constructor(private fb : FormBuilder, private adminService : AdminService, private route : ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe()
    }
  }

  schoolForm = this.fb.group({
    clientid : '',
    schoolNameAndAddress:[''],
    grade:[''],
    teacherNameDetails:[''],
    previousSchool:[''],
    generalBehaviour:[''],
    teacherNoted:[''],
    getAlongWithOthers:[''],
    mainSupport:[''],
    screenTime:[''],
    playInterest:['']
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

      let schoolNameAndAddressEdit = this.client.school.schoolNameAndAddress.toString()
      let gradeEdit = this.client.school.grade.toString()
      let teacherNameDetailsEdit  = this.client.school.teacherNameDetails.toString()
      let previousSchoolEdit  = this.client.school.previousSchool.toString()
      let generalBehaviourEdit  = this.client.school.generalBehaviour.toString()
      let teacherNotedEdit  = this.client.school.teacherNoted.toString()
      let getAlongWithOthersEdit  = this.client.school.getAlongWithOthers.toString()
      let mainSupportEdit  = this.client.school.mainSupport.toString()
      let screenTimeEdit  = this.client.school.screenTime.toString()
      let playInterestEdit  = this.client.school.playInterest.toString()

      this.schoolForm.patchValue({
        schoolNameAndAddress : schoolNameAndAddressEdit,
        grade : gradeEdit,
        teacherNameDetails : teacherNameDetailsEdit,
        previousSchool : previousSchoolEdit,
        generalBehaviour : generalBehaviourEdit,
        teacherNoted : teacherNotedEdit,
        getAlongWithOthers : getAlongWithOthersEdit,
        mainSupport : mainSupportEdit,
        screenTime : screenTimeEdit,
        playInterest : playInterestEdit
      })
    })
  }

  submit: Subscription;
  onSubmit() {
    let data = {
      schoolNameAndAddress : this.schoolForm.get('schoolNameAndAddress').value,
      grade : this.schoolForm.get('grade').value,
      teacherNameDetails : this.schoolForm.get('teacherNameDetails').value,
      previousSchool : this.schoolForm.get('previousSchool').value,
      generalBehaviour : this.schoolForm.get('generalBehaviour').value,
      teacherNoted : this.schoolForm.get('teacherNoted').value,
      getAlongWithOthers : this.schoolForm.get('getAlongWithOthers').value,
      mainSupport : this.schoolForm.get('mainSupport').value,
      screenTime : this.schoolForm.get('screenTime').value,
      playInterest : this.schoolForm.get('playInterest').value,

    }
    this.submit = this.adminService.editSchoolForm(data, this.route.snapshot.params['id']).subscribe((data)=>{
      history.back();
      this._snackBar.open("Updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          alert(error)
        }))
  }

  clearControls(){
    this.schoolForm.reset()
  }
}
