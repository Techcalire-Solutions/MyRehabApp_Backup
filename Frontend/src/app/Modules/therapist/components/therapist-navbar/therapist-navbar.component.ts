import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Leaves } from 'src/app/Modules/admin/models/leaves';
import { ManageFeesComponent } from 'src/app/Modules/admin/components/settings/manage-fees/manage-fees.component';
import { MatDialog } from '@angular/material/dialog';
import { ManageConcessionComponent } from 'src/app/Modules/admin/components/settings/manage-concession/manage-concession.component';
import { DatePipe } from '@angular/common';
import { ParentService } from 'src/app/Modules/parent/parent.service';

@Component({
  selector: 'app-therapist-navbar',
  templateUrl: './therapist-navbar.component.html',
  styleUrls: ['./therapist-navbar.component.scss']
})

export class TherapistNavbarComponent implements OnInit {

  ngOnDestroy(){
    // this.leaveSub.unsubscribe();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,public authService:AuthService,private router:Router,
    private adminService: AdminService, private dialog: MatDialog, private datePipe: DatePipe,
    private parentService: ParentService) {}

  currentUser : any;
  currentUserString : any
  currentMonth : string;
  currentDate: Date
  ngOnInit(): void {
    this.currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(this.currentUserString)

    this.currentDate = new Date();
    this.currentMonth  = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.getNotifications()
  }

  manageFees(){
    const dialogRef = this.dialog.open(ManageFeesComponent, {
      width: '600px',
      data: {}
    });
  }

  manageConcession(){
    const dialogRef = this.dialog.open(ManageConcessionComponent, {
      width: '600px',
      data: {}
    });
  }

  logOut(){
    this.authService.logout();
    this.router.navigate([''])
  }

  notifications: any[] = [];
  getNotifications(){
    this.adminService.getLeave().subscribe(data =>{
      let leave = data.filter(e => {
        const from = this.datePipe.transform(e.fromDate, 'dd/MM/yyyy');
        const to = this.datePipe.transform(e.toDate, 'dd/MM/yyyy');

        return from <= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy') &&
               to >= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy');
      })

      this.parentService.getTask().subscribe(task=>{
        

        let tasks = task.filter(x =>
          x.sessionMasterId.sessionStatus.toLowerCase() === 'session' &&
          x.sessionMasterId.session_id.therapistName._id === this.currentUser.id &&
          x.tasks.some((x) => x.status.toLowerCase() === 'done')
        )
        let tasksL = task.filter(x =>
          x.sessionMasterId.sessionStatus.toLowerCase() === 'leavesession' &&
          x.sessionMasterId.leave_session_id?.therapistName === this.currentUser.id &&
          x.tasks.some((x) => x.status.toLowerCase() === 'done')
        )
        let tasksC = task.filter(x =>
          x.sessionMasterId.sessionStatus.toLowerCase() === 'compensationsession' &&
          x.sessionMasterId.compensation_session_id?.therapistName === this.currentUser.id &&
          x.tasks.some((x) => x.status.toLowerCase() === 'done')
        )
      

        this.notifications = [
          ...leave.map(notification => ({ ...notification, notificationType: 'ClientLeave' })),
          ...tasks.map(notification => ({ ...notification, notificationType: 'TaskCompleted' })),
          ...tasksL.map(notification => ({ ...notification, notificationType: 'TaskLeaveCompleted' })),
          ...tasksC.map(notification => ({ ...notification, notificationType: 'TaskCompensationCompleted' }))
        ]
      })
    })
  }

  showNotifications = false;
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
