import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { DeleteDialogueComponent } from 'src/app/Modules/admin/components/delete-dialogue/delete-dialogue.component';
import { SeGoal } from '../../../models/seGoal';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { data } from 'jquery';

@Component({
  selector: 'app-add-goal-se',
  templateUrl: './add-goal-se.component.html',
  styleUrls: ['./add-goal-se.component.scss']
})
export class AddGoalSeComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [ 'goal', 'expectPeriod', 'status', 'action',];

  hasUnitNumber = false;


  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, private therapistService: TherapistService,
    private activatedRoute: ActivatedRoute, private adminService: AdminService, public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AddGoalSeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnDestroy(): void {
    this.sessionInfoSubscription.unsubscribe();
    this.seGoalsSubscription.unsubscribe();
  }

  sessionid : any;
  sessionInfoSubscription: Subscription;
  seGoalsSubscription: Subscription;
  addStat: boolean = false;
  ngOnInit(): void {
    if(this.dialogData){
      this.addStat = true;
      this.sessionid = this.dialogData.sessionId;
      this.seGoalsSubscription = this.getSeGoals();
    this.sessionInfoSubscription = this.getSessionInfo();
    }else{
      this.sessionid = this.activatedRoute.snapshot.params['id'];
      this.seGoalsSubscription = this.getSeGoals();
      this.sessionInfoSubscription = this.getSessionInfo();
    }

  }

  seGoalForm = this.fb.group({
    goal: [''],
    expectPeriod: ['']
  });

  sessions : any;
  getSessionInfo(){
    return this.adminService.getSessionById(this.sessionid).subscribe((session)=>{
      this.sessions = session
    })
  }

  goal: any;
  onSubmit(){
    let data = {
      sessionId : this.sessionid,
      goal : this.seGoalForm.get('goal').value,
      expectPeriod : this.seGoalForm.get('expectPeriod').value
    }
    this.therapistService.addSeGoal(data).subscribe((res)=>{
      this.dialogRef?.close();
      this.goal = res;
      this._snackBar.open("Se Goal added successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  seGoals : SeGoal[] = [];
  getSeGoals(){
    return this.therapistService.getSeGoalBySessionId(this.sessionid).subscribe((goal)=>{
      this.seGoals = goal;
    })
  }

  seId : '';
  isEdit = false;
  editSeGoal(id){
    this.isEdit = true;
    //Get the product based on the ID
    let selectedGoal = this.seGoals.find(x =>x._id==id)
    //Populate the object by the ID
    let editGoal = selectedGoal.goal.toString();
    let editPeriod = selectedGoal.expectPeriod.toString();

    this.seGoalForm.patchValue({
      goal: editGoal,
      expectPeriod: editPeriod
    })
    this.seId = id;
  }

  editFunction(){
    let data = {
      goal : this.seGoalForm.get('goal').value,
      expectPeriod : this.seGoalForm.get('expectPeriod').value,
      seGoal:this.seGoalForm.get(['goal']).value + ': ' + this.seGoalForm.get(['expectPeriod']).value
    }
    this.therapistService.editSeGoal(data, this.seId).subscribe((res)=>{
    this._snackBar.open("Se Goal updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  deleteSeGoal(id: String){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this.therapistService.deleteSeGoal(id).subscribe((res)=>{
          this.getSeGoals()
          this._snackBar.open("Se Goal deleted successfully...","" ,{duration:3000})
        })
      }
    })
  }

  clearControls(){
    this.seGoalForm.get('goal').reset();
    this.seGoalForm.get('expectPeriod').reset();
    this.seGoalForm.setErrors(null)
    Object.keys(this.seGoalForm.controls).forEach(key=>{this.seGoalForm.get(key).setErrors(null)})
    this.getSeGoals()
  }

}

