import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators ,FormsModule, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import{AuthService} from '../../auth.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  clientLoginForm = this.fb.group({

    client_ID  : [null, [Validators.required]],
    password:[null,Validators.required,]
  });

  loginForm = this.fb.group({
    email: [null, [Validators.required,Validators.email]],
    password:[null,Validators.required,]
  });

  hasUnitNumber = false;

  setCurrentUser(){
    if(localStorage.getItem('token')){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      // this._http.setCurrentUser(user)
      let role = user.role.toLowerCase();
      this.router.navigate([role]);
    }
  }

  constructor(private fb: FormBuilder ,private _http:AuthService,private router:Router) { }

  ngOnDestroy(){
    if(this.loginS){
      this.loginS.unsubscribe();
    }
  }

  user :any;
  ngOnInit(): void {
  }

  token : any;
  loginS: Subscription;
  onSubmit(){
    this.loginS = this._http.login(this.loginForm.getRawValue()).subscribe((res)=>{
      this.token = res
      // localStorage.setItem('token', this.token.token)
      if(this.token){
        this.setCurrentUser()
      }
    },(error=>{
      console.log(error)
      alert(error.error.message)
    }))
  }

  clientLogin(){
    this._http.clientLogin(this.clientLoginForm.getRawValue()).subscribe(response=>{
      this.token = response
      if(this.token){
        this.setCurrentUser()
      }
    })
  }
}
