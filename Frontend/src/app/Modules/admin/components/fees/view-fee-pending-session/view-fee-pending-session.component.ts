
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { ViewSessionMssterDialogueComponent } from '../view-session-msster-dialogue/view-session-msster-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { FeeMaster } from '../../../models/fee-master';
import { Client } from '../../../models/client';
import { FormControl } from '@angular/forms';
import { LmcDialogueComponent } from '../lmc-dialogue/lmc-dialogue.component';
import { PendingFees } from '../../../models/pendingFee';
import { PendingFeeDetailsDialogueComponent } from '../pending-fee-details-dialogue/pending-fee-details-dialogue.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-fee-pending-session',
  templateUrl: './view-fee-pending-session.component.html',
  styleUrls: ['./view-fee-pending-session.component.scss']
})
export class ViewFeePendingSessionComponent implements OnInit, OnDestroy {

  constructor(private therapistService : TherapistService, private router : Router, public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnDestroy(): void {
    this.sessionMasterSubscription.unsubscribe();
    this.feeMasterSubscription.unsubscribe();
  }

  displayedColumns: string[] = ['date', 'clientName','therapistName','sessionStatus','sessionFee','concession','manage'];

  displayedColumnsPayed: string[] = ['dateAndTime', 'paymentDate','clientName', 'therapistName','recievedBy','paymentMode','collectedAmount','manage'];

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

  sMaster : SessionMaster[] = []
  pendingSessions : any[] = []
  getSessionMaster(){
    return this.therapistService.getSessionMaster().subscribe((res)=>{
      this.sMaster = res

      this.pendingSessions = this.sMaster.filter((x:SessionMaster) => x.feeStatus == false)
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
      element.session_id.clientName.firstName.toLowerCase().includes(filterValue)
      || element.session_id.clientName.emergencyNumber.toString().includes(filterValue)
      || element.session_id.therapistName.name.toLowerCase().includes(filterValue)
      || element.session_id.slotName.slotName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getSessionMaster();
    }
  }


  payedSessions : FeeMaster[] = []
  getFeeMaster(){
    return this.adminService.getPayedFees().subscribe((res)=>{
      this.payedSessions = res.filter(x=>(x.sessionType === 'Session'))
    })
  }

  clientId : String
  pending : PendingFees[]
  payFee(id : String){
  
    this.therapistService.getSessionMasterbyId(id).subscribe((res: SessionMaster)=>{
 

      if(res.sessionStatus == "LeaveSession"){
        this.clientId = res.leave_session_id.clientName._id

        combineLatest(
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
          )
        ).subscribe(([s, z]) => {
          this.pending = [...s, ...z];

            if(this.pending.length != 0){
              const dialogRef = this.dialog.open(PendingFeeDetailsDialogueComponent, {
              width: '600px',
              data:  this.pending
              })
              dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                  this.router.navigateByUrl('/admin/payfees/'+ id)
                }})
            }else{
              this.router.navigateByUrl('/admin/payfees/'+ id)
            }
          })
      }
      else{
        this.clientId = res.session_id.clientName._id

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
          this.pending = [...s, ...z, ...x, ...l];

          if(this.pending.length != 0){
            const dialogRef = this.dialog.open(PendingFeeDetailsDialogueComponent, {
            width: '600px',
            data:  this.pending
            })
            dialogRef.afterClosed().subscribe(result => {
              if (result === true) {
                this.router.navigateByUrl('/admin/payfees/'+ id)
              }})
          }else{
            this.router.navigateByUrl('/admin/payfees/'+ id)
          }
        });

      }
    })
  }

  client : Client[] = [];
  getClients(){
    this.adminService.getClients().subscribe((res)=>{
      this.client = res
    })
  }

  clientPendingSessions: any;
  getFeesByClient(id: String){
    this.clientPendingSessions = this.pendingSessions.filter((x)=>x.session_id.clientName._id == id)
  }

  sessionMaster : SessionMaster
  getSMaster(id: String){
    this.therapistService.getSessionMasterbyId(id).subscribe((res)=>{
      this.sessionMaster = res

      const dialogRef = this.dialog.open(ViewSessionMssterDialogueComponent, {
        width: '600px',
        data:  this.sessionMaster
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


