import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, startWith, map, Observable } from 'rxjs';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Lmc } from '../../../models/lmc';
import { FeeMaster } from '../../../models/fee-master';
import { ViewSessionMssterDialogueComponent } from '../view-session-msster-dialogue/view-session-msster-dialogue.component';
import { PendingFees } from '../../../models/pendingFee';
import { PendingFeeDetailsDialogueComponent } from '../pending-fee-details-dialogue/pending-fee-details-dialogue.component';
import { combineLatest } from 'rxjs';
import { LmcDialogueComponent } from '../lmc-dialogue/lmc-dialogue.component';

@Component({
  selector: 'app-view-lmc-fee',
  templateUrl: './view-lmc-fee.component.html',
  styleUrls: ['./view-lmc-fee.component.scss']
})
export class ViewLmcFeeComponent implements OnInit {

  constructor(private therapistService : TherapistService, private router : Router, public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnDestroy(): void {
    // this.lmcSubscription.unsubscribe();
    this.aMasterSubscription.unsubscribe()
  }

  displayedColumnsAssessements:string[] = ['date', 'sessionStatus','clientName','therapistName','sessionFee', 'ami','manage'];

  displayedColumnsPayed: string[] = ['dateAndTime', 'paymentDate','clientName', 'therapistName',
  // 'recievedBy','paymentMode','collectedAmount', 'collectedTo',
  'manage'];

  lmcSubscription: Subscription;
  aMasterSubscription: Subscription;
  payedSubscription: Subscription;
  ngOnInit(): void {
    // this.lmcSubscription = this.getLmc()
    this.aMasterSubscription = this.getLmc()
    this.payedSubscription = this.getFeeMaster()

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

   client : Client[] = [];
  getClients(){
    this.adminService.getClients().subscribe((res)=>{
      this.client = res
    })
  }

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

  lmc : Lmc[] = []
  pendingLmc : Lmc[] = []
  slots: any[] = []
  ami: boolean = false;
  getLmc(){
    return this.adminService.getLmc().subscribe((res)=>{
      this.lmc = res.filter(x=>x.slots.some(y=>y.feeStatus === false))

      for (let i = 0; i < this.lmc.length; i++) {
        for(let j = 0; j < this.lmc[i].slots.length; j++){
          if(this.lmc[i].slots[j].amountToInara === 0){
            this.ami = false;
          }else{
            this.ami = true;
          }
          let slot = {
            _id: this.lmc[i]._id,
            clientId : this.lmc[i].clientId,
            sessionFee : this.lmc[i].sessionFee,
            slotId : this.lmc[i].slots[j].slotId,
            therapistId : this.lmc[i].slots[j].therapistId,
            sessionStatus : this.lmc[i].sessionStatus,
            date : this.lmc[i].date,
            arrayId : this.lmc[i].slots[j]._id,
            ami : this.ami
          }
          this.slots.push(slot);
   
        }
      }

      // this.pendingLmc = this.lmc
      this.filtered = this.slots
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.slots.filter(element =>
      element.clientId.firstName.toLowerCase().includes(filterValue)
      || element.clientId.emergencyNumber.toString().includes(filterValue)
      || element.session_id.therapistName.name.toLowerCase().includes(filterValue)
      || element.session_id.slotName.slotName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getLmc();
    }
  }

  clientLmc: any;
  getLmcByClient(id: String){
    this.clientLmc = this.pendingLmc.filter((x)=>x.clientId._id == id)
  }

  clientId : String
  pending : PendingFees[]
  payFee(id : String, arrayid: String){
    const dialogRef = this.dialog.open(LmcDialogueComponent, {
      width: '600px',
      data : {id : id, arrayid: arrayid}
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){

        this.adminService.getLmcById(id).subscribe((res: Lmc)=>{
        this.clientId = res.session_id.clientName._id

        combineLatest(
          this.adminService.getPendingFee().pipe(
            map((x: PendingFees[]) =>
              x.filter((y) => y.type === 'LMC' &&
                              y.lmcId.session_id.clientName._id === this.clientId)
            )
          ),
          this.adminService.getPendingFee().pipe(
            map((x: PendingFees[]) =>
              x.filter((y) => y.type === 'Session'&&
                              y.sessionMasterId.sessionStatus === 'LeaveSession' &&
                              y.sessionMasterId.leave_session_id.clientName._id === this.clientId)
            )
          ),
          this.adminService.getPendingFee().pipe(
            map((x: PendingFees[]) =>
              x.filter((y) => y.type === 'Session'&&
                              y.sessionMasterId.sessionStatus === 'Session' &&
                              y.sessionMasterId.session_id.clientName._id === this.clientId)
            )
          )
        ).subscribe(([s, z]) => {
          const pending = [...s, ...z];

            if(pending.length != 0){
              const dialogRef = this.dialog.open(PendingFeeDetailsDialogueComponent, {
              width: '600px',
              data:  pending
              })
              dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
          
                  this.router.navigateByUrl(`/admin/paylmcfees/${id}/${arrayid}`);
                }})
            }else{
          
              this.router.navigateByUrl(`/admin/paylmcfees/${id}/${arrayid}/`);
            }
          });
        })
      }
    })
  }

  lmcId : Lmc
  getSMaster(id: string, lmcId: string){
  
    this.adminService.getLmcById(lmcId).subscribe((res)=>{

      this.lmcId = res

      const dialogRef = this.dialog.open(ViewSessionMssterDialogueComponent, {
        width: '600px',
        data:  {
          lmc : this.lmcId, arrayId: id
        }
      })
    })
  }

  payedSessions: any[] = [];
  lmcSlot: any[] = [];

  getFeeMaster() {
    return this.adminService.getPayedFees().subscribe((res) => {
      let payedSessions = res.filter((x) => x.sessionType == 'LMC');
  
      for (let i = 0; i < payedSessions.length; i++) {
        this.lmcSlot = payedSessions[i].lmcId.slots.filter(
          (x) => x._id === payedSessions[i].arrayId && x.feeStatus === true
        );
    
        for (let j = 0; j < this.lmcSlot.length; j++) {
          let data = {
            billDate: payedSessions[i].lmcId.date,
            paymentDate: payedSessions[i].paymentDate,
            clientName: payedSessions[i].lmcId.clientId.firstName,
            therapistName: this.lmcSlot[j].therapistId.name,
            receivedBy: payedSessions[i].recievedBy.name,
            collectedTo: payedSessions[i].collectedTo,
            _id: payedSessions[i].lmcId._id,
            lmcId: payedSessions[i]._id
          };
          this.payedSessions.push(data);
  
        }
      }
    });
  }

  onToggleChange(event: any, id: string, arrayId: string) {
    const newValue = event.checked;

    let data = {
      ami : newValue
    }
    this.adminService.editAmi( id, arrayId, data).subscribe(data=>{
  
    });
  }
}

