import { Goal } from './../../../models/goal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { SeGoal } from '../../../models/seGoal';
import { SeSessionData, SeDatas } from '../../../models/seSessionData';
import { TherapistService } from '../../../therapist.service';

@Component({
  selector: 'app-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.scss']
})
export class UpdateGoalComponent implements OnInit {

  goalForm = this.fb.group({
    progressNote : [''],
    goalStatus : [false]
  });

  constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private _http: AdminService) {
  }

  ngOnDestroy(): void {
    this.goalSub?.unsubscribe()
    this.submit?.unsubscribe()
  }

  goalSub: Subscription;
  ngOnInit(): void {
    //this.getSeGoal()
    this.goalSub = this.loadGoal()
  }

  seGoals : SeGoal[] = [];

  goal: Goal
  loadGoal(){
    let id = this.activatedRoute.snapshot.params['id'];
    return this.therapistService.getGoalById(id).subscribe((data)=>{
      this.goal = data
    })
  }

  clearControls(){
    this.goalForm.reset();
    this.goalForm.setErrors(null)
    Object.keys(this.goalForm.controls).forEach(key=>{this.goalForm.get(key).setErrors(null)})
  }

  submit: Subscription;
  onSubmit(id: string, goalId: string){


    this.submit = this.therapistService.editGoalProgress(this.goalForm.getRawValue(), id, goalId).subscribe((status)=>{
      history.back();
      this.loadGoal()
      this.clearControls()
    })
  }
}
