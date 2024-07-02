import { ViewSessionMssterDialogueComponent } from '../../fees/view-session-msster-dialogue/view-session-msster-dialogue.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Wallet } from '../../../models/wallet';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { DatePipe } from '@angular/common';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-add-to-wallet',
  templateUrl: './add-to-wallet.component.html',
  styleUrls: ['./add-to-wallet.component.scss']
})
export class AddToWalletComponent implements OnInit,OnDestroy {

  walletForm = this.fb.group({
    date : [''],
    amount: ['', Validators.required],
    paymentMode: ['', Validators.required]
  });

  displayedColumns: string[] = [ 'clientId', 'date','cashIn','cashOut','action'];

  constructor(private fb: FormBuilder ,private adminService:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private therapistService: TherapistService, private datePipe: DatePipe) { }

  ngOnDestroy(): void {
    this.walletSubscription.unsubscribe();
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.smS){
      this.smS.unsubscribe();
    }
    this.updateSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  walletSubscription : Subscription;
  userId: string;
  ngOnInit(): void {
    this.walletSubscription = this.getWallets()

    let currentUserString = localStorage.getItem('token')
    let currentUser = JSON.parse(currentUserString)
    this.userId = currentUser.id
    this.getUser()
  }

  md: boolean;
  getUser(){
    this.adminService.getTherapistById(this.userId).subscribe(response=>{
      this.md = response.md
    })
  }

  client$ : Observable<Client[]>
  getClients(){
    this.client$ = this.adminService.getClients()
  }

  user :any;
  submit: Subscription;
  onSubmit(){
    this.submit = this.adminService.addCashIn(this.activatedRoute.snapshot.params['id'],this.walletForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Cash added to wallet successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        console.log(error)
        alert(error)
      }))
  }

  wallets : Wallet[] = [];
  cashInWallet : any;
  cashOutWallet : any;
  walletAmount = 0;
  walletClient : Wallet[];
  clientName : any;
  getWallets(){
    return this.adminService.getWallet().subscribe((res)=>{
      this.wallets = res

      this.walletClient = this.wallets.filter(x=> x.clientId._id == this.activatedRoute.snapshot.params['clientId'])
      this.cashInWallet = this.walletClient[0].cashIn
      this.clientName = this.walletClient[0].clientId.firstName;

      let inTotal = [];
      this.cashInWallet.map(x =>{inTotal.push(x.amount)})

      const inSum = inTotal.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

      this.cashOutWallet = this.walletClient[0].cashOut

      let outTotal = [];
      this.cashOutWallet.map(x =>{outTotal.push(x.amount)})

      const outSum = outTotal.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

      this.walletAmount = inSum-outSum

      let data = {
        balanceAmount: this.walletAmount
      }

      this.adminService.updateWalletAmount(data, this.activatedRoute.snapshot.params['id']).subscribe((res)=>{})
    })
  }

  clearControls(){
    this.walletForm.reset()
    this.getWallets()
  }

  sessionMaster : SessionMaster
  smS: Subscription;
  getSessionMaster(id: String){
    this.smS = this.therapistService.getSessionMasterbyId(id).subscribe((res)=>{
      this.sessionMaster = res

      const dialogRef = this.dialog.open(ViewSessionMssterDialogueComponent, {
        width: '600px',
        data:  this.sessionMaster
      })
    })
  }

  editStatus = false;
  arrayId: String;
  editCash(id: String){
    if(!this.md){
      return alert("Allowed only for md")
    }
    this.editStatus = true
    let cashIn = this.walletClient[0].cashIn.find(c => c._id === id)
    let amount = cashIn.amount.toString()
    let paymentMode = cashIn.paymentMode.toString()
    let date = cashIn.date.toString()

    this.walletForm.patchValue({
      amount: amount,
      paymentMode: paymentMode,
      date: this.datePipe.transform(date, 'yyyy-MM-dd')
    })
    this.arrayId = id
  }

  updateSub: Subscription;
  update(){
    this.adminService.editCashIn(this.walletClient[0]._id, this.arrayId, this.walletForm.getRawValue()).subscribe(s=>{
      this._snackBar.open("CashIn updated successfully...","" ,{duration:3000})
      this.editStatus = false;
      this.clearControls();
    })
  }

  deleteSub: Subscription;
  deleteCash(id: String){
    if(!this.md){
      return alert("Allowed only for md")
    }
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSub = this.adminService.deleteCashIn(this.walletClient[0]._id, id).subscribe(s=>{
          this._snackBar.open("CashIn deleted successfully...","" ,{duration:3000})
          this.clearControls()
        });
      }
    })
  }

}

