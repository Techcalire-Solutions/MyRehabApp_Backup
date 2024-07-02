import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ViewClientsComponent } from './components/clients/view-clients/view-clients.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ClientInfoComponent } from './components/clients/client-info/client-info.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MedicalReportViewerComponent } from './components/clients/medical-report-viewer/medical-report-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AddRoomComponent } from './components/slots/add-room/add-room.component';
import { AddSlotComponent } from './components/slots/add-slot/add-slot.component';
import { AddSessionComponent } from './components/sessions/add-session/add-session.component';
import { AssessmentComponent } from './components/sessions/assessment/assessment.component';
import { AddLeaveComponent } from './components/leaves/add-leave/add-leave.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { DeleteDialogueComponent } from './components/delete-dialogue/delete-dialogue.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { EditClientPersonalFormComponent } from './components/clients/edit-client-personal-form/edit-client-personal-form.component';
import { EditClientMedicalFormComponent } from './components/clients/edit-client-medical-form/edit-client-medical-form.component';
import { EditClientSchoolFormComponent } from './components/clients/edit-client-school-form/edit-client-school-form.component';
import { EditClientRoutineFormComponent } from './components/clients/edit-client-routine-form/edit-client-routine-form.component';
import { FilterPipe } from 'src/app/Modules/admin/pipes/filter.pipe';
import { SessionHandoverComponent } from './components/sessions/session-handover/session-handover.component';
import { SessionHandoverDialogComponent } from './components/sessions/session-handover-dialog/session-handover-dialog.component';
import { ManageFeesComponent } from './components/settings/manage-fees/manage-fees.component';
import { ManageConcessionComponent } from './components/settings/manage-concession/manage-concession.component';
import { ViewFeePendingSessionComponent } from './components/fees/view-fee-pending-session/view-fee-pending-session.component';
import { FeePaymentComponent } from './components/fees/fee-payment/fee-payment.component';
import { ManageWalletComponent } from './components/wallets/manage-wallet/manage-wallet.component';
import { AddToWalletComponent } from './components/wallets/add-to-wallet/add-to-wallet.component';
import { ViewSessionMssterDialogueComponent } from './components/fees/view-session-msster-dialogue/view-session-msster-dialogue.component';
import { ManageLeaveComponent } from './components/leaves/manage-leave/manage-leave.component';
import { LmcDialogueComponent } from './components/fees/lmc-dialogue/lmc-dialogue.component';
import { AssessmentFeePayComponent } from './components/fees/assessment-fee-pay/assessment-fee-pay.component';
import { ViewAssessmentPendingFeeComponent } from './components/fees/view-assessment-pending-fee/view-assessment-pending-fee.component';
import { ViewAssessmentMasterDialogueComponent } from './components/fees/view-assessment-master-dialogue/view-assessment-master-dialogue.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AddLeaveDialogueComponent } from './components/leaves/add-leave-dialogue/add-leave-dialogue.component';
import { AddAssessmentDialogueComponent } from './components/sessions/add-assessment-dialogue/add-assessment-dialogue.component';
import { EditAssessmentDialogueComponent } from './components/sessions/edit-assessment-dialogue/edit-assessment-dialogue.component';
import { EditLeaveDialogueComponent } from './components/leaves/edit-leave-dialogue/edit-leave-dialogue.component';
import { PendingFeesComponent } from './components/fees/pending-fees/pending-fees.component';
import { PayPendingFeeComponent } from './components/fees/pay-pending-fee/pay-pending-fee.component';
import { PendingFeeDetailsDialogueComponent } from './components/fees/pending-fee-details-dialogue/pending-fee-details-dialogue.component';
import { AddLeaveSessionDialogueComponent } from './components/leaves/add-leave-session-dialogue/add-leave-session-dialogue.component';
import { EditLeaveSessionDialogueComponent } from './components/leaves/edit-leave-session-dialogue/edit-leave-session-dialogue.component';
import { AddLmcDialogueComponent } from './components/leaves/add-lmc-dialogue/add-lmc-dialogue.component';
import { ViewLmcFeeComponent } from './components/fees/view-lmc-fee/view-lmc-fee.component';
import { PayLmcFeesComponent } from './components/fees/pay-lmc-fees/pay-lmc-fees.component';
import { ViewSettingsComponent } from './components/settings/view-settings/view-settings.component';
import { EditClientStatusComponent } from './components/settings/edit-client-status/edit-client-status.component';
import { EditSlotStatusComponent } from './components/settings/edit-slot-status/edit-slot-status.component';
import { AddGroupSessionComponent } from './components/sessions/add-group-session/add-group-session.component';
import { ViewClientListComponent } from './components/settings/view-client-list/view-client-list.component';
import { EditLmcDialogueComponent } from './components/leaves/edit-lmc-dialogue/edit-lmc-dialogue.component';
import { AlertMessageDialogueComponent } from './components/sessions/alert-message-dialogue/alert-message-dialogue.component';
import { EditGroupSessionComponent } from './components/sessions/edit-group-session/edit-group-session.component';
import { GroupSessionComponent } from './components/fees/group-session/group-session.component';
import { GroupFeePayComponent } from './components/fees/group-fee-pay/group-fee-pay.component';
import { LmcSessionComponent } from './components/leaves/lmc-session/lmc-session.component';
import { FormsModule } from '@angular/forms';
import { ViewLeaveComponent } from './components/Therapist_Leave/view-leave/view-leave.component';
import { EmergencyLeaveComponent } from './components/Therapist_Leave/emergency-leave/emergency-leave.component';
import { DailyExpenseComponent } from './components/expenses/daily-expense/daily-expense.component';
import { CompensationComponent } from './components/sessions/compensation-session/compensation-session.component';
import { EditCompensationComponent } from './components/sessions/edit-compensation/edit-compensation.component';
import { ViewDocComponent } from './components/user/view-doc/view-doc.component';
import { LoginComponent } from './components/clients/login/login.component';
import { LeaveSlotsComponent } from './components/leaves/leave-slots/leave-slots.component';
import { ViewMoreComponent } from './components/user/view-more/view-more.component';
import { SalaryComponent } from './components/salary/salary.component';
import { FeeInvoiceComponent } from './components/fees/fee-invoice/fee-invoice.component';
import { AddCompanyComponent } from './components/company/add-company/add-company.component';
@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminNavbarComponent,
    AdminHomeComponent,
    ViewClientsComponent,
    ClientInfoComponent,
    MedicalReportViewerComponent,
    AddUserComponent,
    AddCategoryComponent,
    AddRoomComponent,
    AddSlotComponent,
    AddSessionComponent,
    AssessmentComponent,
    AddLeaveComponent,
    AddClientComponent,
    DeleteDialogueComponent,
    EditClientComponent,
    EditClientPersonalFormComponent,
    EditClientMedicalFormComponent,
    EditClientSchoolFormComponent,
    EditClientRoutineFormComponent,
    FilterPipe,
    SessionHandoverComponent,
    SessionHandoverDialogComponent,
    ManageFeesComponent,
    ManageConcessionComponent,
    ViewFeePendingSessionComponent,
    FeePaymentComponent,
    ManageWalletComponent,
    AddToWalletComponent,
    ViewSessionMssterDialogueComponent,
    ManageLeaveComponent,
    LmcDialogueComponent,
    AssessmentFeePayComponent,
    ViewAssessmentPendingFeeComponent,
    ViewAssessmentMasterDialogueComponent,
    AddLeaveDialogueComponent,
    AddAssessmentDialogueComponent,
    EditAssessmentDialogueComponent,
    EditLeaveDialogueComponent,
    PendingFeesComponent,
    PayPendingFeeComponent,
    PendingFeeDetailsDialogueComponent,
    AddLeaveSessionDialogueComponent,
    EditLeaveSessionDialogueComponent,
    AddLmcDialogueComponent,
    ViewLmcFeeComponent,
    PayLmcFeesComponent,
    ViewSettingsComponent,
    EditClientStatusComponent,
    EditSlotStatusComponent,
    AddGroupSessionComponent,
    ViewClientListComponent,
    EditLmcDialogueComponent,
    AlertMessageDialogueComponent,
    EditGroupSessionComponent,
    GroupSessionComponent,
    GroupFeePayComponent,
    LmcSessionComponent,
    ViewLeaveComponent,
    EmergencyLeaveComponent,
    DailyExpenseComponent,
    CompensationComponent,
    EditCompensationComponent,
    ViewDocComponent,
    LoginComponent,
    LeaveSlotsComponent,
    ViewMoreComponent,
    SalaryComponent,
    FeeInvoiceComponent,
    AddCompanyComponent
  ],

  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutModule,
    PdfViewerModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSnackBarModule,
    FullCalendarModule,
    FormsModule
  ]
})

export class AdminModule { }
