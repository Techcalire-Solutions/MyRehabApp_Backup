import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { ReportComponent } from './components/report/report.component';
import { AdminReportsComponent } from './components/admin-reports/admin-reports.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DetailReportComponent } from './components/detail-report/detail-report.component';
import { SalaryReportComponent } from './components/salary-report/salary-report.component';
import { AdminLeaveComponent } from './components/admin-leave/admin-leave.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ReportComponent,
    AdminReportsComponent,
    DetailReportComponent,
    SalaryReportComponent,
    AdminLeaveComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule
  ],
  providers: [
    DatePipe
  ]
})
export class AuthModule { }
