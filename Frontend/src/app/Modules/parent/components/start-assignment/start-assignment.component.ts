import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ParentService } from '../../parent.service';
import { ActivatedRoute } from '@angular/router';
import { Tasks } from '../../models/task';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start-assignment',
  templateUrl: './start-assignment.component.html',
  styleUrls: ['./start-assignment.component.scss']
})
export class StartAssignmentComponent implements OnInit {

  ngOnDestroy(){
    if(this.taskSub){
      this.taskSub.unsubscribe();
    }
    if(this.uploadSub){
      this.uploadSub.unsubscribe();
    }
    if(this.submit){
      this.submit.unsubscribe();
    }
  }

  constructor(private fb: FormBuilder, private parentService: ParentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getTask()
  }

  taskForm = this.fb.group({
    response:  [''],
    cloudinary_id : [''],
    file_url : ['']
  });

  task: Tasks;
  taskSub: Subscription;
  getTask(){
    this.taskSub = this.parentService.getTaskById(this.route.snapshot.params['taskId']).subscribe(task => {
      this.task = task.tasks.find(t => t._id === this.route.snapshot.params['id'])
      if(this.task.status.toLowerCase() === 'done') {
        this.updateTask()
      }
    })
  }

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

  uploadSub: Subscription;
  onUpload(){
    this.uploadStatus = false
    this.uploadSub = this.parentService.uploadTask(this.file).subscribe(res=>{
      this.taskForm.patchValue({
        cloudinary_id : res.public_id,
        file_url : res.url
      })
    })
  }

  submit: Subscription;
  onSubmit(){
    this.submit = this.parentService.updateTask(this.taskForm.getRawValue(), this.route.snapshot.params['id'], this.route.snapshot.params['taskId'] ).subscribe (res=>{
      this.clearControls()
      history.back();
    })
  }

  clearControls(){
    this.taskForm.reset()
  }

  editStatus = false;
  updateTask(){
    this.editStatus = true;
    let response = this.task.response;
    this.imageUrl = this.task.file_url;

    this.taskForm.patchValue({
      response: response,
      file_url: this.imageUrl
    })
  }
}
