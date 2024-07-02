import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { GroupMaster } from '../../../models/groupMaster';
import { Client } from 'src/app/Modules/admin/models/client';
import { User } from 'src/app/Modules/auth/models/User';
import { MatDialog } from '@angular/material/dialog';
import { AddMoreAttenteesComponent } from '../add-more-attentees/add-more-attentees.component';

@Component({
  selector: 'app-view-goup-master',
  templateUrl: './view-goup-master.component.html',
  styleUrls: ['./view-goup-master.component.scss']
})
export class ViewGoupMasterComponent implements OnInit {

  ngOnDestroy(){
    this.getSub.unsubscribe();
  }

  id: string
  constructor(private adminService: AdminService, private route: ActivatedRoute, private dialog: MatDialog) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getMasterById()
  }

  getSub: Subscription;
  sessionSub: Subscription;

  master: GroupMaster;
  clients: any[] = []
  therapsists: any[] = []
  sessionId: String
  getMasterById(){
    this.getSub = this.adminService.getGroupMasterById(this.id).subscribe(data => {
      this.master = data
      this.clients = data.clientName
      this.therapsists = data.therapistName
      this.sessionId = data.session_id._id
    })
  }


  addTherapists(){
    const dialogRef = this.dialog.open(AddMoreAttenteesComponent, {
      width: '500px',
      data: {
        id: this.sessionId,
        masterId: this.id,
        status: 'therapists'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMasterById()
    })
  }

  addClients(){
    const dialogRef = this.dialog.open(AddMoreAttenteesComponent, {
      width: '500px',
      data: {
        id: this.sessionId,
        masterId: this.id,
        status: 'clients'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMasterById()
    })
  }
}

