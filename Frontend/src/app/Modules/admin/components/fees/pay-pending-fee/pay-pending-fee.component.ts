import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { AdminService } from '../../../admin.service';
import { PendingFees } from '../../../models/pendingFee';

@Component({
  selector: 'app-pay-pending-fee',
  templateUrl: './pay-pending-fee.component.html',
  styleUrls: ['./pay-pending-fee.component.scss']
})
export class PayPendingFeeComponent implements OnInit {

  constructor(private fb : FormBuilder, private route : ActivatedRoute, public authService:AuthService,
    private adminService : AdminService) { }

  ngOnDestroy(): void {
    this.sessionMasterSubscription.unsubscribe();
    this.userS.unsubscribe();
    if(this.submitS){
      this.submitS.unsubscribe();
    }
    if(this.walletS){
      this.walletS.unsubscribe();
    }
    if(this.addWalletS){
      this.addWalletS.unsubscribe();
    }
    if(this.addCash){
      this.addCash.unsubscribe();
    }
    if(this.pendFeeS){
      this.pendFeeS.unsubscribe();
    }
  }

  feeForm = this.fb.group({
    collectedAmount: [0, Validators.required],
    paymentMode: ['', Validators.required],
    remarks: [''],
    outStanding: [],
    cloudinary_id:'',
    file_url:''
  });

  sessionMasterSubscription: Subscription;
  ngOnInit(): void {
    this.sessionMasterSubscription = this.getPendingFee()
    this.getUser()
  }

  pendingFee : PendingFees
  getPendingFee(){
     return this.adminService.getPendingFeeById(this.route.snapshot.params['id']).subscribe((res)=>{
        this.pendingFee = res
     })
  }

  user : any
  admin : User[] = []
  currentAdmin : any
  userId : String
  userS: Subscription;
  getUser(){
    let token = localStorage.getItem('token')
    this.user = JSON.parse(token)?.username

      this.userS = this.adminService.getAdmin().subscribe((res)=>{
        this.admin = res

        this.currentAdmin = this.admin.find(x => x.name == this.user)

        if(this.currentAdmin){
          this.userId = this.currentAdmin._id
        }
      })
  }

  fees: any;
  submitS: Subscription;
  walletS: Subscription;
  addWalletS: Subscription;
  addCash: Subscription;
  pendFeeS: Subscription;
  onSubmit(){
    if(this.feeForm.get(['collectedAmount']).value == this.pendingFee.pendingAmount){
      if(this.pendingFee.type == 'Session'){
        let data ={
          paymentDate : Date.now()
        }

        this.adminService.updatePaymentDate(this.pendingFee.sessionMasterId._id, data).subscribe(()=>{
        })

        this.adminService.deletePendingFees(this.route.snapshot.params['id']).subscribe(()=>{})
      }
      else if(this.pendingFee.type == 'Lmc'){
        let data ={
          paymentDate : Date.now()
        }

        this.adminService.updatePaymentDateLmc(this.pendingFee.lmcId._id, data).subscribe(()=>{
        })

        this.adminService.deletePendingFees(this.route.snapshot.params['id']).subscribe(()=>{})
      }
      else if(this.pendingFee.type == 'GroupSession'){
        let data ={
          paymentDate : Date.now()
        }
        this.adminService.updateGroupPaymentDate(this.pendingFee.groupMasterId._id, data).subscribe(()=>{
        })

        this.adminService.deletePendingFees(this.route.snapshot.params['id']).subscribe(()=>{})
      }
    }
    else if(this.feeForm.get(['collectedAmount']).value < this.pendingFee.pendingAmount){
      let data ={
        pendingAmount : this.pendingFee.pendingAmount - this.feeForm.get(['collectedAmount']).value
      }
      this.adminService.updatePendingFees(this.route.snapshot.params['id'], data).subscribe(()=>{
      })
    }

    this.clearControls()
  }

  // updateFeeStatus(data : any, id : String){
  //   this.adminService.updateFeeStatus(data,id).subscribe(()=>{
  //   })
  // }

  clearControls(){
    this.feeForm.reset()
  }
}
