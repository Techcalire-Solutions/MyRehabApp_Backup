import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TherapistRoutingModule } from './therapist-routing.module';
import { TherapistDashboardComponent } from './components/therapist-dashboard/therapist-dashboard.component';
import { TherapistHomeComponent } from './components/therapist-home/therapist-home.component';
import { TherapistNavbarComponent } from './components/therapist-navbar/therapist-navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
import { ClientInfoComponent } from './components/Home2/client-info/client-info.component';
import { TherapistDailySessionComponent } from './components/therapist-daily-session/therapist-daily-session.component';
import { DailySessionDataComponent } from './components/Home2/daily-session-data/daily-session-data.component';
import { OtSessionDataComponent } from './components/SessionForms/ot-session-data/ot-session-data.component';
import { ViewOtSessionDataComponent } from './components/SessionForms/view-ot-session-data/view-ot-session-data.component';
import { StSessionDataComponent } from './components/SessionForms/st-session-data/st-session-data.component';
import { SeSessionDataComponent } from './components/SessionForms/se-session-data/se-session-data.component';
import { DatePipe } from '@angular/common';
import { EditOtDataComponent } from './components/SessionForms/edit-ot-data/edit-ot-data.component';
import { ViewStSessionDataComponent } from './components/SessionForms/view-st-session-data/view-st-session-data.component';
import { ViewSeSessionDataComponent } from './components/SessionForms/view-se-session-data/view-se-session-data.component';
import { ViewBtSessionDataComponent } from './components/SessionForms/view-bt-session-data/view-bt-session-data.component';
import { BtSessionDataComponent } from './components/SessionForms/bt-session-data/bt-session-data.component';
import { EditStDataComponent } from './components/SessionForms/edit-st-data/edit-st-data.component';
import { EditSeDataComponent } from './components/SessionForms/edit-se-data/edit-se-data.component';
import { EditBtDataComponent } from './components/SessionForms/edit-bt-data/edit-bt-data.component';
import { AddGoalSeComponent } from './components/SessionForms/add-goal-se/add-goal-se.component';
import { AssessmentSessionDataComponent } from './components/Home2/assessment-session-data/assessment-session-data.component';
import { StAssessmentFormComponent } from './components/AssessmentForms/st-assessment-form/st-assessment-form.component';
import { ViewCompletedSessionsComponent } from './components/Session/view-completed-sessions/view-completed-sessions.component';
import { ViewAssessmentSessionComponent } from './components/Assessment/view-assessment-session/view-assessment-session.component';
import { ViewDailySessionsComponent } from './components/Session/view-daily-sessions/view-daily-sessions.component';
import { BtAssessmentFormComponent } from './components/AssessmentForms/bt-assessment-form/bt-assessment-form.component';
import { OtAssessmentFormComponent } from './components/AssessmentForms/ot-assessment-form/ot-assessment-form.component';
import { SeAssessmentFormComponent } from './components/AssessmentForms/se-assessment-form/se-assessment-form.component';
import { ViewOtAssessmentFormComponent } from './components/AssessmentForms/view-ot-assessment-form/view-ot-assessment-form.component';
import { ViewStAssessmentFormComponent } from './components/AssessmentForms/view-st-assessment-form/view-st-assessment-form.component';
import { ViewBtAssessmentFormComponent } from './components/AssessmentForms/view-bt-assessment-form/view-bt-assessment-form.component';
import { ViewSeAssessmentFormComponent } from './components/AssessmentForms/view-se-assessment-form/view-se-assessment-form.component';
import { EditOtAssessmentFormComponent } from './components/AssessmentForms/edit-ot-assessment-form/edit-ot-assessment-form.component';
import { EditBtAssessmentFormComponent } from './components/AssessmentForms/edit-bt-assessment-form/edit-bt-assessment-form.component';
import { EditStAssessmentFormComponent } from './components/AssessmentForms/edit-st-assessment-form/edit-st-assessment-form.component';
import { EditSeAssessmentFormComponent } from './components/AssessmentForms/edit-se-assessment-form/edit-se-assessment-form.component';
import { ViewCompletedAssessmentsComponent } from './components/Assessment/view-completed-assessments/view-completed-assessments.component';
import { EndSessionDialogueComponent } from './components/Home2/end-session-dialogue/end-session-dialogue.component';
import { ViewDischargedSessionsComponent } from './components/Session/view-discharged-sessions/view-discharged-sessions.component';
import { StartSessionDialogueComponent } from './components/Home2/start-session-dialogue/start-session-dialogue.component';
import { EndAssessmentDialogueComponent } from './components/Home2/end-assessment-dialogue/end-assessment-dialogue.component';
import { ViewEndAssessmentsComponent } from './components/Assessment/view-end-assessments/view-end-assessments.component';
import { ViewLeaveTodayComponent } from './components/Leaves/view-leave-today/view-leave-today.component';
import { ViewLmcTodayComponent } from './components/Leaves/view-lmc-today/view-lmc-today.component';
import { GorupSessionComponent } from './components/Home2/gorup-session/gorup-session.component';
import { GroupSessionDialogComponent } from './components/Home2/group-session-dialog/group-session-dialog.component';
import { ViewGoupMasterComponent } from './components/Home2/view-goup-master/view-goup-master.component';
import { AddMoreAttenteesComponent } from './components/Home2/add-more-attentees/add-more-attentees.component';

