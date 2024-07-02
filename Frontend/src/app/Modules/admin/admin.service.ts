import { Slot } from 'src/app/Modules/admin/models/slot';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Client } from './models/client';
import { Category } from './models/category';
import {Room} from './models/room'
import { User } from './models/user';
import { Session } from './models/session';
import { Assessment } from './models/assessment';
import { environment } from 'src/environments/environment';
import { Fees } from './models/fees';
import { Concession } from './models/concession';
import { SessionMaster } from '../therapist/models/sessionMaster';
import { Wallet } from './models/wallet';
import { FeeMaster } from './models/fee-master';
import { Leaves } from './models/leaves';
import { AssessmentMaster } from '../therapist/models/assessmentMaster';
import { AssessmentFeeMaster } from './models/assessment-fee-master';
import { PendingFees } from './models/pendingFee';
import { LeaveSession } from './models/leaveSession';
import { Lmc } from './models/lmc';
import { GroupSession } from './models/groupSession';
import { GroupMaster } from '../therapist/models/groupMaster';
import { GroupFeeMaster } from './models/groupFeeMaster';
import { TherapistLeave } from '../therapist/models/therapistLeave';
import { DailyExpense } from '../admin/models/dailyExpense';
import { Celebrations } from './models/celebrations';
import { Salary } from './models/salary';
import { AdminLeave } from '../auth/models/admin-leave';
import { Company } from './models/company';
import { WaitingList } from './models/waiting-list';
import { ClientLogin } from '../parent/models/client-login';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  clients : Client
  slots : Slot
  url = environment.baseUrl

  constructor(private _http:HttpClient) { }

  activateClientLogin(data: any){
    return this._http.post(environment.baseUrl+'/clientlogin/register', data)
  }

  getLoginByClientId(clientId:any){
    return this._http.get<ClientLogin>(environment.baseUrl+ '/clientlogin/getclientlogin/' + clientId);

  }
  saveClient(data:any){
    return this._http.post(environment.baseUrl+'/client',data)
  }

  getPaginatedClient(search:String, page: number, pageSize: number):Observable<Client[]>{
    return this._http.get<Client[]>(this.url + `/client?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getSortClients():Observable<Client[]>{
    return this._http.get<Client[]>(this.url+'/client/sortedclients/client');
  }

  updateMedicalForm(data:any){
    return this._http.patch(environment.baseUrl+'/client',data)
  }

  updateSchoolForm(data:any){
      return this._http.patch(environment.baseUrl+'/client',data)
  }
  updateRoutinesForm(data:any){
    return this._http.patch(environment.baseUrl+'/client',data)
  }

  addUser(data:any){
    return this._http.post(this.url+'/admin/adduser',data);
  }

  uploadUserImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/admin/userfileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  uploadExp(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/admin/userExp', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  uploadQual(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/admin/userQual', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  uploadId(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/admin/userId', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  addCategory(data:any){
    return this._http.post(this.url+'/admin/addcategory',data);
  }

  addRoom(data:any){
    return this._http.post(this.url+'/admin/addroom',data);
  }

  addSlot(data:any){
    return this._http.post(this.url+'/admin/addslot',data);
  }

  getPaginatedSlot(page: number, pageSize: number):Observable<Slot[]>{
    return this._http.get<Slot[]>(this.url + `/admin/slot?page=${page}&pageSize=${pageSize}`);
  }

  addSession(data:any){
    return this._http.post(this.url+'/admin/addsession',data);
  }

  addAssessmentSession(data:any){
    return this._http.post(this.url+'/admin/addassessment',data);
  }

  addTherapistLeave(data:any){
    return this._http.post(this.url+'/admin/addtherapistleave', data)
  }

  updateClientStatus(data:any, id:String):Observable<Client>{
    return this._http.patch<Client>(this.url+'/client/statusupdate/'+id, data)
  }

  getClients():Observable<Client[]>{
    return this._http.get<Client[]>(this.url+'/client');
  }

  deleteClients(id: string):Observable<Client>{
    return this._http.delete<Client>(this.url+'/client/'+ id);
  }

  getClientInfo(id:String):Observable<Client>{
    return this._http.get<Client>(this.url+'/client'+'/'+id);
  }

  getCategory():Observable<Category[]>{
    return this._http.get<Category[]>(this.url+'/admin/category');
  }

  getCategoryById(id: any):Observable<Category>{
    return this._http.get<Category>(this.url+'/admin/category/'+id);
  }

  getRoom():Observable<Room[]>{
    return this._http.get<Room[]>(this.url+'/admin/room');
  }

  getSlot():Observable<Slot[]>{
    return this._http.get<Slot[]>(this.url+'/admin/slot');
  }

  getSlotById(id):Observable<Slot>{
    return this._http.get<Slot>(this.url+'/admin/slot/'+id);
  }

  getFilteredSlot():Observable<Slot[]>{
    return this._http.get<Slot[]>(this.url+'/admin/filteredslot');
  }

  getSession():Observable<Session[]>{
    return this._http.get<Session[]>(this.url+'/admin/session').pipe(shareReplay());
  }

  getPaginatedSession( page: number, pageSize: number):Observable<Session[]>{
    return this._http.get<Session[]>(this.url + `/admin/session?&page=${page}&pageSize=${pageSize}`);
  }

  getSessionById(id:String):Observable<Session>{
    return this._http.get<Session>(this.url+'/admin/session/'+id);
  }

  getSessionByClientId(id:String):Observable<Session[]>{
    return this._http.get<Session[]>(this.url+'/admin/sessionbyclient/' + id);
  }

  getTherapist():Observable<User[]>{
    return this._http.get<User[]>(this.url+'/admin/gettherapist');
  }

  getTherapistById(id):Observable<User>{
    return this._http.get<User>(this.url+'/admin/gettherapist/'+id);
  }

  getTherapistByCategoryId(id: string):Observable<User[]>{
    return this._http.get<User[]>(this.url+'/admin/gettherapist/category/'+id);
  }

  getAdmin():Observable<User[]>{
    return this._http.get<User[]>(this.url+'/admin/getadmin');
  }

  getUsers():Observable<User[]>{
    return this._http.get<User[]>(this.url+'/admin/user')
  }

  getAssessmentSession():Observable<Assessment[]>{
    return this._http.get<Assessment[]>(this.url+'/admin/assessment');
  }

  getAssessmentById(id:String):Observable<Assessment>{
    return this._http.get<Assessment>(this.url+'/admin/assessment/'+id);
  }

  getAssessmentByClientId(id:String):Observable<Assessment[]>{
    return this._http.get<Assessment[]>(this.url+'/admin/assessmentbyclient/'+id);
  }



  getPaginatedAssessment( page: number, pageSize: number):Observable<Assessment[]>{
    return this._http.get<Assessment[]>(this.url + `/admin/assessment?&page=${page}&pageSize=${pageSize}`);
  }




  updateSlotStatus(data:any, id:any){
    return this._http.patch(this.url+'/admin/slotupdate/'+id,data)
  }

  endSession(id:any, data:any){
    return this._http.get(this.url+'/admin/endsession/'+ id, data)
  }

  // updateSessionStatus(data:any, id:any){
  //   return this._http.patch(this.url+'/admin/su/'+id,data)
  // }

  editCategory(data:any, id:String):Observable<Category>{
    return this._http.patch<Category>(this.url+'/admin/category/'+id, data);
  }

  editUser(data:any, id:String, celebId: string):Observable<User>{
    return this._http.patch<User>(this.url+'/admin/user/'+id + '/' + celebId, data);
  }

  editUserUploadImage(data:any, id:String):Observable<User>{
    return this._http.patch<User>(this.url+'/admin/userupload/'+id, data);
  }

  expUpload(data:any, id:String):Observable<User>{
    return this._http.patch<User>(this.url+'/admin/expupload/'+id, data);
  }

  qualUpload(data:any, id:String):Observable<User>{
    return this._http.patch<User>(this.url+'/admin/qualupload/'+id, data);
  }

  idUpload(data:any, id:String):Observable<User>{
    return this._http.patch<User>(this.url+'/admin/idupload/'+id, data);
  }
  editPersonalForm(data:any, id:String):Observable<Client>{
    return this._http.patch<Client>(this.url+'/client/personalformupdate/'+id, data);
  }

  editMedicalForm(data:any, id:String):Observable<Client>{
    return this._http.patch<Client>(this.url+'/client/medicalformupdate/'+id, data);
  }

  editSchoolForm(data:any, id:String):Observable<Client>{
    return this._http.patch<Client>(this.url+'/client/schoolformupdate/'+id, data);
  }

  editRoutineForm(data:any, id:String):Observable<Client>{
    return this._http.patch<Client>(this.url+'/client/routineformupdate/'+id, data);
  }

  editRoom(data:any, id:String):Observable<Room>{
    return this._http.patch<Room>(this.url+'/admin/room/'+id, data);
  }

  editSlot(data:any, id:String):Observable<Slot>{
    return this._http.patch<Slot>(this.url+'/admin/slot/'+id, data);
  }

  editSession(data:any, id:String):Observable<Session>{
    return this._http.patch<Session>(this.url+'/admin/session/'+id, data);
  }

  editAssessmentSession(data: any, id: String):Observable<Assessment>{
    return this._http.patch<Assessment>(this.url+'/admin/assessment/'+id, data);
  }

  deleteCategory(id:String){
    return this._http.delete(this.url+'/admin/category/'+id);
  }

  deleteUser(id:String){
    return this._http.delete(this.url+'/admin/user/'+id);
  }

  deleteRoom(id:String){
    return this._http.delete(this.url+'/admin/room/'+id);
  }

  deleteSlot(id:String){
    return this._http.delete(this.url+'/admin/slot/'+id);
  }

  deleteSession(id:String){
    return this._http.delete(this.url+'/admin/session/'+id);
  }

  deleteAssessmentSession(id:String){
    return this._http.delete(this.url+'/admin/assessment/'+id);
  }

  //FEES
  getFees():Observable<Fees[]>{
    return this._http.get<Fees[]>(this.url +'/admin/fees')
  }

  editFees(data : any, id : String):Observable<Fees>{
    return this._http.patch<Fees>(this.url+'/admin/fees/'+ id, data)
  }

  applyConcession(data : any){
    return this._http.post(this.url+'/admin/concession', data)
  }

  getConcession():Observable<Concession[]>{
    return this._http.get<Concession[]>(this.url+'/admin/concession')
  }

  editConcession(data : any, id : String):Observable<Concession>{
    return this._http.patch<Concession>(this.url+'/admin/concession/'+id, data)
  }

  deleteConcession(id : String){
    return this._http.delete(this.url+'/admin/concession/'+id)
  }

  feeToBeCollected : any
  findFee(sessionFee : any, concession : any){
    return this.feeToBeCollected = sessionFee - concession
  }

  payFees(data  : any){
    return this._http.post(this.url+'/admin/feemaster', data)
  }

  uploadImage(file : any):Observable<any>{
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post(environment.baseUrl+'/admin/fileupload', formData);
  }

  getPayedFees():Observable<FeeMaster[]>{
    return this._http.get<FeeMaster[]>(this.url+'/admin/feemaster')
  }

  updateFeeStatus(data : any, id : String):Observable<SessionMaster>{
    return this._http.patch<SessionMaster>(this.url + '/therapist/statusupdate/'+id, data)
  }

  payAssessmentFees(data  : any){
    return this._http.post(this.url+'/admin/assessmentfeemaster', data)
  }

  updateAssessmentFeeStatus(data : any, id : String):Observable<AssessmentMaster>{
    return this._http.patch<AssessmentMaster>(this.url + '/therapist/feestatusupdate/'+id, data)
  }

  getPayedAssessmentFees():Observable<AssessmentFeeMaster[]>{
    return this._http.get<AssessmentFeeMaster[]>(this.url+'/admin/assessmentfeemaster')
  }

  getFeeMasterById(id: string):Observable<FeeMaster>{
    return this._http.get<FeeMaster>(this.url +'/admin/feemaster/'+id)
  }

  //WALLET
  addWallet(data: any){
    return this._http.post(this.url + '/admin/wallet', data)
  }

  getWallet():Observable<Wallet[]>{
    return this._http.get<Wallet[]>(this.url+'/admin/wallet')
  }

  addCashIn(id : String, data : any): Observable<Wallet>{
    return this._http.patch<Wallet>(this.url +'/admin/cashin/'+ id, data)
  }

  addCashOut(id : String, data : any): Observable<Wallet>{
    return this._http.patch<Wallet>(this.url +'/admin/cashout/'+ id, data)
  }

  getWalletById(id: String):Observable<Wallet>{
    return this._http.get<Wallet>(this.url+ '/admin/getwalletbyid/'+ id)
  }

  getWalletByClient(id: String):Observable<Wallet>{
    return this._http.get<Wallet>(this.url+ '/admin/getwallet/'+ id)
  }

  updateWalletAmount(data: any, id: String):Observable<Wallet>{
    return this._http.patch<Wallet>(this.url+ '/admin/updatebalance/'+ id, data)
  }

  editCashIn(id : String, arrayId: String, data : any): Observable<Wallet>{
    return this._http.patch<Wallet>(this.url +'/admin/updatecashin/'+ id + '/' + arrayId, data)
  }

  deleteCashIn(id : String, arrayId: String): Observable<Wallet>{
    return this._http.delete<Wallet>(this.url +'/admin/deletecashin/'+ id + '/' + arrayId)
  }

  updateWallet(id : String, data : any): Observable<Wallet>{
    return this._http.patch<Wallet>(this.url +'/admin/updatewallet/'+ id, data)
  }

  deleteWallet(id : String): Observable<Wallet>{
    return this._http.delete<Wallet>(this.url +'/admin/deletewallet/'+ id)
  }
  //LEAVE
  markLeave(data : any){
    return this._http.post(this.url+ '/admin/leave', data)
  }

  getLeave(): Observable<Leaves[]>{
    return this._http.get<Leaves[]>(this.url+'/admin/leave')
  }

  getLeaveById(id:string): Observable<Leaves>{
    return this._http.get<Leaves>(this.url+'/admin/leave/'+ id)
  }

  editLeave(data : any, id : String):Observable<Leaves>{
    return this._http.patch<Leaves>(this.url+'/admin/leave/'+ id, data)
  }

  deleteLeave(id : String){
    return this._http.delete(this.url+'/admin/leave/'+id)
  }

  updateLeaveStatus( data: any,id: string): Observable<Leaves> {
    return this._http.patch<Leaves>(this.url + '/admin/clientleavestatusupdate/' + id, data);
  }

  addLmc(data : any){
    return this._http.post(this.url+ '/admin/lmc', data)
  }

  getLmc(): Observable<Lmc[]>{
    return this._http.get<Lmc[]>(this.url+ '/admin/lmc')
  }

  getLmcById(id: String): Observable<Lmc>{
    return this._http.get<Lmc>(this.url+ '/admin/lmc/'+id)
  }

  updateLmc(data : any, id : String):Observable<Lmc>{
    return this._http.patch<Lmc>(this.url + '/admin/lmc/'+id, data)
  }

  updateLmcFeeStatus(data : any, id : String):Observable<Lmc>{
    return this._http.patch<Lmc>(this.url + '/admin/lmcstatusupdate/'+id, data)
  }

  updateLmcFeeMedical(id : String, data : any, ):Observable<Lmc>{
    return this._http.patch<Lmc>(this.url + '/admin/medicalfeeupdate/'+id, data)
  }

  deleteLmc(id : String){
    return this._http.delete(this.url+'/admin/lmc/'+id)
  }

  editAmi(id : String, arrayId: String, data : any): Observable<Lmc>{
    return this._http.patch<Lmc>(this.url +'/admin/updateami/'+ id + '/' + arrayId, data)
  }

  addPendingFee(data : any){
    return this._http.post(this.url +'/admin/pendingfee', data)
  }

  getPendingFee(): Observable<PendingFees[]>{
    return this._http.get<PendingFees[]>(this.url+'/admin/pendingfee')
  }

  getPendingFeeById(id: string): Observable<PendingFees>{
    return this._http.get<PendingFees>(this.url+'/admin/pendingfee/' + id)
  }

  updatePaymentDate(id: String, data: any): Observable<FeeMaster>{
    return this._http.patch<FeeMaster>(this.url+'/admin/feemasterupdate/'+id, data)
  }

  updatePaymentDateLmc(id: String, data: any): Observable<FeeMaster>{
    return this._http.patch<FeeMaster>(this.url+'/admin/feemasterupdatelmc/'+id, data)
  }

  updatePendingFees(id: string, data: any): Observable<PendingFees>{
    return this._http.patch<PendingFees>(this.url+'/admin/pendingfeeupdate/'+id, data)
  }

  deletePendingFees(id: string){
    return this._http.delete(this.url+'/admin/pendingfee/'+id)
  }

  addLeaveSession(data : any){
    return this._http.post(this.url+ '/admin/leavesession', data)
  }

  getLeaveSession(): Observable<LeaveSession[]>{
    return this._http.get<LeaveSession[]>(this.url+'/admin/leavesession')
  }

  getLeaveSessionById(id : String): Observable<LeaveSession>{
    return this._http.get<LeaveSession>(this.url+'/admin/leavesession/'+id)
  }

  getLeaveSessionByLmc(id : String): Observable<LeaveSession[]>{
    return this._http.get<LeaveSession[]>(this.url+'/admin/leavesessionbylmc/'+id)
  }

  getLeaveSessionBySlotId(id : String): Observable<LeaveSession>{
    return this._http.get<LeaveSession>(this.url+'/admin/leavesessionbyslot/'+id)
  }

  updateLeaveSession(data: any, id: string): Observable<LeaveSession>{
    return this._http.patch<LeaveSession>(this.url+'/admin/leavesession/'+id, data)
  }

  deleteLeaveSession(id: string){
    return this._http.delete(this.url+'/admin/leavesession/'+id)
  }

  updateLeaveSessionStatue(id: string, data: any): Observable<LeaveSession>{
    return this._http.patch<LeaveSession>(this.url+'/admin/leavesessionstatus/'+id, data)
  }

  // GROUP SESSION

  addGroupSession(data: any){
    return this._http.post(this.url+'/admin/groupsession', data);
  }

  getGroupSession():Observable<GroupSession[]>{
    return this._http.get<GroupSession[]>(this.url+'/admin/groupsession');
  }

  getGroupSessionById(id: String):Observable<GroupSession>{
    return this._http.get<GroupSession>(this.url+'/admin/groupsession/' + id);
  }

  updateTherapistGroup(id: string, data: any):Observable<GroupSession>{
    return this._http.patch<GroupSession>(this.url+'/admin/groupsession/therapist/' + id, data);
  }

  updateClientGroup(id: string, data: any):Observable<GroupSession>{
    return this._http.patch<GroupSession>(this.url+'/admin/groupsession/client/' + id, data);
  }

  deleteGroupSession(id: string){
    return this._http.delete(this.url+'/admin/groupsession/'+id)
  }

  addGroupMaster(data: any){
    return this._http.post(this.url+'/admin/groupsessionmaster', data);
  }

  getGroupMaster():Observable<GroupMaster[]>{
    return this._http.get<GroupMaster[]>(this.url+'/admin/groupsessionmaster');
  }

  getGroupMasterById(id: string):Observable<GroupMaster>{
    return this._http.get<GroupMaster>(this.url+'/admin/groupsessionmaster/' + id);
  }

  updateTherapistGroupMasterById(id: string, data: any):Observable<GroupMaster>{
    return this._http.patch<GroupMaster>(this.url+'/admin/groupsessionmaster/therapist/' + id, data);
  }

  updateClientGroupMasterById(id: string, data: any):Observable<GroupMaster>{
    return this._http.patch<GroupMaster>(this.url+'/admin/groupsessionmaster/client/' + id, data);
  }

  updateGroupFeeStatus(id: string, clientNameId: string, data: any):Observable<GroupMaster>{
    return this._http.patch<GroupMaster>(this.url+'/admin/updatestatus/' + id +'/' + clientNameId, data);
  }

  payGroupFees(data  : any){
    return this._http.post(this.url+'/admin/groupfeemaster', data)
  }

  getPayedGroupFees():Observable<GroupFeeMaster[]>{
    return this._http.get<GroupFeeMaster[]>(this.url+'/admin/groupfeemaster')
  }

  updateGroupPaymentDate(id: String, data: any): Observable<FeeMaster>{
    return this._http.patch<FeeMaster>(this.url+'/admin/groupfeemasterupdate/'+id, data)
  }

  //----------------------------------THERAPIST LEAVE------------------------------
  getTherapistLeave(): Observable<TherapistLeave[]>{
    return this._http.get<TherapistLeave[]>(this.url+'/therapist/therapistLeave')
  }

  getTherapistLeaveById(id:string): Observable<TherapistLeave>{
    return this._http.get<TherapistLeave>(this.url+'/therapist/therapistLeave/'+ id)
  }

  updateTherapistLeave( data: any,id: string): Observable<TherapistLeave> {
    return this._http.patch<TherapistLeave>(this.url + '/therapist/therapistLeave/' + id, data);
  }

  updateTherapistLeaveStatus( data: any,id: string): Observable<TherapistLeave> {
    return this._http.patch<TherapistLeave>(this.url + '/therapist/therapistLeavestatusupdate/' + id, data);
  }

  deleteTherapistLeave(id : String){
    return this._http.delete(this.url+'/therapist/therapistLeave/'+id)
  }

  //COMPENSATION SESSION
  addCompensation(data: any){
    return this._http.post(this.url+'/therapist/compensationsession', data)
  }

  //DAILY EXPENSE
  addDailyExpense(data: any){
    return this._http.post(this.url+'/admin/dailyexpense', data);
  }

  getDailyExpense():Observable<DailyExpense[]>{
    return this._http.get<DailyExpense[]>(this.url+'/admin/dailyexpense');
  }

  getDailyExpenseById(id: String):Observable<DailyExpense>{
    return this._http.get<DailyExpense>(this.url+'/admin/dailyexpense/' + id);
  }

  updateDailyExpense(data: any, id: string):Observable<DailyExpense>{
    return this._http.patch<DailyExpense>(this.url+'/admin/dailyexpense/' + id, data);
  }

  deleteDailyExpense(id: string){
    return this._http.delete(this.url+'/admin/dailyexpense/'+id)
  }

  getDailyExpenseBydate(data: any):Observable<DailyExpense[]>{
    const queryParams = new HttpParams()
        .set('startDate', data.startDate)
        .set('endDate', data.endDate);
    return this._http.get<DailyExpense[]>(this.url+'/admin/filteredexpense', { params: queryParams });
  }

  //CELEBRATION
  getClebrationBuUserId(id: string): Observable<Celebrations>{
    return this._http.get<Celebrations>(this.url+'/celebration/userid/'+id)
  }

  getClebrations(): Observable<Celebrations[]>{
    return this._http.get<Celebrations[]>(this.url+'/celebration')
  }

  getSalary(data: any):Observable<any>{
    return this._http.post<any>(this.url+'/admin/getsalary', data)
  }

  getAssessmentSalary(data: any):Observable<any>{
    return this._http.post<any>(this.url+'/admin/assesmentsalary', data)
  }

  getLmcSalary(data: any):Observable<any>{
    return this._http.post<any>(this.url+'/admin/getsalary', data)
  }


  addAdminLeave(data: any){
    return this._http.post(this.url+'/admin/adminLeave', data);
  }

  getAdminLeave():Observable<AdminLeave[]>{
    return this._http.get<AdminLeave[]>(this.url+'/admin/adminLeave');
  }

  getAdminLeaveById(id: string):Observable<AdminLeave>{
    return this._http.get<AdminLeave>(this.url+'/admin/adminLeave/' + id);
  }

  updateAdminLeave(data: any, id: string):Observable<AdminLeave>{
    return this._http.patch<AdminLeave>(this.url+'/admin/adminLeave/' + id, data);
  }

  // COMPANY
  addCompany(data:any){
    return this._http.post(this.url+'/company/addcompany',data);
  }

  getCompany():Observable<Company[]>{
    return this._http.get<Company[]>(this.url+'/company/company');
  }

  getCompanyById(id: string):Observable<Company>{
    return this._http.get<Company>(this.url+'/company/company/'+id);
  }

  updateCompany(data: any, id: string):Observable<Company>{
    return this._http.patch<Company>(this.url+'/company/company/' + id, data);
  }

  addWl(data: any){
    return this._http.post(this.url+'/waitinglist', data);
  }

  deleteWlBySession(id: string){
    return this._http.delete(this.url+'/waitinglist/bysession/'+ id );
  }

  deleteWlByAssessment(id: string){
    return this._http.delete(this.url+'/waitinglist/byassessment/'+ id );
  }

  getWl():Observable<WaitingList[]>{
    return this._http.get<WaitingList[]>(this.url+'/waitinglist');
  }

  getWlBySession(id: String):Observable<WaitingList>{
    return this._http.get<WaitingList>(this.url+'/waitinglist/bysession/'+id);
  }

  getWlByAssessment(id: String):Observable<WaitingList>{
    return this._http.get<WaitingList>(this.url+'/waitinglist/byassessment/'+id);
  }

  deleteCompany(id: string):Observable<Client>{
    return this._http.delete<Client>(this.url+'/company/company/'+ id);
  }


}
