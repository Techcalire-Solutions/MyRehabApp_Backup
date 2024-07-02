import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentDashboardComponent } from './components/parent-dashboard/parent-dashboard.component';
import { ParentNavbarComponent } from './components/parent-navbar/parent-navbar.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ViewTaskComponent } from './components/view-task/view-task.component';
import { OpenAssignmentComponent } from './components/open-assignment/open-assignment.component';
import { StartAssignmentComponent } from './components/start-assignment/start-assignment.component';
import { ViewAssignmentComponent } from './components/view-assignment/view-assignment.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProfileComponent } from './components/profile/profile.component';
import { CdkStepper } from '@angular/cdk/stepper';
import { EditLoginComponent } from './components/edit-login/edit-login.component';
import { RequestLeaveComponent } from './components/request-leave/request-leave.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { ViewGoalComponent } from './components/view-goal/view-goal.component';
@NgModule({
  declarations: [
    ParentDashboardComponent,
    ParentNavbarComponent,
    ViewTaskComponent,
    OpenAssignmentComponent,
    StartAssignmentComponent,
    ViewAssignmentComponent,
    ProfileComponent,
    EditLoginComponent,
    RequestLeaveComponent,
    TransactionComponent,
    ViewGoalComponent
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    PdfViewerModule
  ],
  providers: [
    CdkStepper
  ]

})
export class ParentModule { }
