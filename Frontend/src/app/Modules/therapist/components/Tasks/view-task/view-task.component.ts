import { Ideation } from '../../../models/otSessionData';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from 'src/app/Modules/auth/models/User';
import { Tasks } from 'src/app/Modules/parent/models/task';
import { ParentService } from 'src/app/Modules/parent/parent.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent implements OnInit {

  ngOnDestroy(){
    this.taskSub.unsubscribe();
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
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

  users: Client[] = [];
  clientSub: Subscription;
  getClient(){
    this.clientSub = this.adminService.getClients().subscribe((clientInfo) => {
      this.users = clientInfo.filter(user => user.status.toLowerCase() === 'rs');
      this.filteredOptions = this.users
    })
  }

  tasks: any[];
  data: Tasks[] = [];
  count: number = 0;
  taskSub: Subscription;
  getTask(){
    this.taskSub = this.parentService.getTask().subscribe((task) => {
      this.tasks = task.filter(t => t.sessionMasterId.session_id.therapistName._id === this.userId && t.taskStatus.toLowerCase() === 'assigned')
      this.filteredTasks = this.tasks
      for(let i = 0; i < this.tasks.length; i++){
        this.data = this.tasks[i].tasks
      }
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

  openAssignement(id: string){
    this.router.navigateByUrl('/therapist/viewtask/opentask/'+ id)
  }

  filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.users.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
  }
}

