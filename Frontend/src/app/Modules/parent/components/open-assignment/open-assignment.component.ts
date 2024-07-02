import { Component, OnInit } from '@angular/core';
import { ParentService } from '../../parent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tasks } from '../../models/task';

@Component({
  selector: 'app-open-assignment',
  templateUrl: './open-assignment.component.html',
  styleUrls: ['./open-assignment.component.scss']
})
export class OpenAssignmentComponent implements OnInit {

  selectedIndex = 1;

  ngOnDestroy(){
    this.taskSub.unsubscribe();
  }

  constructor(private parentService: ParentService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getTask()
  }

  taskSub: Subscription;
  completedTasks: Tasks[] = [];
  openedTasks: Tasks[] = [];
  reviewedTasks: Tasks[] = [];
  tasks: Tasks[] = [];
  getTask(){
    this.taskSub = this.parentService.getTaskById(this.route.snapshot.params['id']).subscribe(task => {

      this.tasks = task.tasks.filter(t => t.status.toLowerCase() === 'pending');
    
      this.openedTasks = task.tasks.filter(t => t.status.toLowerCase() === "openend");
    
      this.completedTasks = task.tasks.filter(t => t.status.toLowerCase() === 'done');
    
      this.reviewedTasks = task.tasks.filter(t => t.status.toLowerCase() === 'reviewed');
    })
  }

  startAssignement(id: string){
    let data = {status: 'Openend'}
    this.parentService.updateTaskStatus(data, id, this.route.snapshot.params['id']).subscribe(task => {
    })
    this.router.navigateByUrl('/parent/viewtask/openassignment/startassignment/'+ id +'/' +this.route.snapshot.params['id'])
  }

  startOpenedAssignement(id: string){
    this.router.navigateByUrl('/parent/viewtask/openassignment/startassignment/'+ id +'/' +this.route.snapshot.params['id'])
  }

  viewAssignement(id: string){
    this.router.navigateByUrl('/parent/viewtask/openassignment/viewassignment/'+ id +'/' +this.route.snapshot.params['id'])
  }

  editTask(id: string){
    this.router.navigateByUrl('/parent/viewtask/openassignment/startassignment/'+ id +'/' +this.route.snapshot.params['id'])
  }

}
