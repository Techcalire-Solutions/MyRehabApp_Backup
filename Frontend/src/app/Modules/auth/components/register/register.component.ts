import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import{AuthService} from '../../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({

    name: [null, Validators.required],
    email: [null,[Validators.required,Validators.email]],
    password:[null,Validators.required,],
    role: [null, Validators.required]

  });

  hasUnitNumber = false;

  roles = [
    {name: 'Admin'},
    {name: 'Therapist'}
  ]

  constructor(private fb: FormBuilder ,private _http:AuthService) { }

  user :any;
  ngOnInit(): void {
  }

  onSubmit(){
    this._http.saveUser(this.registerForm.getRawValue()).subscribe((res)=>{
      this.user = res;
    })
  }

}
