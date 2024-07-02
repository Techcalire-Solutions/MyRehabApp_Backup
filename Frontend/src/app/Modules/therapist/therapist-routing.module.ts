import { ViewCompletedAssessmentsComponent } from './components/Assessment/view-completed-assessments/view-completed-assessments.component';
import { EditSeAssessmentFormComponent } from './components/AssessmentForms/edit-se-assessment-form/edit-se-assessment-form.component';
import { EditBtAssessmentFormComponent } from './components/AssessmentForms/edit-bt-assessment-form/edit-bt-assessment-form.component';
import { ViewBtAssessmentFormComponent } from './components/AssessmentForms/view-bt-assessment-form/view-bt-assessment-form.component';
import { ViewSeAssessmentFormComponent } from './components/AssessmentForms/view-se-assessment-form/view-se-assessment-form.component';
import { EditStAssessmentFormComponent } from './components/AssessmentForms/edit-st-assessment-form/edit-st-assessment-form.component';
import { ViewStAssessmentFormComponent } from './components/AssessmentForms/view-st-assessment-form/view-st-assessment-form.component';
import { ViewOtAssessmentFormComponent } from './components/AssessmentForms/view-ot-assessment-form/view-ot-assessment-form.component';
import { SeAssessmentFormComponent } from './components/AssessmentForms/se-assessment-form/se-assessment-form.component';
import { BtAssessmentFormComponent } from './components/AssessmentForms/bt-assessment-form/bt-assessment-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGoalSeComponent } from './components/SessionForms/add-goal-se/add-goal-se.component';
import { AssessmentSessionDataComponent } from './components/Home2/assessment-session-data/assessment-session-data.component';
import { BtSessionDataComponent } from './components/SessionForms/bt-session-data/bt-session-data.component';
import { ClientInfoComponent } from './components/Home2/client-info/client-info.component';
import { DailySessionDataComponent } from './components/Home2/daily-session-data/daily-session-data.component';
import { EditBtDataComponent } from './components/SessionForms/edit-bt-data/edit-bt-data.component';
import { EditOtDataComponent } from './components/SessionForms/edit-ot-data/edit-ot-data.component';
import { EditSeDataComponent } from './components/SessionForms/edit-se-data/edit-se-data.component';
import { EditStDataComponent } from './components/SessionForms/edit-st-data/edit-st-data.component';
import { OtSessionDataComponent } from './components/SessionForms/ot-session-data/ot-session-data.component';
import { SeSessionDataComponent } from './components/SessionForms/se-session-data/se-session-data.component';
import { StAssessmentFormComponent } from './components/AssessmentForms/st-assessment-form/st-assessment-form.component';
import { StSessionDataComponent } from './components/SessionForms/st-session-data/st-session-data.component';
import { TherapistDashboardComponent } from './components/therapist-dashboard/therapist-dashboard.component';
import { TherapistHomeComponent } from './components/therapist-home/therapist-home.component';
import { ViewAssessmentSessionComponent } from './components/Assessment/view-assessment-session/view-assessment-session.component';
import { ViewBtSessionDataComponent } from './components/SessionForms/view-bt-session-data/view-bt-session-data.component';
import { ViewCompletedSessionsComponent } from './components/Session/view-completed-sessions/view-completed-sessions.component';
import { ViewDailySessionsComponent } from './components/Session/view-daily-sessions/view-daily-sessions.component';
import { ViewOtSessionDataComponent } from './components/SessionForms/view-ot-session-data/view-ot-session-data.component';
import { ViewSeSessionDataComponent } from './components/SessionForms/view-se-session-data/view-se-session-data.component';
import { ViewStSessionDataComponent } from './components/SessionForms/view-st-session-data/view-st-session-data.component';
import { OtAssessmentFormComponent } from './components/AssessmentForms/ot-assessment-form/ot-assessment-form.component';
import { EditOtAssessmentFormComponent } from './components/AssessmentForms/edit-ot-assessment-form/edit-ot-assessment-form.component';
import { ViewDischargedSessionsComponent } from './components/Session/view-discharged-sessions/view-discharged-sessions.component';
import { ViewEndAssessmentsComponent } from './components/Assessment/view-end-assessments/view-end-assessments.component';
import { ViewLeaveTodayComponent } from './components/Leaves/view-leave-today/view-leave-today.component';
import { ViewLmcTodayComponent } from './components/Leaves/view-lmc-today/view-lmc-today.component';
import { AssessmentComponent } from '../admin/components/sessions/assessment/assessment.component';
import { LmcDialogueComponent } from '../admin/components/fees/lmc-dialogue/lmc-dialogue.component';
import { ManageLeaveComponent } from '../admin/components/leaves/manage-leave/manage-leave.component';
import { AddSessionComponent } from '../admin/components/sessions/add-session/add-session.component';
import { SessionHandoverComponent } from '../admin/components/sessions/session-handover/session-handover.component';
import { AddToWalletComponent } from '../admin/components/wallets/add-to-wallet/add-to-wallet.component';
import { ManageWalletComponent } from '../admin/components/wallets/manage-wallet/manage-wallet.component';
import { GorupSessionComponent } from './components/Home2/gorup-session/gorup-session.component';
import { ViewGoupMasterComponent } from './components/Home2/view-goup-master/view-goup-master.component';
import { ProfileManagementComponent } from './components/Profile/profile-management/profile-management.component';
import { AddLeaveComponent } from './components/Therapist_Leave/add-leave/add-leave.component';
import { ProfileComponent } from '../auth/components/profile/profile.component';
import { ReportComponent } from '../auth/components/report/report.component';
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

