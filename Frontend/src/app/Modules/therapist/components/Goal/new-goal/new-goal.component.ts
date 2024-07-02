import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Goal } from '../../../models/goal';
import { SeGoal } from '../../../models/seGoal';
import { TherapistService } from '../../../therapist.service';
import { Category } from 'src/app/Modules/admin/models/category';
import { Client } from 'src/app/Modules/admin/models/client';

@Component({
  selector: 'app-new-goal',
  templateUrl: './new-goal.component.html',
  styleUrls: ['./new-goal.component.scss']
})
export class NewGoalComponent implements OnInit {

  constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private _http: AdminService) {
  }

  ngOnDestroy(): void {
    this.goalSub?.unsubscribe()
    this.catSub?.unsubscribe()
    this.submit?.unsubscribe()
  }

  goalSub: Subscription;
  ngOnInit(): void {
    this.goalSub = this.loadGoal()
    this.getCategory()
    this.addGoal()
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
  }

  submit: Subscription;
  onSubmit(){
  

    let id = this.activatedRoute.snapshot.params['id'];
    this.submit = this.therapistService.addNewGoal(this.goalForm.getRawValue(), id).subscribe((status)=>{
      this.loadGoal()
      this.goalData().clear();
      this.addGoal()
    })
  }

  goalForm = this.fb.group({
    goals: this.fb.array([])
  });

  goalData()  {
    return this.goalForm.get("goals") as FormArray
  }

  newGoal() {
    return this.fb.group({
      term:'',
      goal: '',
      category: '',
      goalRemarks: ''
    })
  }

  addGoal() {
    this.goalData().push(this.newGoal());
  }

  removeGoal(i:number) {
    this.goalData().removeAt(i);
  }

  client: Client;
  clientSub: Subscription;
  getClient(){
    this.clientSub = this._http.getClientInfo(this.activatedRoute.snapshot.params['id']).subscribe(res=>{
      this.client = res;
    })
  }

  categories : Category[] = [];
  catSub: Subscription;
  getCategory(){
    this.catSub = this._http.getCategory().subscribe((cat)=>{
      this.categories = cat ;
    })
  }
}
