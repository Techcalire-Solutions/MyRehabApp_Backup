import { Component, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from '../../../models/room'
import { Category } from '../../../models/category';
import { Slot } from '../../../models/slot';
import { Validators, FormBuilder } from '@angular/forms';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { User } from '../../../models/user';



@Component({
  selector: 'app-add-slot',
  templateUrl: './add-slot.component.html',
  styleUrls: ['./add-slot.component.scss']
})
export class AddSlotComponent implements OnInit,OnDestroy {

  slotForm = this.fb.group({
    roomName: [''],
    weekDay:['',Validators.required],
    startTime: ['',Validators.required],
    endTime: ['',Validators.required],
    therapyCategory:[''],
    slotName:[''],
    onCall: [false]
  });

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [ 'roomName','slotName','startTime', 'endTime','therapyCategory','weekDay', 'manage'];

  weekDays =[
    {name: 'Sunday', abbreviation: 'SUN', index: 0},
    {name: 'Monday', abbreviation: 'MON', index: 1},
    {name: 'Tuesday', abbreviation: 'TUE', index: 2},
    {name: 'Wednesday', abbreviation: 'WED', index: 3},
    {name: 'Thursday', abbreviation: 'THU', index: 4},
    {name: 'Friday', abbreviation: 'FRI', index: 5},
    {name: 'Saturday', abbreviation: 'SAT', index: 6},
  ];

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AddSlotComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnDestroy(): void {
    this.roomSubscription.unsubscribe();
    this.categorySubscription.unsubscribe();
    this.slotSubscription.unsubscribe();
  }

  roomSubscription : Subscription;
  categorySubscription : Subscription;
  slotSubscription : Subscription;
  addStatus: boolean = false;
  ngOnInit(): void {
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.type;
    }


    this.roomSubscription = this.getTherapist()
    this.categorySubscription = this.getCategory()
    this.slotSubscription = this.getSlots()
  }

  therapists : User [] = [];
  getTherapist(){
    return this._http.getTherapist().subscribe((room)=>{
      this.therapists = room;
    })
  }

  categories : Category[] =[];
  getCategory(){
    return this._http.getCategory().subscribe((cat)=>{
      this.categories = cat ;
    })
  }

  therapyabbreviation: any;
  getTherapyCat(id:any){
    this.therapyabbreviation = this.categories.find(x=>x._id==id).abbreviation
  }

  weekdayabbreviation: any;
  getWeekDay(id:any){
    this.weekdayabbreviation = this.weekDays.find(x=>x.name==id).abbreviation
  }

  name : any;
  category: String;
  categoryId: String;
  findName(id){
    this.name = this.therapists.find(x=>x._id==id).name;
    this.category = this.therapists.find(x=>x._id==id).therapyCategory.abbreviation;
    this.categoryId = this.therapists.find(x=>x._id==id).therapyCategory._id;
  }

  onSubmit(){
    if(this.slotForm.invalid){
      this._snackBar.open("Data is Invalid...","" ,{duration:3000})
      return;

    }
    let data ={
      weekDay: this.slotForm.get(['weekDay']).value,
      therapyCategory: this.categoryId,
      startTime: this.slotForm.get(['startTime']).value,
      endTime: this.slotForm.get(['endTime']).value,
      roomName: this.slotForm.get(['roomName']).value,
      // slotName: this.weekdayabbreviation+'-'+ this.name +'-'+this.slotForm.get(['startTime']).value,
      slotName: `${this.weekdayabbreviation}-${this.name.toUpperCase()}-${this.slotForm.get(['startTime']).value.toLowerCase()}`,

      onCall :this.slotForm.get(['onCall']).value
     }


    this._http.addSlot(data).subscribe((res)=>{
      this._snackBar.open("Slot added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error)=>{
      alert(error.error)
    });

  }

  clearControls(){
    this.slotForm.reset()
    this.getSlots()
  }


  slots : Slot[] =[];
  dataSource : MatTableDataSource<any>
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  getSlots(){
  return this._http.getPaginatedSlot(this.currentPage, this.pageSize).subscribe((s: any)=>{


    this.slots = s.items;
    this.totalItems = s.count;
    this.filtered = this.slots
    this.dataSource = new MatTableDataSource(this.slots)
    // this.dataSource.sort = this.sort

    // this.slots.sort((a, b) => {
    //   // Compare the days first
    //   const dayComparison = a.weekDay.localeCompare(b.weekDay);

    //   if (dayComparison === 0) {
    //     // If the days are the same, compare the times
    //     return a.startTime.localeCompare(b.startTime);
    //   }

    //   return dayComparison;
    // });
    })
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getSlots()
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.slots.filter(element =>
      element.slotName.toLowerCase().includes(filterValue)
      || element.roomName.name.toLowerCase().includes(filterValue)
      || element.therapyCategory.abbreviation.toLowerCase().includes(filterValue)
      || element.therapyCategory.therapyName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getSlots();
    }
  }


  day: string
  roName: any
  isEdit = false;
  slotId : '';
  cat: String;
  editSlot(id){
    this.isEdit = true;
    let slot = this.slots.find(x=>x._id == id)

    //Get Room
    this._http.getRoom().subscribe(res=>{
      this.roName = res.find(x=> x._id == slot.roomName._id)
    })

    //Get Category
    this._http.getCategoryById(slot.therapyCategory._id).subscribe(res=>{
      this.cat = res.abbreviation
    })

    this.day = slot.weekDay
    let start = slot.startTime.toString();
    let end = slot.endTime.toString();
    let rName = slot.roomName._id.toString()
    let category = slot.therapyCategory._id.toString();
    let sName = slot.slotName.toString();
    let onCallEdit = slot.onCall

    this.weekdayabbreviation = this.weekDays.find(x=>x.name == this.day).abbreviation
    this.name = this.therapists.find(x=>x._id==rName).name

    this.slotForm.patchValue({
      roomName: rName,
      weekDay: this.day,
      startTime: start,
      endTime: end,
      therapyCategory: category,
      slotName: sName,
      onCall: onCallEdit
    })
  this.slotId = id;
  }

  editFunction(){
    this.isEdit = false;
    let data ={
      roomName: this.slotForm.get('roomName').value,
      weekDay: this.slotForm.get('weekDay').value,
      startTime: this.slotForm.get('startTime').value,
      endTime: this.slotForm.get('endTime').value,
      therapyCategory: this.slotForm.get('therapyCategory').value,
      slotStatus:true,
      slotName: this.weekdayabbreviation+'-'+ this.name +'-'+this.slotForm.get(['startTime']).value,
      onCall:  this.slotForm.get('onCall').value
    }

    this._http.editSlot(data, this.slotId).subscribe((res)=>{
      this._snackBar.open("Slot updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          alert(error)
        }))
  }

  deleteSlot(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this._http.deleteSlot(id).subscribe((slot)=>{
          this.getSlots()
          this._snackBar.open("Slot deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