const routes: Routes = [
  {path:'',component:TherapistDashboardComponent,
children:[
  {path : '', component: TherapistHomeComponent},
  {path :'home', component: TherapistHomeComponent},
  {path: 'profile', component:ProfileComponent},
  {path :'clientinfo/:id' ,component: ClientInfoComponent},

  {path : 'viewassessmentsession', component: ViewAssessmentSessionComponent},
  {path : 'viewsessions', component : ViewDailySessionsComponent},
  {path : 'viewcompletedsessions', component: ViewCompletedSessionsComponent},
  {path : 'viewcompletedsessions/addtask/:id',component: TaskComponent},
  {path : 'viewcompletedassessments', component: ViewCompletedAssessmentsComponent},
  {path : 'viewdischargedsessions', component: ViewDischargedSessionsComponent},
  {path : 'viewendassessments', component: ViewEndAssessmentsComponent},
  {path : 'viewtodaysleave', component: ViewLeaveTodayComponent},
  {path : 'viewtodaylmc', component: ViewLmcTodayComponent},
  {path : 'viewtask', component: ViewTaskComponent},
  {path : 'viewtask/opentask/:id', component: ViewComponent},
  {path : 'viewtask/opentask/reviewtask/:id/:taskid', component: ReviewTaskComponent},
  {path : 'viewcompletedtask', component: CompletedComponent},

  {path :'dailysessiondata/:id', component: DailySessionDataComponent},
  {path :'assessmentsessiondata/:id', component: AssessmentSessionDataComponent},
  {path :'groupsession/:id', component: GorupSessionComponent},
  {path :'viewgroupsession/:id', component: ViewGoupMasterComponent},
  // ot form
  {path :'otsessiondata/:id/:sessionId',component: OtSessionDataComponent},
  {path :'viewotsessiondata/:id',component: ViewOtSessionDataComponent},
  {path :'editotsession/:id',component: EditOtDataComponent},
  // st form
  {path :'stsessiondata/:id/:sessionId', component:StSessionDataComponent},
  {path :'viewstsessiondata/:id',component:ViewStSessionDataComponent},
  {path :'editstsession/:id',component:EditStDataComponent},
  // se form
  {path :'addgoalse/:id', component:AddGoalSeComponent},
  {path :'sesessiondata/:id/:sessionId', component:SeSessionDataComponent},
  {path :'viewsesessiondata/:sessionId/:seId',component:ViewSeSessionDataComponent},
  {path :'editsesession/:sessionId/:seId/:arrayId',component:EditSeDataComponent},
  //bt form
  {path :'btsessiondata/:id/:sessionId', component:BtSessionDataComponent},
  {path :'viewbtsessiondata/:id', component:ViewBtSessionDataComponent},
  {path :'editbtsession/:id',component:EditBtDataComponent},
  //st assessemnt form
  {path : 'stassessmentdata/:id', component: StAssessmentFormComponent},
  {path : 'viewstassessmentform/:id', component: ViewStAssessmentFormComponent},
  {path : 'eidtstassessmentform/:id', component: EditStAssessmentFormComponent},
  //bt assessemnt form
  {path : 'btassessmentdata/:id', component: BtAssessmentFormComponent},
  {path : 'viewbtassessmentform/:id', component: ViewBtAssessmentFormComponent},
  {path : 'editbtassessmentform/:id', component: EditBtAssessmentFormComponent},
  //ot assessemnt form
  {path : 'otassessmentdata/:id', component: OtAssessmentFormComponent},
  {path : 'viewotassessmentform/:id', component: ViewOtAssessmentFormComponent},
  {path : 'editotassessmentform/:id', component: EditOtAssessmentFormComponent},
  //se assessemnt form
  {path : 'seassessmentdata/:id', component: SeAssessmentFormComponent},
  {path : 'viewseassessmentform/:id', component: ViewSeAssessmentFormComponent},
  {path : 'editseassessmentform/:id', component: EditSeAssessmentFormComponent},

  // pt
  {path : 'ptassessmentdata/:id', component: PFormComponent},

  {path:'goal',component:ManageGoalComponent},
  {path:'goal/add/:id',component:AddGoalComponent},
  {path:'goal/update/:id',component:UpdateGoalComponent},
  {path:'goal/addgoal/:id',component:NewGoalComponent},

  {path:'addassessment',component:AssessmentComponent},
  {path:'addsession',component:AddSessionComponent},
  {path:'sessionhandover',component:SessionHandoverComponent},
  {path: 'managewallet', component: ManageWalletComponent},
  {path: 'addtowallet/:id/:clientId', component: AddToWalletComponent},
  {path: 'manageleaves', component: ManageLeaveComponent},
  {path: 'lmc', component: LmcDialogueComponent},

  {path:'profile', component: ProfileManagementComponent},
  {path:'profile/addleave',component:AddLeaveComponent},
  {path:'profile/viewreport',component:ReportComponent},

  {path :'**', redirectTo: ''},


  ]},
  {path :'**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TherapistRoutingModule { }
