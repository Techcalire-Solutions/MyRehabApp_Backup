import { Wallet } from './../../../admin/models/wallet';
import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/Modules/admin/models/client';
import { ClientLogin } from '../../models/client-login';
import { ParentService } from '../../parent.service';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  ngOnDestroy(){
    if(this.walletSub){
      this.walletSub.unsubscribe();
    }
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
  }

  currentUser: any;
  constructor(private parentService: ParentService, private adminService: AdminService) {
    let currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(currentUserString)
    if(this.currentUser){
      this.getClient()
    }
  }

  ngOnInit(): void {
  }

  clientLogin: ClientLogin;
  client: Client;
  clientSub: Subscription;
  getClient(){
    this.clientSub = this.parentService.getClientLogin(this.currentUser.id).subscribe(client=>{
      this.clientLogin = client;
      this.client = client.clientId;
      this.getWallet();
    });
  }

  wallet: Wallet;
  walletSub: Subscription;
  getWallet(){
    this.walletSub = this.adminService.getWalletByClient(this.client._id).subscribe(result =>{
      this.wallet = result;
    });
  }

}
