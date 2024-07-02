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
import { Goal } from '../../../models/goal';

@Component({
  selector: 'app-manage-goal',
  templateUrl: './manage-goal.component.html',
  styleUrls: ['./manage-goal.component.scss']
})
export class ManageGoalComponent implements OnInit {

  ngOnDestroy(){
    this.clientS?.unsubscribe();
    this.goalSub?.unsubscribe();
  }

  seSessionForm = this.fb.group({
    session_master_id : this.activatedRoute.snapshot.params['id'],
    seDatas: this.fb.array([])
  });

  constructor(private fb: FormBuilder , private therapistService: TherapistService,private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private _http: AdminService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getClient();
    this.getGoal();
  }

  clients : Client []=[];
  clientsWL : Client []=[];
  clientS: Subscription;
  getClient(){
    this.clientS = this._http.getClients().subscribe((c)=>{
      this.clients = c.filter(x=>x.status == 'RS' || x.status == 'AS');
      this.filteredOptions = this.clients
    })
  }

  filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.clients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
  }

  goals: Goal[] = [];
  goalSub: Subscription;
  getGoal(){
    this.goalSub = this.therapistService.getGoal().subscribe((goal) =>{
      this.goals = goal
    })
  }


  clientId: string;
  getGoalByClient(id: string){
    this.clientId = id;
    this.therapistService.getGoalByClientId(id).subscribe(res=>{
      this.goals = res
    })
  }

  viewGoal(id: string){
    this.router.navigateByUrl('/therapist/goal/update/'+ id)
  }

  addGoal(){
    if(!this.clientId){
      return alert("Choose a client first")
    }
    this.router.navigateByUrl('/therapist/goal/add/'+this.clientId)
  }

  addNewGoal(id: string){
    this.router.navigateByUrl('/therapist/goal/addgoal/'+ id)
  }
}

