import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditClientStatusComponent } from '../edit-client-status/edit-client-status.component';
import { ManageFeesComponent } from '../manage-fees/manage-fees.component';
import { ManageConcessionComponent } from '../manage-concession/manage-concession.component';
import { EditSlotStatusComponent } from '../edit-slot-status/edit-slot-status.component';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { AddUserComponent } from '../../user/add-user/add-user.component';
import { SessionHandoverComponent } from '../../sessions/session-handover/session-handover.component';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrls: ['./view-settings.component.scss']
})
export class ViewSettingsComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router) {}

  currentUser : any
  currentUserString : any
  ngOnInit(): void {
    this.currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(this.currentUserString)
  }
  manageUsers(){
    if(this.currentUser.md == true){
      const dialogRef = this.dialog.open(AddUserComponent, {
        width: '800px',
        height:"600px" ,
        data: {},
      });
    }
    else{
      alert("Access only for MD")
    }
  }
  manageCategory(){
    if(this.currentUser.md == true){
      const dialogRef = this.dialog.open(AddCategoryComponent, {
        width: '600px',
        data: {}
      });
    }
    else{
      alert("Access only for MD")
    }
  }
  manageClientStatus(){
    const dialogRef = this.dialog.open(EditClientStatusComponent, {
      width: '600px',
      data: {}
    });
  }

  manageFees(){
    if(this.currentUser.md == true){
      const dialogRef = this.dialog.open(ManageFeesComponent, {
        width: '600px',
        data: {}
      });
    }
    else{
      alert("Access only for MD")
    }
  }

  manageConcession(){
    if(this.currentUser.md == true){
      const dialogRef = this.dialog.open(ManageConcessionComponent, {
        width: '600px',
        data: {}
      });
    }
    else{
      alert("Access only for MD")
    }
  }
  manageHandover(){
    if(this.currentUser.md == true){
      const dialogRef = this.dialog.open(SessionHandoverComponent, {
        width: '600px',
        data: {}
      });
    }
    else{
      alert("Access only for MD")
    }
  }
  manageSlotStatus(){
    const dialogRef = this.dialog.open(EditSlotStatusComponent, {
      width: '600px',
      data: {}
    });
  }

  deleteClients(){
    this.router.navigateByUrl('/admin/settings/deleteclient')
  }
}


