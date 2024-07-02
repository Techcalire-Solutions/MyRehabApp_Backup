import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { Tasks } from 'src/app/Modules/parent/models/task';
import { ParentService } from 'src/app/Modules/parent/parent.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit {

  ngOnDestroy(){
    this.taskSub.unsubscribe();
  }

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private router: Router,
    private adminService: AdminService, private parentService: ParentService) { }

  currentUser: any;
  userId: string;
  ngOnInit(): void {
    let currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(currentUserString)
    this.userId = this.currentUser.id
    this.getTask()
    this.getClient()
  }

  // user: String;
  // userId: String;
  // getClient(){
  //   this.parentService.getClientLogin(this.currentUser.id).subscribe((clientInfo) => {
  //     this.user = clientInfo.clientId.firstName
  //     this.userId = clientInfo.clientId._id
  //     this.getTask()
  //   })
  // }

  tasks: any[];
  data: Tasks[] = [];
  count: number = 0;
  taskSub: Subscription;
  getTask(){
    this.taskSub = this.parentService.getTask().subscribe((task) => {
      this.tasks = task.filter(t => t.sessionMasterId.session_id.therapistName._id === this.userId && t.taskStatus.toLowerCase() === 'completed')
      this.filteredTasks = this.tasks
      for(let i = 0; i < this.tasks.length; i++){
        this.data = this.tasks[i].tasks
      }
    })
  }

  openAssignement(id: string){
    this.router.navigateByUrl('/therapist/viewtask/opentask/'+ id)
  }

  users: Client[] = [];
  getClient(){
    this.adminService.getClients().subscribe((clientInfo) => {
      this.users = clientInfo.filter(user => user.status.toLowerCase() === 'rs');
    })
  }

  filteredTasks: any[] = [];
  getTaskByUser(id: string){
    if(id){
      this.filteredTasks = this.tasks.filter(t=>t.sessionMasterId.session_id.clientName._id === id)
    }else{
      this.getTask()
    }
  }
}

