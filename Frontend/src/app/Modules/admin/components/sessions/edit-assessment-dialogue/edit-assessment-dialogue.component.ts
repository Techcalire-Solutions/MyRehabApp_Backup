import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Slot } from '../../../models/slot';
import { User } from '../../../models/user';
import { AddAssessmentDialogueComponent } from '../add-assessment-dialogue/add-assessment-dialogue.component';
import { Assessment } from '../../../models/assessment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-assessment-dialogue',
  templateUrl: './edit-assessment-dialogue.component.html',
  styleUrls: ['./edit-assessment-dialogue.component.scss']
})
export class EditAssessmentDialogueComponent implements OnInit {

  myControl = new FormControl<string | Client>('');
  filteredOptions: Client[] = [];

  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.clients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase()))
      // (option.code && option.code.toLowerCase().includes(value?.toLowerCase())) ||
      // (option.barCode && option.barCode.toLowerCase().includes(value?.toLowerCase()))
    );
  }

  filteredOptionsSlot: Slot[] = [];
  filterOptionsSlot(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsSlot = this.slots.filter(option =>
      (option.slotName && option.slotName.toLowerCase().includes(value?.toLowerCase()))
      ||(option.weekDay && option.weekDay.toString().includes(value?.toLowerCase()))
    );
  }

  filteredOptionsTherapist: User[] = [];
  filterOptionsTherapist(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsTherapist = this.selectedTherapists.filter(option =>
      (option.name && option.name.toLowerCase().includes(value?.toLowerCase()))
    );
  }

  datePipe = new DatePipe('en-US')

  assessmentForm = this.fb.group({
    slotName: [''],
    clientName:[''],
    therapistName:[''],
    assessmentDate:[]
  });

  constructor(public dialogRef: MatDialogRef<AddAssessmentDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(): void {
    this.slotSubscription.unsubscribe();
    this.clientSubscription.unsubscribe();
    this.therapistSubscription.unsubscribe();
    this.sessionS.unsubscribe();
    this.slotS.unsubscribe();
    this.editS?.unsubscribe();
  }

  slotSubscription: Subscription;
  clientSubscription: Subscription;
  therapistSubscription: Subscription;
  assessmentSubscription : Subscription;
  ngOnInit(): void {
    this.slotSubscription = this.getSlot()
    this.clientSubscription = this.getClient()
    this.therapistSubscription = this.getTherapist()

    this.editAssessment()
  }

  slots: Slot[]=[] ;
  getSlot(){
    return this._http.getSlot().subscribe((slot)=>{
        this.slots = slot
        this.filteredOptionsSlot = this.slots
    })
  }

  clients: Client []=[];
  getClient(){
    return this._http.getClients().subscribe((c)=>{
  

      this.clients = c.filter(x=>x.status == 'WL' || x.status == 'AS');
      this.filteredOptions = this.clients
    })
  }

  users: User[] =[];
  getTherapist(){
    return this._http.getTherapist().subscribe((u)=>{
      this.users = u;
      this.filteredOptionsTherapist = this.users
    })
  }

  selectedTherapists: User[] = [];
  viewTherapyCategory = false;
  weekDay : any
  therapistName : string;
  therapistId : string;
  getTherapistsByCat(id:any){
    let slot = this.slots.find(x => x._id ==id)
    this.therapistName = slot.roomName.name
    this.therapistId = slot.roomName._id
    this.viewTherapyCategory = true;
    this.assessmentForm.get('assessmentDate').setValue('')
    this.weekDay = slot.weekDay
  }

  weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent aal days except this.weekDay.
    const weekdayIndex = this.weekdayNames.indexOf(this.weekDay);
    return day == weekdayIndex;
  };

  assessments: Assessment[] =[]
  aSessionId : '';
  slot : Slot
  therapist : User
  sessionS: Subscription;
  slotS: Subscription;
  therapistS: Subscription;
  client: Client
  editAssessment(){
     //Get the product based on the ID
     this.sessionS = this._http.getAssessmentSession().subscribe((as : any[])=>{
      this.assessments = as;

      let asession = this.assessments.find(x => x._id == this.data.id)

      this.slotS = this._http.getSlotById(asession.slotName._id).subscribe((slot)=>{
        this.slot = slot
        this.slotS = this._http.getClientInfo(asession.clientName._id).subscribe((c)=>{
          this.client = c

          //Populate the room with product details
          let sName: any = asession.slotName._id.toString();
          let cName = asession.clientName._id.toString();
          this.therapistName = asession.therapistName.name;
          this.therapistId = asession.therapistName._id;
          let date: any = asession.assessmentDate

          this.assessmentForm.patchValue({
            slotName: sName,
            clientName: cName,
            assessmentDate: date
          })
          this.aSessionId = this.data.id;

          this.weekDay = this.slot.weekDay
        })
      })

    })
  }

  editS: Subscription;
  editFunction(){
    let data ={
      slotName: this.assessmentForm.get('slotName').value,
      clientName: this.assessmentForm.get('clientName').value,
      therapistName: this.therapistId,
      assessmentDate: this.datePipe.transform(this.assessmentForm.get('assessmentDate').value,'yyyy-MM-dd')
    }
    this.editS = this._http.editAssessmentSession(data, this.aSessionId).subscribe((res)=>{
      let data = res

      this._snackBar.open("Assessment updated successfully...","" ,{duration:3000})

      this.dataSubmitted.emit(data);
      this.dialogRef.close(data);
    },(error=>{
      
          alert(error)
        }))
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
