import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Slot } from '../../../models/slot';
import { User } from '../../../models/user';
import { AddAssessmentDialogueComponent } from '../../sessions/add-assessment-dialogue/add-assessment-dialogue.component';

@Component({
  selector: 'app-lmc-session',
  templateUrl: './lmc-session.component.html',
  styleUrls: ['./lmc-session.component.scss']
})
export class LmcSessionComponent implements OnInit {

  datePipe = new DatePipe('en-US')

  assessmentForm = this.fb.group({
    slotName: [''],
    clientName:[''],
    therapistName:[''],
    assessmentDate:[],
    sessionType: [''],
    leaveId: this.data.id
  });

  sessionTypes = [
    {name: 'Assessment'},
    {name: 'Session'}
  ]


  constructor(public dialogRef: MatDialogRef<AddAssessmentDialogueComponent>, private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(): void {
    this.lmcS.unsubscribe();
    this.clientSub.unsubscribe();
  }

  ngOnInit(): void {
    this.getLmc()
    this.getClient()
    this.getTherapist()
  }

  lmcS: Subscription;
  slotId: any;
  therapistId: any;
  slotName: String;
  therapistName: String;
  date: Date;
  slots: any[] = [];
  getLmc(){
    this.lmcS = this.adminService.getLmcById(this.data.id).subscribe((data) => {
      this.date = data.date
      for(let i = 0; i < data.slots.length; i++){
        this.slots.push(data.slots[i].slotId)
      };
    })
  }

  users: User[] =[];
  getTherapist(){
    return this._http.getTherapist().subscribe((u)=>{
      this.users = u;
    })
  }

  selectedTherapists: User[] = [];
  viewTherapyCategory = false;
  weekDay : any
  getTS: Subscription;
  getTherapistsByCat(id:any){
    let slot = this.slots.find(x => x._id == id)
    // this.getTS = this._http.getCategoryById(slot.therapyCategory).subscribe((x)=>{
      let reqCategory = slot.therapyCategory.abbreviation
      this.selectedTherapists = this.users.filter(x=>x.therapyCategory.abbreviation == reqCategory)

      this.viewTherapyCategory = true;

      this.weekDay = slot.weekDay
    // })

  }

  // displayedColumns : String[] = ['clientId', 'fromDate', 'toDate', 'slotId','action','manage']

  clients: Client []=[];
  clientSub: Subscription;
  getClient(){
    this.clientSub = this._http.getClients().subscribe((c)=>{
      this.clients = c.filter(x=>x.status != 'DS');
      this.filteredOptions = this.clients
    })
  }

  findType(id: string){
    this.adminService.getClientInfo(id).subscribe(data =>{
      if(data.status == 'WL' || data.status == 'AS'){
        this.assessmentForm.get('sessionType').setValue('Assessment')
      }
      else{
        this.assessmentForm.get('sessionType').setValue('Session')
      }
    })
  }

  user :any;
  onSubmit(){
    // let data = {
    //   slotName: this.assessmentForm.get('slotName').value,
    //   clientName: this.assessmentForm.get('clientName').value,
    //   therapistName: this.assessmentForm.get('therapistName').value,
    //   assessmentDate: this.datePipe.transform(this.assessmentForm.get('assessmentDate').value, 'yyyy/MM/dd')
    // }

    //-----------------------------------Starts(Spread Operator)-----------------------------------------------------------

    const commonForm = {
      ...this.assessmentForm.value,
    };
    commonForm.assessmentDate = this.datePipe.transform(this.date, 'yyyy-MM-dd')

    //-------------------------------------Ends----------------------------------------------------------

    // if(commonForm.assessmentDate >= this.date){
      this._http.addLeaveSession(commonForm).subscribe((res)=>{
        this.user = res;

        // let clientData = {status : 'AS'}
        // this.updateClientStatus(clientData, this.user.clientName)

        this._snackBar.open("Leave Session added successfully...","" ,{duration:3000})
        // this.clearControls()

        this.dataSubmitted.emit(this.user);
        this.dialogRef.close(this.user);
      },(error=>{
        console.log(error)
        // alert(error)
      }))
    // }

    // else{
    //   alert("Date is not valid")
    // }

  }

  // updateClientStatus(data : any, id : String){
  //   this._http.updateClientStatus(data,id).subscribe((res)=>{
  //   })
  // }

  clearControls(){
    this.assessmentForm.reset()
    // this.getAssessmentSessions()
  }

  // // updateSlotStatus(data,id){
  // //   this._http.updateSlotStatus(data,id).subscribe((status)=>{
  // //     this.getSlot()
  // //   })
  // // }

  onCancelClick(): void {
    this.dialogRef.close();
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

  
}
