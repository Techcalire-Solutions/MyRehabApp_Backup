import { Assessment } from './../../../models/assessment';
import { Observable, Subscription, map } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Slot } from '../../../models/slot';
import { Client } from '../../../models/client';
import { User } from '../../../models/user';
import { Session } from '../../../models/session';
import { Category } from '../../../models/category';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AlertMessageDialogueComponent } from '../alert-message-dialogue/alert-message-dialogue.component';
import { AddSlotComponent } from '../../slots/add-slot/add-slot.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';


@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.scss']
})

export class AddSessionComponent implements OnInit, OnDestroy {

  filteredOptions: Client[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptions = this.clients.filter(option =>
      (option.firstName && option.firstName.toLowerCase().includes(value?.toLowerCase())) ||
      (option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase())) ||
      (option.dateOfBirth && option.dateOfBirth.toString().includes(value?.toLowerCase()))
    );
  }

  weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent aal days except this.weekDay.
    const weekdayIndex = this.weekdayNames.indexOf(this.weekDay);
    return day == weekdayIndex;
  };

  addSlot(){
    const dialogRef = this.dialog.open(AddSlotComponent, {
      width: '800px',
      data: {type: true}
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.getSlot()
    });
  }

  sessionForm = this.fb.group({
    slotName: ['', Validators.required],
    clientName:['', Validators.required],
    therapistName:[''],
    date: ['', Validators.required]
  });

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['date','slotName','clientName', 'therapistName', 'status', 'manage'];
  displayedColumnsCompleted: string[] = ['slotName','clientName', 'therapistName', 'status', 'manage'];

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.slotSubscription.unsubscribe()
    this.clientSubscription.unsubscribe()
    this.therapistSubcription.unsubscribe()
    this.sessionSubscription.unsubscribe()
    this.paginatedSessionSub.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe()
    }
    if(this.editS){
      this.editS.unsubscribe()
    }
    if(this.deleteS){
      this.deleteS.unsubscribe()
    }

  }

  slotSubscription : Subscription
  clientSubscription : Subscription
  therapistSubcription : Subscription
  sessionSubscription : Subscription
  currentUser : any
  currentUserString : any
  ngOnInit(): void {
    this.slotSubscription = this.getSlot()
    this.clientSubscription = this.getClient()
    this.therapistSubcription = this.getTherapist()
    this.sessionSubscription = this.getSessions()

    this.currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(this.currentUserString)
    this.getPaginatedSessions()
  }
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  search = ''

paginatedSessionSub: Subscription
  paginatedSessions : Session[]=[]
  getPaginatedSessions(){
    this.paginatedSessionSub = this._http.getPaginatedSession(this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.paginatedSessions= res;
      this.filtered = res.items;
    })

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPaginatedSessions()
  }



  slots : Slot[]=[];
  getSlot(){
    return this._http.getSlot().subscribe((slot)=>{
      this.slots = slot
      this.filteredOptionsSlot = this.slots

      this.filteredOptionsSlot.sort((a, b) => {
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

  myControlSlot = new FormControl<string | Client>('');
  filteredOptionsSlot: Slot[] = [];
  filterOptionsSlot(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsSlot = this.slots.filter(option =>
      (option.slotName && option.slotName.toLowerCase().includes(value?.toLowerCase()))
      ||(option.weekDay && option.weekDay.toString().includes(value?.toLowerCase()))
      ||(option.startTime && option.startTime.toString().includes(value?.toLowerCase()))
    );
  }


  clients : Client []=[];
  clientsWL : Client []=[];
  getClient(){
    return this._http.getClients().subscribe((c)=>{
      this.clients = c.filter(x=>x.status == 'RS' || x.status == 'AS');
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

  myControlTherapist = new FormControl<string | Client>('');
  filteredOptionsTherapist: User[] = [];
  filterOptionsTherapist(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    this.filteredOptionsTherapist = this.selectedTherapists.filter(option =>
      (option.name && option.name.toLowerCase().includes(value?.toLowerCase()))
    );
  }

  selectedTherapists: User[]= [];
  viewTherapyCategory = false;
  weekDay : any
  therapistName : string;
  therapistId : string;
  getTherapistsByCat(id:any){
    let slot = this.slots.find(x => x._id == id)
    this.therapistName = slot.roomName.name
    this.therapistId = slot.roomName._id
    this.viewTherapyCategory = true;
    this.sessionForm.get('date').setValue('')
    this.weekDay = slot.weekDay
  }


  isSubmitting = false;
  user :any;
  submit: Subscription;
  slotExist: boolean;
  slotTime: any[] = [];
  onSubmit(){
    if(!this.sessionForm.valid){
      return alert("Fill all mandatory fields")
    }
    this.isSubmitting = true
    let data = {
      ...this.sessionForm.value
    }
    data.therapistName = this.therapistId
    data.date = moment(this.sessionForm.get('date').value).format('YYYY-MM-DD');
    this.submit = this._http.addSession(data).subscribe((res)=>{
      this.user = res;
      this._snackBar.open("Session added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
      this.sessionForm.reset()
      this.getSessions()
      this.getSlot()
  }

  sessions : Session[]=[];
  validSessions : Session[]=[];
  completedSessions : Session[]=[];
  getSessions(){
    return this._http.getPaginatedSession(this.currentPage, this.pageSize).subscribe((s :any)=>{
      this.sessions = s.items;
      console.log(this.sessions);

      this.totalItems = s.count;
      this.validSessions = this.sessions.filter(x=> x.status == false)
      this.filtered = this.validSessions
      this.completedSessions = this.sessions.filter(x=> x.status == true)
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.validSessions.filter(element =>
      element.slotName.slotName.toLowerCase().includes(filterValue)
      || element.clientName.firstName.toLowerCase().includes(filterValue)
      || element.therapistName.name.toLowerCase().includes(filterValue)
    )}

    else{
      this.getSessions();
    }
  }

  isEdit = false;
  sessionId : '';
  slot : Slot
  therapist : User
  editSession(id){
    this.isEdit = true;

    //Get the product based on the ID
    let session = this.sessions.find(x => x._id == id)

    this._http.getSlotById(session.slotName._id).subscribe((slot)=>{
      this.slot = slot

      //Populate the room with product details
      let sName:any = session.slotName._id;
      let cName = session.clientName._id.toString();
      let tName = session.therapistName._id;
      let date: any = session.date

      this.slots.push(this.slot);

      this.sessionForm.patchValue({
        slotName: sName,
        clientName: cName,
        therapistName: tName,
        date: date
      })
      this.getTherapistsByCat(sName)
      this.sessionId = id;
    })
  }

  editS: Subscription;
  editFunction(){
    this.isEdit = false;
    let data ={
      ...this.sessionForm.value
    }
    data.date = moment(this.sessionForm.get('date').value).format('YYYY-MM-DD');
    data.therapistName = this.therapistId
    this.editS = this._http.editSession(data, this.sessionId).subscribe((res)=>{
      this._snackBar.open("Session updated successfully...","" ,{duration:3000})
      this.clearControls()
    })
  }

  deleteS: Subscription;
  deleteSession(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let session = this.sessions.find(x => x._id ==id)
        // let data = {slotStatus : true}
        // this.updateSlotStatus(data,session.slotName._id)
        this.deleteS = this._http.deleteSession(id).subscribe((s)=>{
          this.getSessions()
          this.getSlot()
          this._snackBar.open("Session deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        })
      )}
    })
  }

}

