import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { AdminService } from '../../../admin.service';
import { PendingFees } from '../../../models/pendingFee';
import { User } from '../../../models/user';
import { Lmc } from '../../../models/lmc';
import { Wallet } from '../../../models/wallet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pay-lmc-fees',
  templateUrl: './pay-lmc-fees.component.html',
  styleUrls: ['./pay-lmc-fees.component.scss']
})
export class PayLmcFeesComponent implements OnInit {

  constructor(private fb : FormBuilder, private route : ActivatedRoute, public authService:AuthService,
    private adminService : AdminService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnDestroy(): void {
    this.lmcSubscription.unsubscribe();
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
    if(this.updateS){
      this.updateS.unsubscribe();
    }
    if(this.pendFeeS){
      this.pendFeeS.unsubscribe();
    }
  }

  feeForm = this.fb.group({
    collectedAmount: [0, Validators.required],
    paymentMode: ['', Validators.required],
    remarks: [''],
    collectedTo: ['']
    // cloudinary_id:'',
    // file_url:''
  });

  lmcSubscription: Subscription;
  arrayId: string;
  ngOnInit(): void {
    this.arrayId = this.route.snapshot.params['arrayid'];
    this.lmcSubscription = this.getLmc()
    this.getUser()
  }

  lmc : Lmc
  getLmc(){
    return this.adminService.getLmcById(this.route.snapshot.params['id']).subscribe(res=>{
     this.lmc = res
     let slot = this.lmc.slots.find(x=> x._id === this.arrayId)
     if(slot.amountToInara === 0){
        this.feeForm.get('collectedTo').setValue('Therapist')
     }else {
      this.feeForm.get('collectedTo').setValue('Clinic')
     }
    
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

  feeToBeCollected : any
  findFee(sessionFee : any, concession : any){
    return this.feeToBeCollected = sessionFee - concession
  }

  fees: any;
  submitS: Subscription;
  walletS: Subscription;
  addWalletS: Subscription;
  addCash: Subscription;
  pendFeeS: Subscription;
  onSubmit(){
    let data = {
      lmcId: this.route.snapshot.params['id'],
      arrayId: this.arrayId,
      sessionType: this.lmc.sessionStatus,
      recievedBy: this.userId,
      collectedAmount: this.feeForm.get(['collectedAmount']).value,
      paymentMode: this.feeForm.get(['paymentMode']).value,
      remarks: this.feeForm.get(['remarks']).value,
      collectedTo: this.feeForm.get(['collectedTo']).value,
      amountToBeCollected: this.findFee(this.lmc.sessionFee, 0),
      dateAndTime: this.lmc.date
    }
    this.submitS = this.adminService.payFees(data).subscribe((res)=>{
      this.fees = res;
      history.back();
      // let statusData = {feeStatus : true}
      // this.updateFeeStatus(statusData,this.route.snapshot.params['id'])

      // CREATING WALLET AND ADDING BALANCE TO IT
      if(this.fees.collectedAmount > this.feeToBeCollected){
        let clientId = this.lmc.session_id.clientName._id

        this.walletS = this.adminService.getWalletByClient(clientId).subscribe((res)=>{
          let wallet = res

          let balance: any = this.fees.collectedAmount - this.feeToBeCollected

          let walletData = {
            amount : balance,
            paymentMode : this.fees.paymentMode
          }

          if(!wallet){
            let data = {
              clientId : clientId
            }
            this.addWalletS = this.adminService.addWallet(data).subscribe((res: Wallet)=>{
              const id = res._id
              const balanceA: any = res.balanceAmount

              this.addCash = this.adminService.addCashIn(id, walletData).subscribe((res)=>{})
            })
          }
          else{
            this.addCash = this.adminService.addCashIn(wallet._id, walletData).subscribe((res)=>{})
          }
          this.router.navigateByUrl('/admin/managewallet')
        })
      }
      //ENDS
      //CREATING PENDING FEE TABLE
      else if(this.fees.collectedAmount < this.feeToBeCollected){

        let data = {
          lmcId : this.route.snapshot.params['id'],
          pendingAmount : this.feeToBeCollected - this.fees.collectedAmount,
          type : 'LMC'
        }

        this.pendFeeS = this.adminService.addPendingFee(data).subscribe((res)=>{
          history.back();
        })
      }
      //ENDS

      this._snackBar.open("Fee added successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  updateS: Subscription;
  updateFeeStatus(data : any, id : String){
    this.updateS = this.adminService.updateLmcFeeStatus(data,id).subscribe((res)=>{})
  }

  clearControls(){
    this.feeForm.reset()
  }
}
