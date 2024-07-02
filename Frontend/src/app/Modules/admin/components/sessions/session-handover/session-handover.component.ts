import { SessionHandoverDialogComponent } from '../session-handover-dialog/session-handover-dialog.component';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Session } from '../../../models/session';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-handover',
  templateUrl: './session-handover.component.html',
  styleUrls: ['./session-handover.component.scss']
})
export class SessionHandoverComponent implements OnInit, OnDestroy {

  constructor(private _http : AdminService, public dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.sessionSubscription.unsubscribe();
  }

  displayedColumns: string[] = ['slotName','clientName', 'therapistName', 'status', 'manage'];

  sessionSubscription: Subscription;
  ngOnInit(): void {
    this.sessionSubscription = this.getSessions();
  }

  sessions : Session[]=[];
  getSessions(){
    return this._http.getSession().subscribe((s)=>{
      this.sessions = s;
      this.filtered = this.sessions
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.sessions.filter(element =>
      element.slotName.slotName.toLowerCase().includes(filterValue)
      || element.therapistName.name.toLowerCase().includes(filterValue)
      || element.clientName.firstName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getSessions();
    }
  }

  handoverSession(session){
    const dialogRef = this.dialog.open(SessionHandoverDialogComponent,
      {
        width: '600px',
        data: {session}
      });

    dialogRef.afterClosed().subscribe(result => {
      this.getSessions()
    });
  }
}
