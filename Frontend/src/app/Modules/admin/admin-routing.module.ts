
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { AddLeaveComponent } from './components/leaves/add-leave/add-leave.component';
import { AddRoomComponent } from './components/slots/add-room/add-room.component';
import { AddSessionComponent } from './components/sessions/add-session/add-session.component';
import { AddSlotComponent } from './components/slots/add-slot/add-slot.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AssessmentComponent } from './components/sessions/assessment/assessment.component';
import { ClientInfoComponent } from './components/clients/client-info/client-info.component';
import { EditClientMedicalFormComponent } from './components/clients/edit-client-medical-form/edit-client-medical-form.component';
import { EditClientPersonalFormComponent } from './components/clients/edit-client-personal-form/edit-client-personal-form.component';
import { EditClientRoutineFormComponent } from './components/clients/edit-client-routine-form/edit-client-routine-form.component';
import { EditClientSchoolFormComponent } from './components/clients/edit-client-school-form/edit-client-school-form.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { SessionHandoverComponent } from './components/sessions/session-handover/session-handover.component';
import { ViewClientsComponent } from './components/clients/view-clients/view-clients.component';
import { ManageFeesComponent } from './components/settings/manage-fees/manage-fees.component';
import { ManageConcessionComponent } from './components/settings/manage-concession/manage-concession.component';
import { ViewFeePendingSessionComponent } from './components/fees/view-fee-pending-session/view-fee-pending-session.component';
import { FeePaymentComponent } from './components/fees/fee-payment/fee-payment.component';
import { ManageWalletComponent } from './components/wallets/manage-wallet/manage-wallet.component';
import { AddToWalletComponent } from './components/wallets/add-to-wallet/add-to-wallet.component';
import { ManageLeaveComponent } from './components/leaves/manage-leave/manage-leave.component';
import { LmcDialogueComponent } from './components/fees/lmc-dialogue/lmc-dialogue.component';
import { AssessmentFeePayComponent } from './components/fees/assessment-fee-pay/assessment-fee-pay.component';
import { ViewAssessmentPendingFeeComponent } from './components/fees/view-assessment-pending-fee/view-assessment-pending-fee.component';
import { PendingFeesComponent } from './components/fees/pending-fees/pending-fees.component';
import { PayPendingFeeComponent } from './components/fees/pay-pending-fee/pay-pending-fee.component';
import { ViewLmcFeeComponent } from './components/fees/view-lmc-fee/view-lmc-fee.component';
import { PayLmcFeesComponent } from './components/fees/pay-lmc-fees/pay-lmc-fees.component';
import { ViewSettingsComponent } from './components/settings/view-settings/view-settings.component';
import { EditClientStatusComponent } from './components/settings/edit-client-status/edit-client-status.component';
import { AddGroupSessionComponent } from './components/sessions/add-group-session/add-group-session.component';
import { ViewClientListComponent } from './components/settings/view-client-list/view-client-list.component';
import { GroupSessionComponent } from './components/fees/group-session/group-session.component';
import { GroupFeePayComponent } from './components/fees/group-fee-pay/group-fee-pay.component';
import { ViewLeaveComponent } from './components/Therapist_Leave/view-leave/view-leave.component';
import { EmergencyLeaveComponent } from './components/Therapist_Leave/emergency-leave/emergency-leave.component';
import { DailyExpenseComponent } from './components/expenses/daily-expense/daily-expense.component';
import { CompensationComponent } from '../admin/components/sessions/compensation-session/compensation-session.component';
import { ProfileComponent } from '../auth/components/profile/profile.component';
import { AdminReportsComponent } from '../auth/components/admin-reports/admin-reports.component';
import { SalaryReportComponent } from '../auth/components/salary-report/salary-report.component';
import { ViewMoreComponent } from './components/user/view-more/view-more.component';
import { SalaryComponent } from './components/salary/salary.component';
import { AdminLeaveComponent } from '../auth/components/admin-leave/admin-leave.component';
import { FeeInvoiceComponent } from './components/fees/fee-invoice/fee-invoice.component';
import { AddCompanyComponent } from './components/company/add-company/add-company.component';


const routes: Routes = [
  {path:'',component:AdminDashboardComponent,
   children:[
    {path:'',component:AdminHomeComponent},
    {path:'profile',component:ProfileComponent},
    {path:'profile/adminleave',component:AdminLeaveComponent},
    {path:'profile/report',component:SalaryReportComponent},
    {path:'home',component:AdminHomeComponent},
    {path:'addclients',component:AddClientComponent},
    {path:'addcompany',component:AddCompanyComponent},
    {path:'viewclients',component:ViewClientsComponent},
    {path:'editclients/:id',component:EditClientComponent},
    {path:'editclients/:id/editclientpersonalform',component:EditClientPersonalFormComponent},
    {path:'editclients/:id/editclientmedicalform',component:EditClientMedicalFormComponent},
    {path:'editclients/:id/editclientschoolform',component:EditClientSchoolFormComponent},
    {path:'editclients/:id/editclientroutineform',component:EditClientRoutineFormComponent},
    {path:'clientinfo/:id' ,component:ClientInfoComponent},
    {path:'adduser',component:AddUserComponent},
    {path:'adduser/view/:id',component:ViewMoreComponent},
    {path:'addcategory',component:AddCategoryComponent},
    {path:'addroom',component:AddRoomComponent},
    {path:'addslot',component:AddSlotComponent},
    {path:'addsession',component:AddSessionComponent},
    {path:'addgroupsession',component:AddGroupSessionComponent},
    {path:'addassessment',component:AssessmentComponent},
    {path:'compensationsession',component:CompensationComponent},
    {path:'addleave',component:AddLeaveComponent},
    {path:'sessionhandover',component:SessionHandoverComponent},
    {path: 'settings/managefees', component: ManageFeesComponent},
    {path: 'settings/manageconcession', component: ManageConcessionComponent},
    {path: 'viewpendingfee', component: ViewFeePendingSessionComponent},
    {path: 'viewassessmentpendingfee', component: ViewAssessmentPendingFeeComponent},
    {path: 'payfees/:id', component: FeePaymentComponent},
    {path: 'printinvoice/:id', component: FeeInvoiceComponent},
    {path: 'payassessmentfees/:id', component: AssessmentFeePayComponent},
    {path: 'managewallet', component: ManageWalletComponent},
    {path: 'addtowallet/:id/:clientId', component: AddToWalletComponent},
    {path: 'manageleaves', component: ManageLeaveComponent},
    {path: 'lmc', component: LmcDialogueComponent},
    {path: 'pendingfees', component: PendingFeesComponent},
    {path: 'paypendingfees/:id', component: PayPendingFeeComponent},
    {path: 'viewlmcfee', component: ViewLmcFeeComponent},
    {path: 'paylmcfees/:id/:arrayid', component: PayLmcFeesComponent},
    {path: 'settings', component: ViewSettingsComponent},
    {path: 'settings/clientstatus', component: EditClientStatusComponent},
    {path: 'settings/deleteclient', component: ViewClientListComponent},
    {path: 'viewgroupsessionfee', component: GroupSessionComponent},
    {path: 'paygroupsessionfees/:id', component: GroupFeePayComponent},

    {path:'viewTherapistLeaves', component: ViewLeaveComponent},
    {path:'emergencyLeave', component:EmergencyLeaveComponent},
    {path:'addexpense',component:DailyExpenseComponent},
    {path:'salary',component:SalaryComponent},
   ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
