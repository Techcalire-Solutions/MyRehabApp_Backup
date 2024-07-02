import { Task, Tasks } from './../../models/task';
import { Component, OnInit } from '@angular/core';
import { ParentService } from '../../parent.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent implements OnInit {

  ngOnDestroy(){
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
    if(this.taskSub){
      this.taskSub.unsubscribe();
    }
  }

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private router: Router,
    private adminService: AdminService, private parentService: ParentService) { }

  currentUser: any;
  ngOnInit(): void {
    let currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(currentUserString)
    if(this.currentUser){
      this.getClient()
    }
  }

  user: String;
  userId: String;
  clientSub: Subscription;
  getClient(){
    this.clientSub = this.parentService.getClientLogin(this.currentUser.id).subscribe((clientInfo) => {
      this.user = clientInfo.clientId.firstName
      this.userId = clientInfo.clientId._id
      this.getTask()
    })
  }

  tasks: Task[];
  data: Tasks[] = [];
  taskSub: Subscription;
  getTask(){
    this.taskSub = this.parentService.getTask().subscribe((task) => {

      this.tasks = task.filter(t => t.sessionMasterId.session_id.clientName._id === this.userId)
      for(let i = 0; i < this.tasks.length; i++){
        this.data = this.tasks[i].tasks
      }
    })
  }

  openAssignement(id: string){
    this.router.navigateByUrl('/parent/viewtask/openassignment/'+ id)
  }
}
