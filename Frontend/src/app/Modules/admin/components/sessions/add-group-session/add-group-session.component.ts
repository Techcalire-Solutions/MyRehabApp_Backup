import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Session } from '../../../models/session';
import { Slot } from '../../../models/slot';
import { User } from '../../../models/user';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { U, dA } from '@fullcalendar/core/internal-common';
import { GroupSession } from '../../../models/groupSession';
import { EditGroupSessionComponent } from '../edit-group-session/edit-group-session.component';

@Component({
  selector: 'app-add-group-session',
  templateUrl: './add-group-session.component.html',
  styleUrls: ['./add-group-session.component.scss']
})
export class AddGroupSessionComponent implements OnInit {

  sessionForm = this.fb.group({
    slotName: '',
    clientId: '',
    therapistId: ''
  });

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['slotName','clientName', 'therapistName', 'status', 'manage'];
  displayedColumnsCompleted: string[] = ['slotName','clientName', 'therapistName', 'status', 'manage'];

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.selectedTherapists = [];
   }
  ngOnDestroy(): void {
    this.slotSubscription.unsubscribe()
    this.clientSubscription.unsubscribe()
    this.therapistSubcription.unsubscribe()
    this.sessionSubscription.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe()
    }
    if(this.update){
      this.update.unsubscribe()
    }
    if(this.delete){
      this.delete.unsubscribe()
    }
  }

  slotSubscription : Subscription
  clientSubscription : Subscription
  therapistSubcription : Subscription
  sessionSubscription : Subscription
  ngOnInit(): void {
    this.slotSubscription = this.getSlot()
    this.clientSubscription = this.getClient()
    this.therapistSubcription = this.getTherapist()
    this.sessionSubscription = this.getSessions()
  }

  slots : Slot[]=[];
  getSlot(){
    return this._http.getFilteredSlot().subscribe((slot)=>{
      this.slots = slot
      this.filteredOptionsSlot = slot
    })
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

  clients : Client []=[];
  clientsWL : Client []=[];
  getClient(){
    return this._http.getSortClients().subscribe((c)=>{
      this.clients = c.filter(x=>x.status == 'RS');
      this.filteredOptions = this.clients
    })
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


  users: User[] =[];
  selectedTherapists: String[] = [];
  getTherapist(){
    return this._http.getTherapist().subscribe((u)=>{
      this.users = u;
      this.filteredOptionsTherapist = this.users
      // this.selectedTherapists.push(this.selectedTherapists.)
    })
  }

  myControlTherapist = new FormControl<string | Client>('');
  filteredOptionsTherapist: User[];
  filterOptionsTherapist(event: any): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    // Filter options
    this.filteredOptionsTherapist = this.users.filter(option =>
      option.name.toLowerCase().includes(value)
    );
    if(this.filteredOptionsTherapist.length === 1){
      this.selectedTherapists.push(this.filteredOptionsTherapist[0]._id)
    }
  }


  user :any;
  submit: Subscription;
  onSubmit(){
    let groupSession = this.sessionForm.getRawValue()

    let therapiName = []
    for( let i = 0; i < groupSession.therapistId.length; i++ ){
      therapiName[i] = {
        therapistId : groupSession.therapistId[i]
      }
    }

    let clieName = []
    for( let i = 0; i < groupSession.clientId.length; i++ ){
      clieName[i] = {
        clientId : groupSession.clientId[i]
      }
    }

    let data = {
      slotName: groupSession.slotName,
      therapistName: therapiName,
      clientName: clieName,
      status: false
    }

    this.submit = this._http.addGroupSession(data).subscribe((res)=>{
      this.user = res;
      let data = {slotStatus : false}
      this.updateSlotStatus(data,this.sessionForm.get('slotName').value)
      this._snackBar.open("Group Session added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  update: Subscription;
  updateSlotStatus(data,id){
    this.update = this._http.updateSlotStatus(data,id).subscribe((status)=>{
      this.getSlot()
    })
  }

  clearControls(){
      this.sessionForm.reset()
      this.getSessions()
  }

  sessions : GroupSession[]=[];
  validSessions : GroupSession[]=[];
  completedSessions : GroupSession[]=[];
  getSessions(){
    return this._http.getGroupSession().subscribe((s)=>{
      this.sessions = s;

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
    const dialogRef = this.dialog.open(EditGroupSessionComponent, {
      data: {
        sessionId : id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSessions()
    })

  }

  delete: Subscription;
  deleteSession(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let session = this.sessions.find(x => x._id ==id)
        let data = {slotStatus : true}
        this.updateSlotStatus(data,session.slotName._id)

        this.delete = this._http.deleteGroupSession(id).subscribe((s)=>{

          let data = {slotStatus : true}
          this.updateSlotStatus(data,session.slotName._id)

          this.getSessions()
          this._snackBar.open("Session deleted successfully...","" ,{duration:3000})
        },(error=>{

          let data = {slotStatus : false}
          this.updateSlotStatus(data,session.slotName._id)

          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        })
      )}
    })
  }

}

