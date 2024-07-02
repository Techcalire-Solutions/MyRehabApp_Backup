import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fees } from '../../../models/fees';
import { Wallet } from '../../../models/wallet';

@Component({
  selector: 'app-fee-payment',
  templateUrl: './fee-payment.component.html',
  styleUrls: ['./fee-payment.component.scss']
})
export class FeePaymentComponent implements OnInit, OnDestroy {

  constructor(private fb : FormBuilder, private therapistService : TherapistService, private route : ActivatedRoute,
    public authService:AuthService, private adminService : AdminService, private _snackBar: MatSnackBar,
    private router : Router) { }

  ngOnDestroy(): void {
    this.sessionMasterSubscription.unsubscribe();
    this.adminS.unsubscribe();
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.walletS){
      this.walletS.unsubscribe();
    }
    if(this.addCashInS){
      this.addCashInS.unsubscribe();
    }
    if(this.pendFee){
      this.pendFee.unsubscribe();
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
    this.sessionMasterSubscription = this.getSessionMasterById()
    this.getUser()
  }

  sessionMaster : any
  getSessionMasterById(){
    return this.therapistService.getSessionMasterbyId(this.route.snapshot.params['id']).subscribe((res)=>{
        this.sessionMaster = res
    }, err => {

    })
  }

  feeToBeCollected : any
  findFee(sessionFee : any, concession : any){
    return this.feeToBeCollected = sessionFee - concession
  }

  user : any
  admin : User[] = []
  currentAdmin : any
  userId : String
  adminS: Subscription;
  getUser(){
    let token = localStorage.getItem('token')
      this.user = JSON.parse(token)?.username

      this.adminS = this.adminService.getAdmin().subscribe((res)=>{
        this.admin = res

        this.currentAdmin = this.admin.find(x => x.name == this.user)

        if(this.currentAdmin){
          this.userId = this.currentAdmin._id
        }
      })
  }

  fees: any;
  submit: Subscription;
  walletS: Subscription;
  addWalletS: Subscription;
  addCashInS: Subscription;
  pendFee: Subscription;
  onSubmit(){
    let data = {
      sessionMasterId: this.route.snapshot.params['id'],
      sessionType: this.sessionMaster.sessionStatus,
      recievedBy: this.userId,
      collectedAmount: this.feeForm.get(['collectedAmount']).value,
      paymentMode: this.feeForm.get(['paymentMode']).value,
      remarks: this.feeForm.get(['remarks']).value,
      amountToBeCollected: this.findFee(this.sessionMaster.sessionFee, this.sessionMaster.concession),
      dateAndTime: this.sessionMaster.date
    }

    this.submit = this.adminService.payFees(data).subscribe((res)=>{
      this.fees = res;

      if(this.fees.collectedAmount == this.feeToBeCollected){
        // let data = {feeStatus : true}
        // this.updateFeeStatus(data,this.route.snapshot.params['id'])
        history.back()
      }
      // CREATING WALLET AND ADDING BALANCE TO IT
      else if(this.fees.collectedAmount > this.feeToBeCollected){
        let clientId = this.sessionMaster.session_id.clientName._id

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

              this.addCashInS = this.adminService.addCashIn(id, walletData).subscribe((res)=>{
                // let data = {feeStatus : true}
                // this.updateFeeStatus(data,this.route.snapshot.params['id'])

                this.router.navigateByUrl('/admin/addtowallet/' + id +'/' + clientId)
              })
            })
          }
          else{
            this.addCashInS = this.adminService.addCashIn(wallet._id, walletData).subscribe((res)=>{
              // let data = {feeStatus : true}
              // this.updateFeeStatus(data,this.route.snapshot.params['id'])

              this.router.navigateByUrl('/admin/addtowallet/' + wallet._id +'/' + clientId)
            })
          }
        })
      }
      //ENDS
      //CREATING PENDING FEE TABLE
      else if(this.fees.collectedAmount < this.feeToBeCollected){
        let data = {
          sessionMasterId : this.route.snapshot.params['id'],
          pendingAmount : this.feeToBeCollected - this.fees.collectedAmount,
          type : 'Session',
        }

        this.pendFee = this.adminService.addPendingFee(data).subscribe((res)=>{
          // let data = {feeStatus : true}
          // this.updateFeeStatus(data,this.route.snapshot.params['id'])
          history.back()
        })
      }
      //ENDS

      this._snackBar.open("Fee added successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  // updateS: Subscription;
  // updateFeeStatus(data : any, id : String){
  //   this.updateS = this.adminService.updateFeeStatus(data,id).subscribe((status)=>{})
  // }

  clearControls(){
    this.feeForm.reset()
  }

  printDiv(){
      this.router.navigateByUrl('/admin/printinvoice/'+ this.fees.id)
  }
}
