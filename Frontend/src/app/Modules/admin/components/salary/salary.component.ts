import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'name', 'salary', 'sessions'];


  constructor(private fb:FormBuilder, private http:AdminService) { }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
    this.assessmentSub?.unsubscribe();
    this.groupSub?.unsubscribe();
    this.lmcSub?.unsubscribe();
  }

  salary:any;

    salaryForm = this.fb.group({
    startDate:[Date],
    endDate:[Date]
  })


  onSubmit(){
    //console.log(this.salaryForm.getRawValue())
    this.getSalary()
    this.getAssessmentSalary()
    // this.getGroupSalary()
    this.getLmcSalary()
  }

  sessionSub: Subscription;
  getSalary(){
    this.sessionSub = this.http.getSalary(this.salaryForm.getRawValue()).subscribe((response)=>{
      this.salary=response
    })
  }

  asseSalary: any;
  assessmentSub: Subscription;
  getAssessmentSalary(){
    this.assessmentSub = this.http.getAssessmentSalary(this.salaryForm.getRawValue()).subscribe((response)=>{
      this.asseSalary = response
    })
  }

  groupSub: Subscription;
  groupSalary: any;

  // getGroupSalary(){
  //   this.groupSub = this.http.getGroupSalary(this.salaryForm.getRawValue()).subscribe((response)=>{
  //   this.groupSalary = response
  //   console.log(response)
  //   })
  // }

  lmcSub: Subscription;
  lmcsalary:any
  getLmcSalary(){
    this.lmcSub = this.http.getLmcSalary(this.salaryForm.getRawValue()).subscribe((response)=> {
        this.lmcsalary = response
        console.log(this.lmcsalary);

    });
    // getLmcSalary
  }

  ngOnInit(): void {
    this.getSalary()
    this.getAssessmentSalary()
    // this.getGroupSalary()
    this.getLmcSalary()
  }

}

