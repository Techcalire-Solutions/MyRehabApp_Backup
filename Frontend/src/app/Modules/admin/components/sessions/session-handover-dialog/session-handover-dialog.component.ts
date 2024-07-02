import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from 'src/app/Modules/admin/models/session';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { tap, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-handover-dialog',
  templateUrl: './session-handover-dialog.component.html',
  styleUrls: ['./session-handover-dialog.component.scss']
})
export class SessionHandoverDialogComponent implements OnInit, OnDestroy {

  constructor(public dialogRef: MatDialogRef<SessionHandoverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb : FormBuilder, private _http: AdminService, private _snackBar : MatSnackBar,
    private router : Router) { }

    ngOnDestroy() {
      this.router.navigateByUrl('admin/sessionhandover')

      this.therapistSubscription.unsubscribe();
      if(this.submit){
        this.submit.unsubscribe();
      }
    }

    sessionForm = this.fb.group({
      slotName: [''],
      clientName:[''],
      therapistName:['', Validators.required]
    });

  therapistSubscription: Subscription;
  ngOnInit(): void {
    this.therapistSubscription = this.getTherapistsByCat()
  }

  users: User[] =[];
  selectedTherapists: User[]= [];
  viewTherapyCategory = false;
  getTherapistsByCat(){
    let reqCategory =this.data.session.therapistName.therapyCategory.abbreviation

    return this._http.getTherapist().pipe(map(therapist => therapist.filter(x => x.therapyCategory.abbreviation == reqCategory && x._id != this.data.session.therapistName._id)))
    .subscribe((u)=>{this.users = u;})
  }

  submit: Subscription;
  onSubmit(){
    let data ={
      slotName: this.data.session.slotName._id,
      clientName: this.data.session.clientName._id,
      therapistName: this.sessionForm.get('therapistName').value,
    }
    this.submit = this._http.editSession(data, this.data.session._id).subscribe((res)=>{
      this._snackBar.open("Session updated successfully...","" ,{duration:3000})
      this.clearControls()
      this.dialogRef.close();
    },(error=>{
          alert(error)
        }))
  }

  clearControls(){
    this.sessionForm.reset()
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
