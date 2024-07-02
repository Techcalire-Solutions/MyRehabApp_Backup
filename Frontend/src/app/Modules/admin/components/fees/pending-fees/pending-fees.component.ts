import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, startWith, map, Observable } from 'rxjs';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { FeeMaster } from '../../../models/fee-master';
import { LmcDialogueComponent } from '../lmc-dialogue/lmc-dialogue.component';
import { ViewSessionMssterDialogueComponent } from '../view-session-msster-dialogue/view-session-msster-dialogue.component';
import { PendingFees } from '../../../models/pendingFee';

@Component({
  selector: 'app-pending-fees',
  templateUrl: './pending-fees.component.html',
  styleUrls: ['./pending-fees.component.scss']
})
export class PendingFeesComponent implements OnInit {

  constructor(private therapistService : TherapistService, private router : Router, public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnDestroy(): void {
    this.pendingSubscription.unsubscribe();
  }

  displayedColumns: string[] = ['type','date','clientName','therapistName','pendingAmount','sessionStatus', 'manage'];

  pendingSubscription: Subscription;
  ngOnInit(): void {
    this.pendingSubscription = this.getPendingFee()

    this.getClients()

    this.filteredProduct$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.firstName;
        return name ? this._filter(name as string) : this.client.slice();
      }),
    );
  }

  //AUTO COMPLETE
  myControl = new FormControl<string | Client>('');
  filteredProduct$! : Observable<Client[]>;

  displayFn(product: Client) {
    return product && product.firstName ? product.firstName : '';
  }

  private _filter(name: string): Client[] {
    const filterValue = name.toLowerCase();

    return this.client.filter(option =>
      option.firstName.toLowerCase().includes(filterValue)
      // option.code.toLowerCase().includes(filterValue)||
      // option.barCode.toLowerCase().includes(filterValue)
    );
  }

  pendingFee : PendingFees[] = []
  getPendingFee(){
    return this.adminService.getPendingFee().subscribe((res)=>{
      this.pendingFee = res
      this.filtered = this.pendingFee
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.pendingFee.filter(element =>
      element.clientId.firstName.toLowerCase().includes(filterValue)
      || element.clientId.emergencyNumber.toString().includes(filterValue)
    )}

    else{
      this.getPendingFee();
    }
  }

  payFee(id: string){
    this.router.navigateByUrl('/admin/paypendingfees/'+ id)
  }

  client : Client[] = [];
  getClients(){
    this.adminService.getClients().subscribe((res)=>{
      this.client = res
      this.clientPendingFee = this.client
    })
  }

  clientPendingFee: any;
  getFeesByClient(id: String){
    this.clientPendingFee = this.pendingFee.filter((x)=>x.sessionMasterId.session_id.clientName._id == id)
  }
}


