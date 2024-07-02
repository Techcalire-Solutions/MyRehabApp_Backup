import { Subscription } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Client } from '../../../models/client';
import { AdminService } from '../../../admin.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-client-status',
  templateUrl: './edit-client-status.component.html',
  styleUrls: ['./edit-client-status.component.scss']
})
export class EditClientStatusComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private adminService: AdminService,
    public dialogRef: MatDialogRef<EditClientStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnDestroy(): void {
    this.clientSubscription.unsubscribe()
  }

  clientForm = this.fb.group({
    sessionType: ['', Validators.required],
    clientId: ['', Validators.required]
  })

  ngOnInit(): void {
    this.clientSubscription = this.getClient()
  }

  clients : Client []=[];
  assessmentClients : Client []=[];
  sessionClients : Client []=[];
  clientSubscription: Subscription
  getClient(){
    return this.adminService.getClients().subscribe((c)=>{
      this.clients = c

      this.assessmentClients = this.clients.filter(x => x.status === 'RS')
      this.filteredOptions = this.assessmentClients
      this.sessionClients = this.clients.filter(x => x.status === 'DS')
      this.filteredOptionsSessions = this.sessionClients
    })
  }

  filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.assessmentClients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
  }

  filteredOptionsSessions: Client[] = [];
  filterOptionsSessions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsSessions = this.sessionClients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  statusUpdate(){
    let clientData: any
    if(this.clientForm.getRawValue().sessionType === 'assessment'){
      clientData = {status : 'AS'}
    }
    else{
      clientData = {status : 'RS'}
    }

    this.updateClientStatus(clientData, this.clientForm.get('clientId').value)
  }

  updateClientStatus(data : any, id : String){
    this.adminService.updateClientStatus(data,id).subscribe((res)=>{
      this.dialogRef.close();
    })
  }

  clearControls(){
    this.clientForm.reset()
    this.getClient()
}

}
