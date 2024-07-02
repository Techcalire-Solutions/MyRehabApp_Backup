import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { CompensationSession } from 'src/app/Modules/admin/models/compensation';
import { LeaveSession } from 'src/app/Modules/admin/models/leaveSession';
import { Session } from 'src/app/Modules/admin/models/session';
import { Wallet } from 'src/app/Modules/admin/models/wallet';
import { User } from 'src/app/Modules/admin/models/user';
import { SeGoal } from '../../../models/seGoal';
import { SessionMaster } from '../../../models/sessionMaster';
import { TherapistService } from '../../../therapist.service';
import { AddGoalSeComponent } from '../../SessionForms/add-goal-se/add-goal-se.component';
import { Category } from 'src/app/Modules/admin/models/category';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit {

  goalForm = this.fb.group({
    clientId : this.activatedRoute.snapshot.params['id'],
    goals: this.fb.array([])
  });

  constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private _http: AdminService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getClient()
    this.getCategory()
    this.addGoal()
  }

  submitButtonState = false;
  async ngOnDestroy(){
    this.clientSub?.unsubscribe();
    this.catSub?.unsubscribe();
    this.submit?.unsubscribe();
  }

  seGoals : SeGoal[] = [];
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

  submit: Subscription;
  onSubmit() {
    this.submit = this.therapistService.addGoal(this.goalForm.getRawValue()).subscribe(res=>{
      history.back();
    })
  }
}

