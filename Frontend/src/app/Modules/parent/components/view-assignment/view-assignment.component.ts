import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tasks } from '../../models/task';
import { ParentService } from '../../parent.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-assignment',
  templateUrl: './view-assignment.component.html',
  styleUrls: ['./view-assignment.component.scss']
})
export class ViewAssignmentComponent implements OnInit {

  ngOnDestroy(){
    this.taskSub.unsubscribe();
  }

  constructor(private parentService: ParentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getTask()
  }

  task: Tasks;
  taskSub: Subscription;
  getTask(){
    this.taskSub = this.parentService.getTaskById(this.route.snapshot.params['taskId']).subscribe(task => {
      this.task = task.tasks.find(t => t._id === this.route.snapshot.params['id'])
    })
  }
}
