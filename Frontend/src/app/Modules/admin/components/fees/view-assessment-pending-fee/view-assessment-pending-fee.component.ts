import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { AssessmentFeeMaster } from '../../../models/assessment-fee-master';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { AssessmentMaster } from 'src/app/Modules/therapist/models/assessmentMaster';
import { FormControl } from '@angular/forms';
import { Client } from '../../../models/client';
import { ViewSessionMssterDialogueComponent } from '../view-session-msster-dialogue/view-session-msster-dialogue.component';
import { ViewAssessmentMasterDialogueComponent } from '../view-assessment-master-dialogue/view-assessment-master-dialogue.component';

@Component({
  selector: 'app-view-assessment-pending-fee',
  templateUrl: './view-assessment-pending-fee.component.html',
  styleUrls: ['./view-assessment-pending-fee.component.scss']
})
export class ViewAssessmentPendingFeeComponent implements OnInit, OnDestroy {

  constructor(private therapistService : TherapistService, private router : Router, public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnDestroy(): void {
    this.aFeeMasterSubscription.unsubscribe();
    this.aMasterSubscription.unsubscribe()
  }

  displayedColumnsAssessements:string[] = ['date', 'sessionStatus','clientName','therapistName','sessionFee','manage'];

  displayedColumnsPayed: string[] = ['dateAndTime', 'paymentDate', 'clientName', 'therapistName','collectedAmount','recievedBy','paymentMode','manage'];

  aFeeMasterSubscription: Subscription;
  aMasterSubscription: Subscription;
  ngOnInit(): void {
    this.aFeeMasterSubscription = this.getAssessmentFeeMaster()
    this.aMasterSubscription = this.getAssessmentMaster()

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

  aMaster : AssessmentMaster[] = []
  pendingAssessment : AssessmentMaster[] = []
  getAssessmentMaster(){
    return this.therapistService.getAssessmentMaster().subscribe((res)=>{
      this.aMaster = res

      this.pendingAssessment = this.aMaster.filter((x:AssessmentMaster) => x.feeStatus == false)
  
      this.filtered = this.pendingAssessment
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.pendingAssessment.filter(element =>
      element.assessment_id.clientName.firstName.toLowerCase().includes(filterValue)
      || element.assessment_id.clientName.emergencyNumber.toString().includes(filterValue)
      || element.assessment_id.therapistName.name.toLowerCase().includes(filterValue)
      || element.assessment_id.slotName.slotName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getAssessmentMaster();
    }
  }

  clientPendingAssessment: any;
  getAssessmentFeesByClient(id: String){
    this.clientPendingAssessment = this.pendingAssessment.filter((x)=>x.assessment_id.clientName._id == id)
  }


  payFee(id){
    this.router.navigateByUrl('/admin/payassessmentfees/'+ id)
  }

  payedAssessments : AssessmentFeeMaster[] = []
  getAssessmentFeeMaster(){
    return this.adminService.getPayedAssessmentFees().subscribe((res)=>{
      this.payedAssessments = res
    })
  }

  sessionMaster : AssessmentMaster
  getSMaster(id: String){
    this.therapistService.getAssessmentMasterbyId(id).subscribe((res)=>{
      this.sessionMaster = res

      const dialogRef = this.dialog.open(ViewAssessmentMasterDialogueComponent, {
        width: '600px',
        data:  this.sessionMaster
      })
    })
  }

}

