import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompensationSession } from '../../../models/compensation';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Slot } from '../../../models/slot';
import { User } from '../../../models/user';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { CompensationSessionComponent } from '../../../../therapist/components/Therapist_Leave/compensation-session/compensation-session.component';
import { EditCompensationComponent } from '../edit-compensation/edit-compensation.component';

@Component({
  selector: 'app-compensation-session',
  templateUrl: './compensation-session.component.html',
  styleUrls: ['./compensation-session.component.scss']
})
export class CompensationComponent implements OnInit {

  ngOnDestroy(){
    this.compSub.unsubscribe();
  }

  constructor(private therapistService: TherapistService, private _snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCompSession()
  }

  displayedColumns: string[] = ['clientName', 'therapistName','slotName', 'date', 'manage'];

  compSub: Subscription;
  compSession: CompensationSession[] = [];
  getCompSession(){
    this.compSub = this.therapistService.getCompensation().subscribe(res=>{
      this.compSession = res;
      this.filtered = this.compSession;
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.compSession.filter(element =>
      element.clientName.firstName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getCompSession();
    }
  }

  isEdit = false;
  aSessionId : '';
  slot : Slot
  therapist : User
  editSession(id: any){
    const dialogRef = this.dialog.open(EditCompensationComponent, {
      width: '800px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe(result =>{
      // if(result){
        this.getCompSession()
      // }
    },(error=>{
      console.log(error)
      alert(error.error.message)
    }))
  }

  delete: Subscription;
  deleteSession(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        let assessment = this.compSession.find(x => x._id ==id)

        this.delete = this.therapistService.deleteCompSession(id).subscribe((session)=>{
          this.getCompSession()
          this._snackBar.open("Compensation Session deleted successfully...","" ,{duration:3000})

        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        })
      )
    }
    })
  }

}
