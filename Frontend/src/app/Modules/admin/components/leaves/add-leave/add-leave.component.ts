import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../admin.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class AddLeaveComponent implements OnInit {
  ngOnDestroy(){
    this.submitS.unsubscribe();
    this.getTS.unsubscribe();
  }

  leaveForm = this.fb.group({
    date : [''],
    therapistName : [''],
    leaveRemarks : ['']
  })

  users : User[] = []

  constructor(private fb: FormBuilder,private _http:AdminService,private _snackBar: MatSnackBar,
    private datePipe: DatePipe) { }

  user : any;

  ngOnInit(): void {
    this.getTherapist();
  }

  submitS: Subscription;
  onSubmit(){
    const commonForm = {
      ...this.leaveForm.value,
    };
    commonForm.date = this.datePipe.transform(this.leaveForm.value.date, 'yyyy-MM-dd')
    this.submitS = this._http.addTherapistLeave(commonForm).subscribe((res)=>{
      this.user = res;
      this._snackBar.open("Session added successfully...","" ,{duration:3000})
      this.clearControls()
  })
  }

  clearControls(){
    this.leaveForm.reset()
  }

  getTS: Subscription;
  getTherapist(){
    this.getTS = this._http.getTherapist().subscribe((u)=>{
      this.users = u;
    })
  }
}
