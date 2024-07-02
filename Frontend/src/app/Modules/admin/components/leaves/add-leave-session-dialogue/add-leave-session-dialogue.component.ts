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
import { S } from '@fullcalendar/core/internal-common';
import * as moment from 'moment'

@Component({
  selector: 'app-add-leave-session-dialogue',
  templateUrl: './add-leave-session-dialogue.component.html',
  styleUrls: ['./add-leave-session-dialogue.component.scss']
})
export class AddLeaveSessionDialogueComponent implements OnInit {

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


  constructor(public dialogRef: MatDialogRef<AddAssessmentDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(): void {
    this.clientSubscription.unsubscribe();
    this.therapistSubscription.unsubscribe();
    this.leaveSubscription.unsubscribe();
    if(this.getTS){
      this.getTS.unsubscribe();
    }
  }

  clientSubscription: Subscription;
  therapistSubscription: Subscription;
  leaveSubscription : Subscription
  ngOnInit(): void {
    this.clientSubscription = this.getClient()
    this.therapistSubscription = this.getTherapist()
    this.leaveSubscription = this.getLeaveDate()
  }

  displayedColumns : String[] = ['clientId', 'fromDate', 'toDate', 'slotId','action','manage']

  clients: Client []=[];
  getClient(){
    return this._http.getClients().subscribe((c)=>{
      this.clients = c.filter(x=>x.status != 'DS');

      this.filteredOptions = this.clients
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
    this.getTS = this._http.getCategoryById(slot.therapyCategory._id).subscribe((x)=>{
      let reqCategory = x
      this.selectedTherapists = this.users.filter(x=>x.therapyCategory.abbreviation == reqCategory.abbreviation)
      this.viewTherapyCategory = true;

      this.weekDay = slot.weekDay
    })

  }

  weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent aal days except this.weekDay.
    const weekdayIndex = this.weekdayNames.indexOf(this.weekDay);
    return day == weekdayIndex;
  };

  fromDate : Date
  toDate : Date
  slots: Slot[] = [] ;
  getLeaveDate(){
    return this._http.getLeaveById(this.data.id).subscribe(x =>{
      this.fromDate = x.fromDate;
      this.toDate = x.toDate;
      for(let i = 0; i < x.slots.length; i++){
        if(x.slots[i].status === false){
          this.slots.push(x.slots[i].slotId)
        }
      };
    })
  }

  findType(id: string){
    this._http.getClientInfo(id).subscribe(data =>{
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
    //-----------------------------------Starts(Spread Operator)-----------------------------------------------------------
    const commonForm = {
      ...this.assessmentForm.value,
    };
    commonForm.assessmentDate = this.datePipe.transform(this.assessmentForm.value.assessmentDate, 'yyyy-MM-dd')





    const assmentDate  = moment(commonForm.assessmentDate).format('YYYY-MM-DD')
    const FromDate = moment(this.fromDate).format('YYYY-MM-DD')
    const Todate = moment(this.toDate).format('YYYY-MM-DD')


    if(assmentDate >= FromDate && assmentDate <= Todate){
      this._http.addLeaveSession(commonForm).subscribe((res)=>{
        this.user = res;

        this._snackBar.open("Leave Session added successfully...", "" ,{duration:3000})
        this.clearControls()

        this.dataSubmitted.emit(this.user);
        this.dialogRef.close(this.user);
      },(error=>{
        console.log(error)
        // alert(error)
      }))
    }

    else{
      alert("Date is not valid")
    }

  }

  clearControls(){
    this.assessmentForm.reset()
  }

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
