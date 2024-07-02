import { filter, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, pipe } from 'rxjs';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AdminService } from '../../../admin.service';
import { User } from '../../../models/user';
import { Wallet } from '../../../models/wallet';
import { GroupMaster } from 'src/app/Modules/therapist/models/groupMaster';

@Component({
  selector: 'app-group-fee-pay',
  templateUrl: './group-fee-pay.component.html',
  styleUrls: ['./group-fee-pay.component.scss']
})
export class GroupFeePayComponent implements OnInit {
  constructor(private fb : FormBuilder, private therapistService : TherapistService, private route : ActivatedRoute,
    public authService:AuthService, private adminService : AdminService, private _snackBar: MatSnackBar,
    private router : Router) { }

  ngOnDestroy(): void {
    this.sessionMasterSubscription.unsubscribe();
    if(this.submitS){
      this.submitS.unsubscribe();
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
    // if(this.updateS){
    //   this.updateS.unsubscribe();
    // }
  }

  feeForm = this.fb.group({
    collectedAmount: [0, Validators.required],
    paymentMode: ['', Validators.required],
    remarks: [''],
    outStanding: []
  });

  sessionMasterSubscription: Subscription;
  ngOnInit(): void {
    this.sessionMasterSubscription = this.getSessionMasterById()
    this.getUser()

  }

  sessionMaster : GroupMaster[];
  clients: any
  getSessionMasterById(){
    return this.adminService.getGroupMaster().subscribe((res)=>{
        this.sessionMaster = res

      for (const obj of this.sessionMaster) {
        this.clients = obj.clientName.filter(x=>x._id === this.route.snapshot.params['id'] && x.feeStatus == false);
      }
    }, err => {
      console.log("err")
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
  submitS: Subscription;
  walletS: Subscription;
  addWalletS: Subscription;
  addCashInS: Subscription;
  pendFee: Subscription;
  onSubmit(){
    const masterId = this.sessionMaster.filter(x=> x.clientName.filter(x=> x._id === this.route.snapshot.params['id']))[0]._id

    let data = {
      groupMasterId: masterId,
      sessionType: 'GruopSession',
      recievedBy: this.userId,
      collectedAmount: this.feeForm.get(['collectedAmount']).value,
      paymentMode: this.feeForm.get(['paymentMode']).value,
      remarks: this.feeForm.get(['remarks']).value,
      amountToBeCollected: this.findFee(this.clients[0].sessionFee, this.clients[0].concession),
      clientId: this.clients[0].clientId._id,
      // dateAndTime: this.sessionMaster.date
    }

    this.submitS = this.adminService.payGroupFees(data).subscribe((res)=>{
      this.fees = res;

      // let statusData = {feeStatus : true}
      // this.updateFeeStatus( masterId, this.route.snapshot.params['id'], statusData)
      // CREATING WALLET AND ADDING BALANCE TO IT
      if(this.fees.collectedAmount > this.feeToBeCollected){
        let clientId = this.clients[0].clientName._id

        this.adminService.getWalletByClient(clientId).subscribe((res)=>{
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
            this.adminService.addWallet(data).subscribe((res: Wallet)=>{
              const id = res._id
              const balanceA: any = res.balanceAmount

              this.adminService.addCashIn(id, walletData).subscribe((res)=>{
                this.router.navigateByUrl('/admin/managewallet')
              })
            })
          }
          else{
            this.adminService.addCashIn(wallet._id, walletData).subscribe((res)=>{
              this.router.navigateByUrl('/admin/managewallet')
            })
          }
          // this.router.navigateByUrl('managewallet')
        })
      }
      //ENDS
      //CREATING PENDING FEE TABLE
      else if(this.fees.collectedAmount < this.feeToBeCollected){

        let data = {
          groupMasterId : masterId,
          clientId: this.clients[0].clientId._id,
          pendingAmount : this.feeToBeCollected - this.fees.collectedAmount,
          type : 'GroupSession',
        }
        this.adminService.addPendingFee(data).subscribe((res)=>{
        })
      }
      else if(this.fees.collectedAmount === this.feeToBeCollected){
        history.back()
      }
      //ENDS

      this._snackBar.open("Fee added successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  // updateS: Subscription;
  // updateFeeStatus(id : string, clientNameId: string, data: any){
  //   this.updateS = this.adminService.updateGroupFeeStatus(id, clientNameId, data).subscribe((status)=>{
  //   })
  // }

  clearControls(){
    this.feeForm.reset()
  }
}
