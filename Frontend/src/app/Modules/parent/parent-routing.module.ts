import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentNavbarComponent } from './components/parent-navbar/parent-navbar.component';
import { ParentDashboardComponent } from './components/parent-dashboard/parent-dashboard.component';
import { ViewTaskComponent } from './components/view-task/view-task.component';
import { OpenAssignmentComponent } from './components/open-assignment/open-assignment.component';
import { StartAssignmentComponent } from './components/start-assignment/start-assignment.component';
import { ViewAssignmentComponent } from './components/view-assignment/view-assignment.component';
import { ProfileComponent } from '../parent/components/profile/profile.component';
import { EditClientComponent } from '../admin/components/clients/edit-client/edit-client.component';
import { EditClientMedicalFormComponent } from '../admin/components/clients/edit-client-medical-form/edit-client-medical-form.component';
import { EditClientPersonalFormComponent } from '../admin/components/clients/edit-client-personal-form/edit-client-personal-form.component';
import { EditClientSchoolFormComponent } from '../admin/components/clients/edit-client-school-form/edit-client-school-form.component';
import { EditClientRoutineFormComponent } from '../admin/components/clients/edit-client-routine-form/edit-client-routine-form.component';
import { RequestLeaveComponent } from './components/request-leave/request-leave.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { ViewGoalComponent } from './components/view-goal/view-goal.component';

const routes: Routes = [
  {path:'',component:ParentNavbarComponent,
   children:[
    {path:'',component:ParentDashboardComponent},
    {path:'home',component:ParentDashboardComponent},
    {path:'profile',component:ProfileComponent},
    {path:'profile/viewtransaction',component:TransactionComponent},
    {path:'profile/requestleave',component:RequestLeaveComponent},
    {path:'profile/edit/:id',component:EditClientComponent},
    {path:'profile/edit/:id/editclientpersonalform',component:EditClientPersonalFormComponent},
    {path:'profile/edit/:id/editclientmedicalform',component:EditClientMedicalFormComponent},
    {path:'profile/edit/:id/editclientschoolform',component:EditClientSchoolFormComponent},
    {path:'profile/edit/:id/editclientroutineform',component:EditClientRoutineFormComponent},
    {path:'viewtask',component:ViewTaskComponent},
    {path:'viewtask/openassignment/:id',component:OpenAssignmentComponent},
    {path:'viewtask/openassignment/startassignment/:id/:taskId',component:StartAssignmentComponent},
    {path:'viewtask/openassignment/viewassignment/:id/:taskId',component:ViewAssignmentComponent},
    {path:'viewgoal',component:ViewGoalComponent},
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }
