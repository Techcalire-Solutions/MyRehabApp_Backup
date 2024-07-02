import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ParentService } from '../../parent.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { ClientLogin } from '../../models/client-login';

@Component({
  selector: 'app-edit-login',
  templateUrl: './edit-login.component.html',
  styleUrls: ['./edit-login.component.scss']
})
export class EditLoginComponent implements OnInit {

  ngOnDestroy(){
    this.clientSub.unsubscribe();
    if(this.submitSub){
      this.submitSub.unsubscribe();
    }
  }

  constructor(private fb: FormBuilder, private parentService: ParentService, @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<EditLoginComponent>) { }

  loginForm = this.fb.group({
    password : ['']
  })

  ngOnInit(): void {
    this.getClientLogin()
  }

  clientSub: Subscription;
  client: ClientLogin
  getClientLogin(){
    this.clientSub = this.parentService.getClientLogin(this.data.id).subscribe(client=>{
      this.client = client
    })
  }

  submitSub: Subscription;
  onSubmit(){
    this.submitSub = this.parentService.updateClientLogin(this.data.id, this.data.clientId, this.loginForm.getRawValue()).subscribe(res=>{
      this.dialogRef.close()
    })
  }
}
