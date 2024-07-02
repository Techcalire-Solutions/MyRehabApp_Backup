import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { Celebrations } from '../../models/celebrations';
import { DatePipe } from '@angular/common';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public authService:AuthService,private router:Router,
    private adminService: AdminService, private datePipe: DatePipe, private therapistService: TherapistService) {}

  leaveSubscription : Subscription
  currentUser : any
  currentUserString : any
  currentMonth : string;
  currentDate: Date;
  companyName : string;
  ngOnInit() {
    this.currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(this.currentUserString)
    let comp = this.currentUser.company;
    this.adminService.getCompanyById(comp).subscribe(company =>{
      console.log(company)
      this.companyName = company.companyName;
    });
    this.currentDate = new Date();
    this.currentMonth  = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');

    this.getCelebrations()
  }
  clearNotifications() {
    this.notifications = []; // Clear the notifications array
  }
  manageFees(){
    this.router.navigateByUrl('/admin/managefees')
  }

  manageConcession(){
    this.router.navigateByUrl('/admin/manageconcession')
  }

  logOut(){
    this.authService.logout()
    this.router.navigate([''])
  }

  birthDay: Celebrations[] = [];
  joiningDay: Celebrations[] = [];
  notifications: any[] = [];
  getCelebrations(){
    this.adminService.getClebrations().subscribe(res=>{
      this.birthDay = res.filter(x=> {
        const month = this.datePipe.transform(x.birthDate, 'MM');
        const date = this.datePipe.transform(x.birthDate, 'dd/MM/yyyy');

        return month === this.currentMonth && date >= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy');
      })

      this.joiningDay = res.filter(x => {
        const joiningDateMonth = this.datePipe.transform(x.joiningDate, 'MM');
        const joiningDate = this.datePipe.transform(x.joiningDate, 'dd/MM/yyyy');

        return joiningDateMonth === this.currentMonth && joiningDate >= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy');
      });

      this.adminService.getClients().subscribe(res=>{
        let  clientBirthDay = res.filter(client=> {
          const month = this.datePipe.transform(client.dateOfBirth, 'MM');
          const day = this.datePipe.transform(client.dateOfBirth, 'dd/MM/yyyy');

          return month === this.currentMonth && day >= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy');
        })

        this.adminService.getTherapistLeave().subscribe(res=>{

          let tLeave = res.filter(x=>x.status.toLowerCase() === 'requested')
          let tOnLeave = res.filter(x=>{
            const status = x.status.toLowerCase();
            const from = this.datePipe.transform(x.fromDate, 'dd/MM/yyyy');
            const to = this.datePipe.transform(x.toDate, 'dd/MM/yyyy');

            return status != 'requested' && status != 'rejected' &&
            from <= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy') &&
            to >= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy')
          })

          this.adminService.getLeave().subscribe(res=>{

            let tCliLeave = res.filter(x=>x.status.toLowerCase() === 'requested')
            let tCliOnLeave = res.filter(x=>{
              const status = x.status.toLowerCase();
              const from = this.datePipe.transform(x.fromDate, 'dd/MM/yyyy');
              const to = this.datePipe.transform(x.toDate, 'dd/MM/yyyy');

              return status != 'requested' && status != 'rejected' &&
              from <= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy') &&
              to >= this.datePipe.transform(this.currentDate, 'dd/MM/yyyy')
            })

            this.notifications = [
              ...this.birthDay.map(notification => ({ ...notification, notificationType: 'Birthday' })),
              ...this.joiningDay.map(notification => ({ ...notification, notificationType: 'JoiningDay' })),
              ...clientBirthDay.map(notification => ({ ...notification, notificationType: 'ClientBirthDay' })),
              ...tLeave.map(notification => ({ ...notification, notificationType: 'TherapistLeaveRequested' })),
              ...tOnLeave.map(notification => ({ ...notification, notificationType: 'TherapistOnLeave' })),
              ...tCliLeave.map(notification => ({ ...notification, notificationType: 'ClientLeaveRequested' })),
              ...tCliOnLeave.map(notification => ({ ...notification, notificationType: 'ClientOnLeave' }))
            ];
          });
        })
      })
    })
  }

  showNotifications = false;
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
