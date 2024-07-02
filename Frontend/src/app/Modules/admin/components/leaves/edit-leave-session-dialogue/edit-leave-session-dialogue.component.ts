import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { LeaveSession } from '../../../models/leaveSession';
import { DatePipe } from '@angular/common';
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
  selector: 'app-edit-leave-session-dialogue',
  templateUrl: './edit-leave-session-dialogue.component.html',
  styleUrls: ['./edit-leave-session-dialogue.component.scss']
})
export class EditLeaveSessionDialogueComponent implements OnInit {


  datePipe = new DatePipe('en-US')

  assessmentForm = this.fb.group({
    slotName: [''],
    clientName:[''],
    therapistName:[''],
    assessmentDate:[],
    sessionType: ['']
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
    this.slotSubscription.unsubscribe();
    this.clientSubscription.unsubscribe();
    this.therapistSubscription.unsubscribe();
    if(this.leaveSessionS){
      this.leaveSessionS.unsubscribe();
    }
    if(this.editLSS){
      this.editLSS.unsubscribe();
    }
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
    return this._http.getFilteredSlot().subscribe((slot)=>{
        this.slots = slot
    })
  }

  clients: Client []=[];
  getClient(){
    return this._http.getClients().subscribe((c)=>{
      this.clients = c.filter(x=>x.status != 'DS');
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
  getTherapistsByCat(id:any){
    let slot = this.slots.find(x => x._id ==id)
    let reqCategory = slot.therapyCategory.abbreviation
    this.selectedTherapists = this.users.filter(x=>x.therapyCategory.abbreviation == reqCategory)
    this.viewTherapyCategory = true;

    this.weekDay = slot.weekDay
  }

  weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent aal days except this.weekDay.
    const weekdayIndex = this.weekdayNames.indexOf(this.weekDay);
    return day == weekdayIndex;
  };

  leaveSession: LeaveSession[] =[]
  aSessionId : '';
  slot : Slot
  therapist : User
  leaveSessionS: Subscription;
  editAssessment(){
     //Get the product based on the ID
     this.leaveSessionS = this._http.getLeaveSession().subscribe((as : any[])=>{
      this.leaveSession = as;

      let asession = this.leaveSession.find(x => x._id == this.data.id)

      this._http.getSlotById(asession.slotName._id).subscribe((slot)=>{
        this.slot = slot

        this.weekDay = this.slot.weekDay
      })

      this._http.getTherapistById(asession.therapistName._id).subscribe((user)=>{
        this.therapist = user
      })

      //Populate the room with product details
      let sName = asession.slotName._id.toString();
      let cName = asession.clientName._id.toString();
      let tName = asession.therapistName._id.toString();
      let sessionType = asession.sessionType.toString();
      let date: any = asession.assessmentDate

      this.assessmentForm.patchValue({
        slotName: sName,
        clientName: cName,
        therapistName: tName,
        assessmentDate: date,
        sessionType : sessionType
      })
      this.aSessionId = this.data.id;
    })
  }

  editLSS: Subscription;
  editFunction(){
    let data ={
      slotName: this.assessmentForm.get('slotName').value,
      clientName: this.assessmentForm.get('clientName').value,
      therapistName: this.assessmentForm.get('therapistName').value,
      assessmentDate: this.datePipe.transform(this.assessmentForm.get('assessmentDate').value, 'yyyy-MM-dd'),
      sessionType: this.assessmentForm.get('sessionType').value,
    }
    this._http.updateLeaveSession(data, this.aSessionId).subscribe((res)=>{
      let data = res

      this._snackBar.open("Assessment updated successfully...","" ,{duration:3000})

      this.dataSubmitted.emit(data);
      this.dialogRef.close(data);
    },(error=>{
          console.log(error.error.text)
          alert(error)
        }))
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
