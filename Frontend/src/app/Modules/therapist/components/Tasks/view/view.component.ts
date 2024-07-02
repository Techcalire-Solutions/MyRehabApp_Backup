import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tasks } from 'src/app/Modules/parent/models/task';
import { ParentService } from 'src/app/Modules/parent/parent.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  ngOnDestroy(){
    this.taskSub.unsubscribe();
  }

  constructor(private parentService: ParentService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getTask()
  }

  selectedIndex = 2;

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
      if(this.reviewedTasks.length === task.tasks.length){
        let data = {
          taskStatus: 'Completed'
        }
        this.parentService.updateStatus(data, this.route.snapshot.params['id']).subscribe(task => {
        })
      }
    })
  }


  reviewtask(id: string){
    this.router.navigateByUrl('/therapist/viewtask/opentask/reviewtask/'+ id +'/' +this.route.snapshot.params['id'])
  }

  editTask(id: string){
    this.router.navigateByUrl('/therapist/viewtask/opentask/reviewtask/'+ id +'/' +this.route.snapshot.params['id'])
  }

}
