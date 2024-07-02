import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tasks } from 'src/app/Modules/parent/models/task';
import { ParentService } from 'src/app/Modules/parent/parent.service';

@Component({
  selector: 'app-review-task',
  templateUrl: './review-task.component.html',
  styleUrls: ['./review-task.component.scss']
})
export class ReviewTaskComponent implements OnInit {

  ngOnDestroy(){
    if(this.taskSub){
      this.taskSub.unsubscribe();
    }
  }

  constructor(private fb: FormBuilder, private parentService: ParentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getTask()
  }

  taskForm = this.fb.group({
    remarks:  [''],
    point : ['', Validators.required]
  });

  task: Tasks;
  taskSub: Subscription;
  getTask(){
    this.taskSub = this.parentService.getTaskById(this.route.snapshot.params['taskid']).subscribe(task => {
      this.task = task.tasks.find(t => t._id === this.route.snapshot.params['id'])
      if(this.task.status.toLowerCase() === 'reviewed') {
        this.updateTask()
      }
    })
  }

  types = [
    {name: 1},
    {name: 2},
    {name: 3},
    {name: 4},
    {name: 5},
    {name: 6},
    {name: 7},
    {name: 8},
    {name: 9},
    {name: 10}
  ]

  uploadStatus = false;
  imageUrl: any;
  file: File;
  onFileSelected(event: any){
    if(event.target.files.length > 0){
      this.uploadStatus= true
      this.file = event.target.files[0]
      let fileType = this.file? this.file.type : '';

      if (this.file) {
        // You can read the selected file and display it as an image.
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      }

      if(fileType.match(/image\/*/)){
        let reader = new FileReader();
        // reader.readAsDataURL(this.file)
        reader.onload = (event: any) =>{
          this.imageUrl = event.target.result;
        }
      }
      else {
        window.alert('Please select correct image format');
      }
    }
  }


  onSubmit(){
      this.parentService.reviewTask(this.taskForm.getRawValue(), this.route.snapshot.params['id'], this.route.snapshot.params['taskid'] ).subscribe (res=>{
        history.back();
        this.clearControls()
      })
  }

  clearControls(){
    this.taskForm.reset()
  }

  editStatus = false;
  updateTask(){
    this.editStatus = true;
    let remarks = this.task.remarks;
    let point: any = this.task.point;

    this.taskForm.patchValue({
      remarks: remarks,
      point: point
    })
  }
}
