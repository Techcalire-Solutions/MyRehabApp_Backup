import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Observable, Subscription, map } from 'rxjs';
import { Concession } from '../../../models/concession';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-concession',
  templateUrl: './manage-concession.component.html',
  styleUrls: ['./manage-concession.component.scss']
})
export class ManageConcessionComponent implements OnInit, OnDestroy {

  therapist: string;
  userId: string;
  constructor(private fb: FormBuilder ,private adminService:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, public dialogRef: MatDialogRef<ManageConcessionComponent>, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      let token: any = localStorage.getItem('token')

      this.therapist = JSON.parse(token)?.id
    }

  ngOnDestroy(): void {
    this.concessionSubscription.unsubscribe();
  }

  concessionForm = this.fb.group({
    clientId : ['', Validators.required],
    concessionAmount : ['', Validators.required]
  })

  concessionSubscription: Subscription;

  ngOnInit(): void {
    this.getClients()
    this.concessionSubscription = this.viewConcession()
  }

  displayedColumns : String[] = ['clientId', 'concessionAmount', 'action']

  client$ : Observable<Client[]>
  getClients(){
    this.client$ = this.adminService.getClients().pipe(map(x=> x.filter(y => y.status != 'DS' && y.status != 'WL')))
  }

  isEdit : any = false;
  onSubmit(){
    let data = {
      clientId : this.concessionForm.get('clientId').value,
      concessionAmount : this.concessionForm.get('concessionAmount').value,
      date : this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
      referredBy : this.therapist
    }
    this.adminService.applyConcession(this.concessionForm.getRawValue()).subscribe((res)=>{
      this.dialogRef.close();
      this.clearControls()
    })
  }

  concessions$: Observable<Concession[]>
  cons : any
  viewConcession(){
    this.concessions$ = this.adminService.getConcession()

    return this.concessions$.subscribe((res)=>{
      this.cons = res
    })
  }

  concessionId : any
  editConcession(id : any){
    this.isEdit = true;
    let concession = this.cons.find((x:any)=>x._id == id)

    let clientId = concession.clientId._id.toString();
    let concessionAmount = concession.concessionAmount.toString();

    this.concessionForm.patchValue({
      clientId: clientId,
      concessionAmount: concessionAmount,
    })
  this.concessionId = id;
  }

  editFunction(){
    this.isEdit = false;
    let data ={
      clientId: this.concessionForm.get('clientId').value,
      concessionAmount: this.concessionForm.get('concessionAmount').value,
    }
    this.adminService.editConcession(data, this.concessionId).subscribe((res)=>{
      this._snackBar.open("Concession updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          alert(error)
        }))
  }

  clearControls(){
    this.concessionForm.reset()
    this.viewConcession()
  }

  deleteConcession(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this.adminService.deleteConcession(id).subscribe((slot)=>{
          this.viewConcession()
          this._snackBar.open("Concession deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

}
