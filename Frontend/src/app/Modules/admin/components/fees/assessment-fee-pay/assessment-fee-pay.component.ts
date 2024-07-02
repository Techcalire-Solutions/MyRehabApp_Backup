import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { User } from '../../../models/user';
import { Wallet } from '../../../models/wallet';

@Component({
  selector: 'app-assessment-fee-pay',
  templateUrl: './assessment-fee-pay.component.html',
  styleUrls: ['./assessment-fee-pay.component.scss']
})
export class AssessmentFeePayComponent implements OnInit {

  constructor(private fb : FormBuilder, private therapistService : TherapistService, private route : ActivatedRoute,
    public authService:AuthService, private adminService : AdminService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnDestroy(): void {
    this.sessionMasterSubscription.unsubscribe();
    this.adminS.unsubscribe();
    // if(this.updateS){
    //   this.updateS.unsubscribe();
    // }
    if(this.submitS){
      this.submitS.unsubscribe();
    }
    if(this.walletS){
      this.walletS.unsubscribe();
    }
    if(this.addWalletS){
      this.addWalletS.unsubscribe();
    }
    if(this.addCashIn){
      this.addCashIn.unsubscribe();
    }
    // if(this.updateS){
    //   this.updateS.unsubscribe();
    // }
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
    this.sessionMasterSubscription = this.getAssessmentMasterById()
    this.getUser()
  }

  assessmentMaster : any
  getAssessmentMasterById(){
     return this.therapistService.getAssessmentMasterbyId(this.route.snapshot.params['id']).subscribe((res)=>{
        this.assessmentMaster = res
     })
  }

  feeToBeCollected : any
  findFee(sessionFee : any){
    return this.feeToBeCollected = sessionFee
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
  submitS: Subscription;
  walletS: Subscription;
  addWalletS: Subscription;
  addCashIn: Subscription;
  onSubmit(){
    let data = {
      sessionMasterId: this.route.snapshot.params['id'],
      recievedBy: this.userId,
      collectedAmount: this.feeForm.get(['collectedAmount']).value,
      paymentMode: this.feeForm.get(['paymentMode']).value,
      remarks: this.feeForm.get(['remarks']).value,
      dateAndTime: this.assessmentMaster.date
    }
      this.submitS = this.adminService.payAssessmentFees(data).subscribe((res)=>{
      this.fees = res;

      if(this.fees.collectedAmount == this.feeToBeCollected){
        // let data = {feeStatus : true}
        // this.updateFeeStatus(data,this.route.snapshot.params['id'])
        history.back()
      }
      // CREATING WALLET AND ADDING BALANCE TO IT
      else if(this.fees.collectedAmount > this.feeToBeCollected){
        let clientId = this.assessmentMaster.assessment_id.clientName._id

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
              this.addCashIn = this.adminService.addCashIn(id, walletData).subscribe((res)=>{
                // let statusData = {feeStatus : true}
                // this.updateFeeStatus(statusData,this.route.snapshot.params['id'])
                this.router.navigateByUrl('/admin/managewallet')
              })
            })
          }
          else{
            this.addCashIn = this.adminService.addCashIn(wallet._id, walletData).subscribe((res)=>{
              // let statusData = {feeStatus : true}
              // this.updateFeeStatus(statusData,this.route.snapshot.params['id'])
              this.router.navigateByUrl('/admin/managewallet')
            })
          }

        })
      }
      //ENDS

      // else if(this.fees.collectedAmount < this.feeToBeCollected){

      // }
      this._snackBar.open("Fee added successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  // updateS: Subscription;
  // updateFeeStatus(data : any, id : String){
  //   this.updateS = this.adminService.updateAssessmentFeeStatus (data,id).subscribe((status)=>{})
  // }

  clearControls(){
    this.feeForm.reset()
    this.feeForm.setErrors(null)
    Object.keys(this.feeForm.controls).forEach(key=>{this.feeForm.get(key).setErrors(null)})
  }
}

