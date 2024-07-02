import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-client-list',
  templateUrl: './view-client-list.component.html',
  styleUrls: ['./view-client-list.component.scss']
})
export class ViewClientListComponent implements OnInit {

  displayedColumns: string[] = ['serialNumber','date', 'firstName','emergencyNumber', 'email', 'status','action'];

  constructor(private adminService:AdminService,private router:Router,private route:ActivatedRoute,
    private dialog: MatDialog) {
  }

  medical : any = [];
  school : any = [];
  routine : any = [];
  ngOnInit(): void {
    this.clientSub = this.getClient();
  }

  clients : any  = [];
  clientSub : Subscription;
  getClient(){
    return this.adminService.getClients().subscribe((clients)=>{
      this.clients = clients
      for (let i = 0; i < this.clients.length; i++){
        this.medical.push(this.clients[i].medical)
        this.school.push(this.clients[i].school)
        this.routine.push(this.clients[i].routine)
      }
    })
  }

  deleteClient(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this.adminService.deleteClients(id).subscribe((res)=>{
          this.getClient()
        })
      }
    })
  }
}


