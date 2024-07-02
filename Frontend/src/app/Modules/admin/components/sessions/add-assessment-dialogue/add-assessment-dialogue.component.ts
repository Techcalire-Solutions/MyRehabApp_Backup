import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Slot } from '../../../models/slot';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs';
import { Assessment } from '../../../models/assessment';
import { AddSessionComponent } from '../add-session/add-session.component';
import { AddSlotComponent } from '../../slots/add-slot/add-slot.component';

@Component({
  selector: 'app-add-assessment-dialogue',
  templateUrl: './add-assessment-dialogue.component.html',
  styleUrls: ['./add-assessment-dialogue.component.scss']
})
export class AddAssessmentDialogueComponent implements OnInit {
  datePipe = new DatePipe('en-US')

  assessmentForm = this.fb.group({
    slotName: ['', Validators.required],
    clientName:['', Validators.required],
    therapistName:[''],
    assessmentDate:['',Validators.required]
  });

  constructor(public dialogRef: MatDialogRef<AddAssessmentDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(): void {
    this.slotSubscription.unsubscribe();
    this.clientSubscription.unsubscribe();
    this.therapistSubscription.unsubscribe();
    if(this.submit){
      this.submit.unsubscribe();
    }
  }

  slotSubscription: Subscription;
  clientSubscription: Subscription;
  therapistSubscription: Subscription;
  ngOnInit(): void {
    this.slotSubscription = this.getSlot()
    this.clientSubscription = this.getClient()
    this.therapistSubscription = this.getTherapist()
    // this.assessmentSubscription = this.getAssessmentSessions()
  }

  slots: Slot[]=[] ;
  getSlot(){
    return this._http.getFilteredSlot().subscribe((slot)=>{
        this.slots = slot
        this.filteredOptionsSlot = this.slots

        this.slots.sort((a, b) => {
          // Compare the days first
          const dayComparison = a.weekDay.localeCompare(b.weekDay);

          if (dayComparison === 0) {
            // If the days are the same, compare the times
            return a.startTime.localeCompare(b.startTime);
          }

          return dayComparison;
        });
    })
  }

  addSlot(){
    const dialogRef = this.dialog.open(AddSlotComponent, {
      width: '800px',
      data: {type: true}
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.getSlot()
    });
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
    })
  }

  selectedTherapists: User[] = [];
  viewTherapyCategory = false;
  weekDay : any
  therapistName : string;
  therapistId : string;
  getTherapistsByCat(id:any){
    let slot = this.slots.find(x => x._id == id)
    this.therapistName = slot.roomName.name
    this.therapistId = slot.roomName._id
    // this.selectedTherapists = this.users.filter(x=>x.therapyCategory.abbreviation == reqCategory)
    // this.filteredOptionsTherapist = this.selectedTherapists
    this.viewTherapyCategory = true;
    this.weekDay = slot.weekDay
  }

  myControl = new FormControl<string | Client>('');
  filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.clients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase()))
      ||(option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase()))
    );
  }

  myControlSlot = new FormControl<string | Client>('');
  filteredOptionsSlot: Slot[] = [];
  filterOptionsSlot(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsSlot = this.slots.filter(option =>
      (option.slotName && option.slotName.toLowerCase().includes(value?.toLowerCase()))
      ||(option.weekDay && option.weekDay.toString().includes(value?.toLowerCase()))
    );
  }

  myControlTherapist = new FormControl<string | Client>('');
  filteredOptionsTherapist: User[] = [];
  filterOptionsTherapist(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsTherapist = this.selectedTherapists.filter(option =>
      (option.name && option.name.toLowerCase().includes(value?.toLowerCase()))
    );
  }

  weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent aal days except this.weekDay.
    const weekdayIndex = this.weekdayNames.indexOf(this.weekDay);
    return day == weekdayIndex;
  };


  user :any;
  submit: Subscription;
  slotTime: Assessment[];
  async onSubmit(){
  if(!this.assessmentForm.valid) return alert("Please enter details");
    //-----------------------------------Starts(Spread Operator)-----------------------------------------------------------
    const commonForm = {
      ...this.assessmentForm.value,
    };
    commonForm.assessmentDate = this.datePipe.transform(this.assessmentForm.value.assessmentDate, 'yyyy-MM-dd')
    commonForm.therapistName = this.therapistId
    //-------------------------------------Ends----------------------------------------------------------

    this._http.getAssessmentByClientId(this.assessmentForm.get('clientName').value).subscribe((res)=>{
      let dateSession = res.filter(s=>this.datePipe.transform(s.assessmentDate, 'yyyy-MM-dd') === commonForm.assessmentDate)

      if(dateSession.length != 0){
          this._http.getSlotById(this.assessmentForm.get('slotName').value).subscribe((slot)=>{
            let slotWeek = res.filter(x=> x.slotName.weekDay === slot.weekDay)
            this.slotTime = res.filter(x=> x.slotName.startTime === slot.startTime)

            if(this.slotTime.length != 0) {
              alert("The client is already scheduled for the same time...")
            }else {
              this.submit = this._http.addAssessmentSession(commonForm).subscribe(async (res)=>{
                this.user = res;
                this._snackBar.open("Assessment Session added successfully...","" ,{duration:3000})
                this.clearControls()

                this.dataSubmitted.emit(this.user);
                this.dialogRef.close(this.user);
              },(error=>{
                console.log(error)
                alert(error.error.message)
              }))
            }
          })
      }
      else{
        this.submit = this._http.addAssessmentSession(commonForm).subscribe(async (res)=>{
          this.user = res;
          this._snackBar.open("Assessment Session added successfully...","" ,{duration:3000})
          this.clearControls()

          this.dataSubmitted.emit(this.user);
          this.dialogRef.close(this.user);
        },(error=>{
          console.log(error)
          alert(error.error.message)
        }))
      }
    })
  }

  clearControls(){
    this.assessmentForm.reset()
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

}
