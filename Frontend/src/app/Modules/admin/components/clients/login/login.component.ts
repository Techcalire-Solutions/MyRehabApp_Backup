import { Ideation } from './../../../../therapist/models/otSessionData';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../../admin.service';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data: any, private adminService: AdminService,
  private dialogRef: DialogRef, private _snackBar: MatSnackBar, private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.getClient()
  }

  client_ID: string;
  password: string;
  getClient(){
    this.adminService.getLoginByClientId(this.data.id).subscribe((res)=>{
    this.client_ID = res.client_ID
    this.password = res.password
 
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(){
      let data = {
        clientId: this.data.id,
        client_ID: this.client_ID,
        password: this.password
      }
      this.adminService.activateClientLogin(data).subscribe(res=>{
  
        this.dialogRef.close();
        this._snackBar.open("Login Ativated...","" ,{duration:3000})
      })
  }

  isCopied: boolean = false;

  copyUsernameToClipboard() {
    this.clipboard.copy(this.client_ID);
    this.isCopied = true;

    // Reset after a certain time
    setTimeout(() => {
      this.isCopied = false;
    }, 2000); // Reset after 2 seconds
  }

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


}
