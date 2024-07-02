import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Goal } from 'src/app/Modules/therapist/models/goal';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { ParentService } from '../../parent.service';

@Component({
  selector: 'app-view-goal',
  templateUrl: './view-goal.component.html',
  styleUrls: ['./view-goal.component.scss']
})
export class ViewGoalComponent implements OnInit {

  constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private parentService: ParentService) {
  }

  ngOnDestroy(): void {
    this.goalSub?.unsubscribe()
  }

  goalSub: Subscription;
  userId: string;
  ngOnInit(): void {
    let token = localStorage.getItem('token')
    this.userId = JSON.parse(token)?.id
    this.getClient()
  }

  clientId: string;
  clientSub: Subscription;
  goalSubscription: Subscription;
  getClient(){
    this.clientSub = this.parentService.getClientLogin(this.userId).subscribe(client=>{
      this.clientId = client.clientId._id;
      this.goalSubscription = this.loadGoal()
    })
  }

  goal: Goal[]
  loadGoal(){
    return this.therapistService.getGoalByClientId(this.clientId).subscribe((data)=>{
      this.goal = data
    })
  }

}
