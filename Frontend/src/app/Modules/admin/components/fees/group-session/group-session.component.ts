import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, startWith, map, Observable, combineLatest } from 'rxjs';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { FeeMaster } from '../../../models/fee-master';
import { PendingFees } from '../../../models/pendingFee';
import { LmcDialogueComponent } from '../lmc-dialogue/lmc-dialogue.component';
import { PendingFeeDetailsDialogueComponent } from '../pending-fee-details-dialogue/pending-fee-details-dialogue.component';
import { ViewSessionMssterDialogueComponent } from '../view-session-msster-dialogue/view-session-msster-dialogue.component';
import { GrossMotor } from 'src/app/Modules/therapist/models/otSessionData';
import { GroupMaster } from 'src/app/Modules/therapist/models/groupMaster';
import { GroupFeeMaster } from '../../../models/groupFeeMaster';

@Component({
  selector: 'app-group-session',
  templateUrl: './group-session.component.html',
  styleUrls: ['./group-session.component.scss']
})
export class GroupSessionComponent implements OnInit {

  constructor(private therapistService : TherapistService, private router : Router, public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnDestroy(): void {
    this.sessionMasterSubscription.unsubscribe();
    this.feeMasterSubscription.unsubscribe();
  }

  displayedColumns: string[] = ['date', 'clientName','sessionFee','concession','manage'];

  displayedColumnsPayed: string[] = ['dateAndTime', 'paymentDate','clientName', 'recievedBy','paymentMode','manage'];

  sessionMasterSubscription: Subscription;
  feeMasterSubscription: Subscription;
  ngOnInit(): void {
    this.sessionMasterSubscription = this.getSessionMaster()
    this.feeMasterSubscription = this.getFeeMaster()

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

  client : Client[] = [];
  getClients(){
    this.adminService.getClients().subscribe((res)=>{
      this.client = res
    })
  }

  sMaster : GroupMaster[] = []
  pendingSessions : any[] = []
  clientFees: any[] = []
  getSessionMaster(){
    return this.adminService.getGroupMaster().subscribe((res)=>{
      this.sMaster = res

      for (const obj of this.sMaster) {
        this.clientFees = obj.clientName;
      }

      this.pendingSessions = this.clientFees.filter((x) => x.feeStatus == false)
      this.filtered = this.pendingSessions
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.pendingSessions.filter(element =>
      element.clientId.firstName.toLowerCase().includes(filterValue)
      || element.clientId.emergencyNumber.toString().includes(filterValue)
      // || element.session_id.therapistName.name.toLowerCase().includes(filterValue)
      // || element.session_id.slotName.slotName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getSessionMaster();
    }
  }

  clientPendingSessions: any;
  getFeesByClient(id: String){
    this.clientPendingSessions = this.pendingSessions.filter((x)=>x.clientId._id == id)
  }

  payedSessions : GroupFeeMaster[] = []
  getFeeMaster(){
    return this.adminService.getPayedGroupFees().subscribe((res)=>{
      this.payedSessions = res
    })
  }

  clientId : String
  pending : PendingFees[]
  payFee(id : String){
    return this.adminService.getGroupMaster().subscribe((res)=>{


    for (const obj of res) {
      let clients = obj.clientName.filter(x=>x._id === id);

    this.clientId = clients[0].clientId._id

    combineLatest(
      this.adminService.getPendingFee()
      .pipe(map((x: PendingFees[]) =>x.filter((y) =>
            y.type === 'LMC' &&
            y.lmcId.session_id.clientName._id === this.clientId)
        )
      ),
      this.adminService.getPendingFee()
      .pipe(map((x: PendingFees[]) => x.filter((y) =>
            y.type === 'Session'&&
            y.sessionMasterId.sessionStatus === 'LeaveSession' &&
            y.sessionMasterId.leave_session_id.clientName._id === this.clientId)
        )
      ),
      this.adminService.getPendingFee()
      .pipe(map((x: PendingFees[]) =>x.filter((y) =>
            y.type === 'Session'&&
            // y.sessionMasterId.sessionStatus === 'Session'&&
            y.sessionMasterId.session_id.clientName._id === this.clientId
          )
        )
      ),
      this.adminService.getPendingFee()
      .pipe(map((x: PendingFees[]) =>x.filter((y) =>
            y.type === 'GroupSession'&&
            // y.sessionMasterId.sessionStatus === 'Session'&&
            y.clientId._id === this.clientId
          )
        )
      )
    ).subscribe(([s, z, x, l]) => {
      const pending = [...s, ...z, ...x, ...l];

      if(pending.length != 0){
        const dialogRef = this.dialog.open(PendingFeeDetailsDialogueComponent, {
        width: '600px',
        data:  pending
        })
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.router.navigateByUrl('/admin/paygroupsessionfees/'+ id)
          }})
      }else{
        this.router.navigateByUrl('/admin/paygroupsessionfees/'+ id)
      }
    });
  }})
  }


  sessionMaster : GroupMaster
  getSMaster(id: string){
    this.adminService.getGroupMasterById(id).subscribe((res)=>{
      this.sessionMaster = res

      const dialogRef = this.dialog.open(ViewSessionMssterDialogueComponent, {
        width: '600px',
        data:  {sessionMaster: this.sessionMaster, status: 'group'}
      })
    })
  }

  openMedicalCertificate(id: String){
    const dialogRef = this.dialog.open(LmcDialogueComponent, {
      width: '600px',
      data : {id : id}
    })
  }
}


