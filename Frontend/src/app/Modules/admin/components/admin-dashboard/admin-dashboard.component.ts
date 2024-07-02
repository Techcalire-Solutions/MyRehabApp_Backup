import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Modules/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(public authService:AuthService, private router:Router) { }
  userName :any;
  token : any;
  name :any;

  ngOnInit(): void {
    this.setCurrentUser()
  }

  setCurrentUser(){
    this.token =  localStorage.getItem('token');
    this.userName = JSON.parse(this.token).username
  }




}
