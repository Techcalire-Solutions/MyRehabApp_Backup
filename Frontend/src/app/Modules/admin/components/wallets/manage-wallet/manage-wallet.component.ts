import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Observable, Subscription } from 'rxjs';
import { Wallet } from '../../../models/wallet';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-manage-wallet',
  templateUrl: './manage-wallet.component.html',
  styleUrls: ['./manage-wallet.component.scss']
})
export class ManageWalletComponent implements OnInit, OnDestroy {

  walletForm = this.fb.group({
    clientId: ['', Validators.required]
  });

  displayedColumns: string[] = [ 'clientId', 'date','action', 'manage'];

  constructor(private fb: FormBuilder ,private adminService:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private router : Router) { }

  ngOnDestroy(): void {
    this.walletSubscription.unsubscribe();
    if(this.walletSS){
      this.walletSS.unsubscribe();
    }
    this.updateSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  walletSubscription: Subscription;
  currentUser : any
  currentUserString : any
  ngOnInit(): void {
    this.getClients()
    this.walletSubscription = this.getWallets()

    this.currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(this.currentUserString)
  }

  filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.clients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
  }

  clients: Client[] = [];
  getClients(){
    this.adminService.getClients().subscribe(client =>{
      this.clients = client;
      this.filteredOptions = this.clients
    });
  }

  walletExists : Wallet
  walletSS: Subscription;
  onSubmit(){
    this.walletSS = this.adminService.addWallet(this.walletForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Wallet added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        console.log(error)
        alert(error.error.message)
      }))
  }

  wallets : Wallet[] = [];
  getWallets(){
    return this.adminService.getWallet().subscribe((res)=>{
      this.wallets = res
    })
  }

  addToWallet(id : String, clientId: String){
    this.router.navigateByUrl('/admin/addtowallet/'+ id +'/'+ clientId)
  }

  clearControls(){
    this.walletForm.reset()
    this.getWallets()
  }

  walletSub: Subscription;
  editStat: boolean = false;
  walletId: String;
  editWallet(id: string){
    if(!this.currentUser.md){
      return alert("Access only for MD")
    }
    this.editStat = true;
    this.walletSub = this.adminService.getWalletById(id).subscribe(data =>{
      let clientName = data.clientId._id

      this.walletForm.patchValue({
        clientId: clientName
      })
    })
    this.walletId = id
  }

  updateSub: Subscription;
  update(){
    this.updateSub = this.adminService.updateWallet(this.walletId, this.walletForm.getRawValue()).subscribe(data =>{
      this.editStat = false;
      this._snackBar.open("Wallet updated successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  deleteSub: Subscription;
  deleteWallet(id: string){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSub = this.adminService.deleteWallet(id).subscribe(s=>{
          this._snackBar.open("Wallet deleted successfully...","" ,{duration:3000})
          this.clearControls()
        });
      }
    })
  }

}
