import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { TherapistService } from '../../../therapist.service';
@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {

  constructor(private  formBuilder: FormBuilder,private therapistService:TherapistService,private authService:AuthService,private adminService:AdminService,private router:Router) {
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token)
    this.therapistId = user.id
    this.userRole = user.role

    this.adminService.getTherapistById(this.therapistId).subscribe((res)=>{
      this.userSource= res
      this.userSourcename = res.name
    })
  }
  userSourcename :any
  userSource : any;
 therapistId : any;
  userRole : string;

  ngOnInit(): void {
  }

  getleaveComp(){
    this.router.navigate(['/therapist/addLeave']);

  }
}
