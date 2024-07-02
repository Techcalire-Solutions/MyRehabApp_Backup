import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { AdminService } from '../../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from '../../../models/room';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit,OnDestroy {

  roomForm = this.fb.group({
    roomName: ['', Validators.required]
  });

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [ 'roomName', 'action'];

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.roomSubscription.unsubscribe()
  }

  roomSubscription : Subscription
  ngOnInit(): void {
    //this.getRooms()

    this.roomSubscription = this.getRooms()
  }

  user :any;
  onSubmit(){
      this._http.addRoom(this.roomForm.getRawValue()).subscribe((res)=>{
      this.user = res;
      this._snackBar.open("Room added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.roomForm.reset()
    this.getRooms()
  }

  rooms: Room []=[]
  getRooms(){
    return this._http.getRoom().subscribe((r)=>{
      this.rooms = r;
      this.filtered = this.rooms;
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.rooms.filter(element =>
      element.roomName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getRooms();
    }
  }


  isEdit = false;
  roomId : '';
  editRoom(id){
    this.isEdit = true;
    //Get the product based on the ID
    let room = this.rooms.find(x =>x._id==id)
    //Populate the object by the ID
    let rName = room.roomName.toString();
    this.roomForm.patchValue({roomName:rName})
    this.roomId = id;
  }

  editFunction(){
    this.isEdit = false;
    let data ={
      roomName : this.roomForm.get('roomName').value
    }
    this._http.editRoom(data, this.roomId).subscribe((res)=>{
      this._snackBar.open("Room updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          console.log(error.error.text)
          alert(error)
        }))
  }

  deleteRoom(id): void {
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this._http.deleteRoom(id).subscribe((res)=>{
          this.getRooms();
          this._snackBar.open("Room deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    });
  }
}