import { ProfileManagementComponent } from './components/Profile/profile-management/profile-management.component';
import { AddLeaveComponent } from './components/Therapist_Leave/add-leave/add-leave.component';

import { GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CompensationSessionComponent } from './components/Therapist_Leave/compensation-session/compensation-session.component';
import { TaskComponent } from './components/Tasks/task/task.component';
import { ViewTaskComponent } from './components/Tasks/view-task/view-task.component';
import { ViewComponent } from './components/Tasks/view/view.component';
import { ReviewTaskComponent } from './components/Tasks/review-task/review-task.component';
import { CompletedComponent } from './components/Tasks/completed/completed.component';
import { ManageGoalComponent } from './components/Goal/manage-goal/manage-goal.component';
import { AddGoalComponent } from './components/Goal/add-goal/add-goal.component';
import { UpdateGoalComponent } from './components/Goal/update-goal/update-goal.component';
import { NewGoalComponent } from './components/Goal/new-goal/new-goal.component';
import { PFormComponent } from './components/AssessmentForms/p-form/p-form.component';


@NgModule({
  declarations: [
    TherapistDashboardComponent,
    TherapistHomeComponent,
    TherapistNavbarComponent,
    ClientInfoComponent,
    TherapistDailySessionComponent,
    DailySessionDataComponent,
    OtSessionDataComponent,
    ViewOtSessionDataComponent,
    StSessionDataComponent,
    SeSessionDataComponent,
    EditOtDataComponent,
    ViewStSessionDataComponent,
    ViewSeSessionDataComponent,
    ViewBtSessionDataComponent,
    BtSessionDataComponent,
    EditStDataComponent,
    EditSeDataComponent,
    EditBtDataComponent,
    AddGoalSeComponent,
    AssessmentSessionDataComponent,
    StAssessmentFormComponent,
    ViewCompletedSessionsComponent,
    ViewAssessmentSessionComponent,
    ViewDailySessionsComponent,
    BtAssessmentFormComponent,
    OtAssessmentFormComponent,
    SeAssessmentFormComponent,
    ViewOtAssessmentFormComponent,
    ViewStAssessmentFormComponent,
    ViewBtAssessmentFormComponent,
    ViewSeAssessmentFormComponent,
    EditOtAssessmentFormComponent,
    EditBtAssessmentFormComponent,
    EditStAssessmentFormComponent,
    EditSeAssessmentFormComponent,
    ViewCompletedAssessmentsComponent,
    EndSessionDialogueComponent,
    ViewDischargedSessionsComponent,
    StartSessionDialogueComponent,
    EndAssessmentDialogueComponent,
    ViewEndAssessmentsComponent,
    ViewLeaveTodayComponent,
    ViewLmcTodayComponent,
    GorupSessionComponent,
    GroupSessionDialogComponent,
    ViewGoupMasterComponent,
    AddMoreAttenteesComponent,
    ProfileManagementComponent,
    AddLeaveComponent,
    CompensationSessionComponent,
    TaskComponent,
    ViewTaskComponent,
    ViewComponent,
    ReviewTaskComponent,
    CompletedComponent,
    ManageGoalComponent,
    AddGoalComponent,
    UpdateGoalComponent,
    NewGoalComponent,
    PFormComponent

  ],
  imports: [
    CommonModule,
    TherapistRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDialogModule,
    PdfViewerModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatStepperModule,
    DatePipe,
    GridModule,
    DropDownListModule,
    FullCalendarModule
  ],


})
export class TherapistModule { }
