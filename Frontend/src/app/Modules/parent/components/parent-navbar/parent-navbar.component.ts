import { ParentDashboardComponent } from './../parent-dashboard/parent-dashboard.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { ParentService } from '../../parent.service';
import { Celebrations } from 'src/app/Modules/admin/models/celebrations';
import { DatePipe } from '@angular/common';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';

@Component({
  selector: 'app-parent-navbar',
  templateUrl: './parent-navbar.component.html',
  styleUrls: ['./parent-navbar.component.scss']
})
export class ParentNavbarComponent implements OnInit {

  ngOnDestroy(){
    this.clientSub.unsubscribe();
    this.smSub?.unsubscribe();
    this.amSub?.unsubscribe();
    this.pfSub.unsubscribe();
    this.taskSub.unsubscribe();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private router: Router,
    private adminService: AdminService, private parentService: ParentService, private datePipe: DatePipe,
    private therapistservice: TherapistService) { }

  currentUser: any;
  currentMonth : string;
  currentDate: Date
  ngOnInit(): void {
    let currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(currentUserString)
    this.currentDate = new Date();
    this.currentMonth  = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');

    this.getClient()
    // this.adminService.getClientInfo(this.currentUser)
  }

  user: String;
  clientSub: Subscription;
  getClient(){
    this.clientSub = this.parentService.getClientLogin(this.currentUser.id).subscribe((clientInfo) => {
      this.user = clientInfo.clientId.firstName
      this.getNotifications(clientInfo.clientId._id)
    })
  }

  logOut(){
    this.authService.logout()
    this.router.navigate([''])
  }

  // birthDay: Celebrations[] = [];
  // joiningDay: Celebrations[] = [];
  notifications: any[] = [];
  smSub: Subscription;
  amSub: Subscription;
  pfSub: Subscription;
  taskSub: Subscription;
  getNotifications(id: string){
    this.smSub = this.therapistservice.getSessionMaster().subscribe(res=>{
      let pendFee = res.filter(x =>
        x.sessionStatus.toLowerCase() === 'session' &&
        x.session_id.clientName._id === id &&
        x.feeStatus === false
      );
      let pendLeaveFee = res.filter(x=>
        x.sessionStatus.toLowerCase() === 'leavesession' &&
        x.leave_session_id.clientName._id === id &&
        x.feeStatus === false
      )
      let pendCompFee = res.filter(x=>
        x.sessionStatus.toLowerCase() === 'compensationsession' &&
        x.compensation_session_id.clientName._id === id &&
        x.feeStatus === false
      )

      this.amSub = this.therapistservice.getAssessmentMaster().subscribe((res)=>{
        let pendAssesFee = res.filter(x =>
          x.sessionStatus.toLowerCase() === 'assessment' &&
          x.assessment_id.clientName._id === id &&
          x.feeStatus === false
        );
        let pendAssesLeaveFee = res.filter(x=>
          x.sessionStatus.toLowerCase() === 'leaveassessment' &&
          x.leave_session_id.clientName._id === id &&
          x.feeStatus === false
        )
        let pendAssesCompFee = res.filter(x=>
          x.sessionStatus.toLowerCase() === 'compensationassessment' &&
          x.compensation_assessment_id.clientName._id === id &&
          x.feeStatus === false
        )

        this.pfSub = this.adminService.getPendingFee().subscribe(res =>{
          let pendAmount = res.filter(x =>
            x.type.toLowerCase() === 'session' &&
            x.sessionMasterId.sessionStatus.toLowerCase() === 'session' &&
            x.sessionMasterId.session_id.clientName._id === id
          );
          let pendLeaveAmount = res.filter(x=>
            x.type.toLowerCase() === 'session' &&
            x.sessionMasterId.sessionStatus.toLowerCase() === 'leavesession' &&
            x.sessionMasterId.leave_session_id.clientName._id === id
          )
          let pendCompAmount = res.filter(x=>
            x.type.toLowerCase() === 'session' &&
            x.sessionMasterId.sessionStatus.toLowerCase() === 'compensationsession' &&
            x.sessionMasterId.compensation_session_id.clientName._id === id
          )

          let pendGroupAmount = res.filter(x =>
            x.type.toLowerCase() === 'groupsession' &&
            x.groupMasterId.session_id.clientName.some(x=>x.clientId._id === id)
          );

          let pendLmcAmount = res.filter(x =>
            x.type.toLowerCase() === 'lmc' &&
            x.lmcId.clientId._id === id
          );

          this.taskSub = this.parentService.getTask().subscribe(task=>{
            let tasks = task.filter(x=>
              x.taskStatus.toLowerCase() === 'assigned' &&
              x.sessionMasterId.sessionStatus.toLowerCase() === 'session'&&
              x.sessionMasterId.session_id.clientName._id === id
            )

            let tasksL = task.filter(x=>
              x.taskStatus.toLowerCase() === 'assigned' &&
              x.sessionMasterId.sessionStatus.toLowerCase() === 'leavesession'&&
              x.sessionMasterId.leave_session_id.clientName._id === id
            )

            let tasksC = task.filter(x=>
              x.taskStatus.toLowerCase() === 'assigned' &&
              x.sessionMasterId.sessionStatus.toLowerCase() === 'compensationsession'&&
              x.sessionMasterId.compensation_session_id.clientName._id === id
            )

            this.adminService.getTherapistLeave().subscribe(res=>{
              let tOnLeave = res.filter(x=>{
                const status = x.status.toLowerCase();
                const from = this.datePipe.transform(x.fromDate, 'dd/MM/yyyy');
                const to = this.datePipe.transform(x.toDate, 'dd/MM/yyyy');

                return status != 'requested' &&
                from <= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy') &&
                to >= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy')
              })

              this.notifications = [
                ...pendFee.map(notification => ({ ...notification, notificationType: 'SessionFee' })),
                ...pendCompFee.map(notification => ({ ...notification, notificationType: 'CompensationSessionFee' })),
                ...pendLeaveFee.map(notification => ({ ...notification, notificationType: 'LeaveSessionFee' })),
                ...pendAssesFee.map(notification => ({ ...notification, notificationType: 'AssessmentFee' })),
                ...pendAssesCompFee.map(notification => ({ ...notification, notificationType: 'CompensationAssessmentFee' })),
                ...pendAssesLeaveFee.map(notification => ({ ...notification, notificationType: 'LeaveAssessmentFee' })),
                ...pendAmount.map(notification => ({ ...notification, notificationType: 'PendingAmount' })),
                ...pendLeaveAmount.map(notification => ({ ...notification, notificationType: 'PendingAmount' })),
                ...pendCompAmount.map(notification => ({ ...notification, notificationType: 'PendingAmount' })),
                ...pendGroupAmount.map(notification => ({ ...notification, notificationType: 'PendingAmount' })),
                ...pendLmcAmount.map(notification => ({ ...notification, notificationType: 'PendingAmount' })),
                ...tasks.map(notification => ({ ...notification, notificationType: 'Tasks' })),
                ...tasksL.map(notification => ({ ...notification, notificationType: 'Tasks' })),
                ...tasksC.map(notification => ({ ...notification, notificationType: 'Tasks' })),
                ...tOnLeave.map(notification => ({ ...notification, notificationType: 'TherapistOnLeave' }))
              ];
            })
          })
        })


      })
    })
    // })
  }

  showNotifications = false;
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
