import { SeAssessment } from './models/seAssessmentForm';
import { StAssessmentForm } from './models/stAssessmentForm';
import { OtAssessment } from './models/otAssessmentForm';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from '../admin/models/client';
import { Session } from '../admin/models/session';
import { OtSessionData } from './models/otSessionData';
import { SeGoal } from './models/seGoal';
import { SeDatas, SeSessionData } from './models/seSessionData';
import { SessionMaster } from './models/sessionMaster';
import { StSessionData } from './models/stSessionData';
import {  map, ReplaySubject } from 'rxjs';
import { StSkill } from './models/stSkill';
import { environment } from 'src/environments/environment';
import { BtSessionData } from './models/btSessionData';
import { AssessmentMaster } from './models/assessmentMaster';
import { OtAssessmentFormComponent } from './components/AssessmentForms/ot-assessment-form/ot-assessment-form.component';
import { BtAssessmentForm } from './models/btAssessmentForm';
import { Fees } from '../admin/models/fees';
import { Assessment } from '../admin/models/assessment';
import { CompensationSession } from '../admin/models/compensation';
import { Goal } from './models/goal';
import { Activity } from './models/activity';

@Injectable({
  providedIn: 'root'
})
export class TherapistService {

  private sessionId = new BehaviorSubject('sessionid');
  $currentSessionId = this.sessionId.asObservable();



  url = environment.baseUrl


  constructor(private _http:HttpClient) { }

  updateSessionId(sessionId: string) {
    this.sessionId.next(sessionId)
  }

  updateSessionStatus(id: String, data: any) : Observable<Session>{
    return this._http.patch<Session>(this.url +'/admin/su/'+ id, data)
  }

  updateAssessmentStatus(id: String, data: any) : Observable<Assessment>{
    return this._http.patch<Assessment>(this.url +'/admin/assessmentstatusupdate/'+ id, data)
  }

  manageAssessement(data:any){
    return this._http.post(this.url+'/therapist/manageassessment',data);
  }

  therapistAssessment(data:any){
    return this._http.patch(this.url+'/therapist/manageassessment',data)
  }

  getClients():Observable<Client[]>{
    return this._http.get<Client[]>(this.url+'/client');
  }

  getSessionInfo(id:String):Observable<Session[]>{
    return this._http.get<Session[]>(this.url+'/admin/session/'+id);
  }

  getSession():Observable<Session[]>{
    return this._http.get<Session[]>(this.url+'/admin/session');
  }

  // SESSION MASTER
   createSessionMaster(data:any){
    return this._http.post(this.url+'/therapist/sessionmaster',data);
  }

  getSessionMaster():Observable<SessionMaster[]>{
    return this._http.get<SessionMaster[]>(this.url+'/therapist/sessionmaster');
  }

  getSessionMasterbyId(id:String):Observable<SessionMaster>{
    return this._http.get<SessionMaster>(this.url+'/therapist/sessionmaster/'+id);
  }

  updateSessionFees(id : String, data : any): Observable<SessionMaster>{
    return this._http.patch<SessionMaster>(this.url+'/therapist/feeupdate/' + id, data)
  }
  // OT FORM
  saveOtForm(data:any){
    return this._http.post(this.url+'/therapist/otsessiondata', data)
  }

  getOtSessionData():Observable<OtSessionData[]>{
    return this._http.get<OtSessionData[]>(this.url+'/therapist/otsessiondata')
  }

  getOtSessionDatabyId(id:String):Observable<OtSessionData>{
    return this._http.get<OtSessionData>(this.url+'/therapist/otsession/'+id)
  }

  getOtSessionDataId(id:String):Observable<OtSessionData>{
    return this._http.get<OtSessionData>(this.url+'/therapist/otsessiondata/'+id)
  }

  editOtSessionData(data:any, id:String):Observable<OtSessionData>{
    return this._http.patch<OtSessionData>(this.url+'/therapist/otsessiondata/'+id, data)
  }

  // ST FORM
  addStSkill(data:any){
    return this._http.post(this.url+'/therapist/addstskill',data);
  }

  getStSkillBySessionId(id):Observable<StSkill[]>{
    return this._http.get<StSkill[]>(this.url+'/therapist/stskill/'+id);
  }

  filteredStSkillBySessionId(id):Observable<StSkill[]>{
    return this._http.get<StSkill[]>(this.url+'/therapist/filterstskill/'+id);
  }

  editStSkill(data:any, id:String):Observable<SeGoal>{
    return this._http.patch<SeGoal>(this.url+'/therapist/stskill/'+id, data);
  }

  deleteStSkill(id:String){
    return this._http.delete(this.url+'/therapist/stskill/'+id);
  }

  saveStForm(data:any){
    return this._http.post(this.url+'/therapist/stsessiondata', data)
  }

  updateStForm(data:any){
    return this._http.patch(environment.baseUrl+'/therapist/stdatas',data)
  }

  getStSessionData():Observable<StSessionData[]>{
    return this._http.get<StSessionData[]>(this.url+'/therapist/stsessiondata')
  }

  getStSessionDatabyId(id:String):Observable<StSessionData>{
    return this._http.get<StSessionData>(this.url+'/therapist/stsession/'+id)
  }

  getStSessionDataId(id:String):Observable<StSessionData>{
    return this._http.get<StSessionData>(this.url+'/therapist/stsessiondata/'+id)
  }

  editStSessionData(data:any, id:String):Observable<StSessionData>{
    return this._http.patch<StSessionData>(this.url+'/therapist/stsessiondata/'+id, data)
  }

  updateStDataForm(data:any){
    return this._http.patch(this.url+'/therapist/stdatas',data)
  }


  // SE FORM
  addSeGoal(data:any){
    return this._http.post(this.url+'/therapist/addsegoal',data);
  }

  getSeGoal():Observable<SeGoal[]>{
    return this._http.get<SeGoal[]>(this.url+'/therapist/segoal');
  }

  getSeGoalBySessionId(id):Observable<SeGoal[]>{
    return this._http.get<SeGoal[]>(this.url+'/therapist/segoal/'+id);
  }

  filteredSeGoalBySessionId(id):Observable<SeGoal[]>{
    return this._http.get<SeGoal[]>(this.url+'/therapist/filtersegoal/'+id);
  }

  updateSeGoalStatus(data:any, id:any){
    return this._http.patch(this.url+'/therapist/segoalupdate/'+id,data)
  }

  editSeGoal(data:any, id:String):Observable<SeGoal>{
    return this._http.patch<SeGoal>(this.url+'/therapist/segoal/'+id, data);
  }

  deleteSeGoal(id:String){
    return this._http.delete(this.url+'/therapist/segoal/'+id);
  }

  saveSeForm(data:any){
    return this._http.post(this.url+'/therapist/sesessiondata', data)
  }

  getSeSessionData():Observable<SeSessionData[]>{
    return this._http.get<SeSessionData[]>(this.url+'/therapist/sesessiondata')
  }

  getSeSessionDatabyId(id:String):Observable<SeSessionData>{
    return this._http.get<SeSessionData>(this.url+'/therapist/sesession/'+id)
  }

  getSeSessionDataId(id:String):Observable<SeSessionData>{
    return this._http.get<SeSessionData>(this.url+'/therapist/sesessiondata/'+id)
  }

  getSeData(seId: String, arrayId: String):Observable<SeDatas>{
    return this._http.get<SeDatas>(this.url+'/therapist/sedata/' + seId + '/' + arrayId)
  }

  editSeSessionData(data:any, seId:String, arrayId:String):Observable<SeSessionData>{
    return this._http.patch<SeSessionData>(this.url+'/therapist/upadatese/'+ seId +'/'+ arrayId, data)
  }

  //BT FORM

  saveBtForm(data:any){
    return this._http.post(this.url+'/therapist/btsessiondata', data)
  }

  getBtSessionData():Observable<BtSessionData[]>{
    return this._http.get<BtSessionData[]>(this.url+'/therapist/btsessiondata')
  }

  getBtSessionDatabyId(id:String):Observable<BtSessionData>{
    return this._http.get<BtSessionData>(this.url+'/therapist/btsession/'+id)
  }

  getBtSessionDataId(id:String):Observable<BtSessionData>{
    return this._http.get<BtSessionData>(this.url+'/therapist/btsessiondata/'+id)
  }

  editBtSessionData(data:any, id:String):Observable<BtSessionData>{
    return this._http.patch<BtSessionData>(this.url+'/therapist/btsessiondata/'+id, data)
  }

  // ASSESSMENT MASTER
  createAssessmentMaster(data:any){
    return this._http.post(this.url+'/therapist/assessmentmaster',data);
  }

  getAssessmentMaster():Observable<AssessmentMaster[]>{
    return this._http.get<AssessmentMaster[]>(this.url+'/therapist/assessmentmaster');
  }

  getAssessmentMasterbyId(id:String):Observable<AssessmentMaster>{
    return this._http.get<AssessmentMaster>(this.url+'/therapist/assessmentmaster/'+id);
  }

  // ST ASSESSMENT FORM

  saveStAssessmentForm(data:any){
    return this._http.post(this.url+'/therapist/stassessmentform', data)
  }

  getStAssessmentForm():Observable<StAssessmentForm[]>{
    return this._http.get<StAssessmentForm[]>(this.url+'/therapist/stassessmentform')
  }

  getStAssessmentFormbyId(id:String):Observable<StAssessmentForm>{
    return this._http.get<StAssessmentForm>(this.url+'/therapist/stassessment/'+id)
  }

  getStAssessmentId(id:String):Observable<StAssessmentForm>{
    return this._http.get<StAssessmentForm>(this.url+'/therapist/stassessmentform/'+id)
  }

  editStAssessmentForm(data:any, id:String):Observable<StAssessmentForm>{
    return this._http.patch<StAssessmentForm>(this.url+'/therapist/stassessmentform/'+id, data)
  }
  // OT ASSESSMENT FORM

  saveOtAssessmentForm(data:any){
    return this._http.post(this.url+'/therapist/otassessmentform', data)
  }

  getOtAssessmentForm():Observable<OtAssessment[]>{
    return this._http.get<OtAssessment[]>(this.url+'/therapist/otassessmentform')
  }

  getOtAssessmentFormbyId(id:String):Observable<OtAssessment>{
    return this._http.get<OtAssessment>(this.url+'/therapist/otassessment/'+id)
  }

  getOtAssessmentFormbyClientId(id:String):Observable<OtAssessment>{
    return this._http.get<OtAssessment>(this.url+'/therapist/otassessment/byclient/'+id)
  }

  getOtAssessmentId(id:String):Observable<OtAssessment>{
    return this._http.get<OtAssessment>(this.url+'/therapist/otassessmentform/'+id)
  }

  editOtAssessmentForm(data:any, id:String):Observable<OtAssessment>{
    return this._http.patch<OtAssessment>(this.url+'/therapist/otassessmentform/'+id, data)
  }

  // SE ASSESSMENT FORM

  saveSeAssessmentForm(data:any){
    return this._http.post(this.url+'/therapist/seassessmentform', data)
  }

  getSeAssessmentForm():Observable<SeAssessment[]>{
    return this._http.get<SeAssessment[]>(this.url+'/therapist/seassessmentform')
  }

  getSeAssessmentFormbyId(id:String):Observable<SeAssessment>{
    return this._http.get<SeAssessment>(this.url+'/therapist/seassessment/'+id)
  }

  getSeAssessmentId(id:String):Observable<SeAssessment>{
    return this._http.get<SeAssessment>(this.url+'/therapist/seassessmentform/'+id)
  }

  editSeAssessmentForm(data:any, id:String):Observable<SeAssessment>{
    return this._http.patch<SeAssessment>(this.url+'/therapist/seassessmentform/'+id, data)
  }

  // BT ASSESSMENT FORM

  saveBtAssessmentForm(data:any){
    return this._http.post(this.url+'/therapist/btassessmentform',data)
  }
  getBtAssessmentForm():Observable<BtAssessmentForm[]>{
    return this._http.get<BtAssessmentForm[]>(this.url+'/therapist/btassessmentform')
  }

  getBtAssessmentFormbyId(id:String):Observable<BtAssessmentForm>{
      return this._http.get<BtAssessmentForm>(this.url+'/therapist/btassessment/'+id)
  }

  getBtAssessmentId(id:String):Observable<BtAssessmentForm>{
      return this._http.get<BtAssessmentForm>(this.url+'/therapist/btassessmentform/'+id)
  }

  editBtAssessmentForm(data:any, id:String):Observable<BtAssessmentForm>{
      return this._http.patch<BtAssessmentForm>(this.url+'/therapist/btassessmentform/'+id, data)
  }

  getFees():Observable<Fees>{
    return this._http.get<Fees>(this.url+'/admin/fees')
  }
  //-----------------------THERAPIST LEAVE-----------------------------------------
  addTherapistLeaves(data:any){
    return this._http.post(this.url+'/therapist/therapistLeave', data)
  }


  //COMPENSATION SESSION
  addCompensation(data: any){
    return this._http.post(this.url+'/therapist/compensationsession', data);
  }

  getCompensation():Observable<CompensationSession[]>{
    return this._http.get<CompensationSession[]>(this.url+'/therapist/compensationsession')
  }

  getCompensationById(id:string):Observable<CompensationSession>{
    return this._http.get<CompensationSession>(this.url+'/therapist/compensationsession/'+ id)
  }

  editCompensation(data:any, id:String):Observable<CompensationSession>{
    return this._http.patch<CompensationSession>(this.url+'/therapist/compensationsession/'+id, data)
  }

  deleteCompSession(id: string){
    return this._http.delete(this.url+'/therapist/compensationsession/'+id)
  }
  //ACTIVITY

  addActivity(data: any){
    return this._http.post(this.url+'/therapist//activity' , data)
  }

  updateActivityStatus(activityId: string, data: any) {
    return this._http.patch(`http://localhost:8000/therapist/activitystatus/${activityId}`, data);
  }

  getActivity():Observable<Activity[]> {
    return this._http.get<Activity[]>(this.url+'/activity')
  }

  getActivitybyId(id:String):Observable<Activity>{
    return this._http.get<Activity>(this.url+'/therapist/activity/'+id)
  }


  editActivity( id:any ,data:any):Observable<Activity>{
    return this._http.patch<Activity>(this.url+'/therapist/activity/'+id, data)
  }

  getActivityBySessionMasterId(smId: any) {
    return this._http.get<Activity>(this.url + '/therapist/activity/' + smId);
  }
  
  // GOAL

  addGoal(data: any){
    return this._http.post(this.url+'/goal', data);
  }

  getGoal():Observable<Goal[]>{
    return this._http.get<Goal[]>(this.url+'/goal')
  }

  getGoalById(id:string):Observable<Goal>{
    return this._http.get<Goal>(this.url+'/goal/'+ id)
  }

  getGoalByClientId(id:string):Observable<Goal[]>{
    return this._http.get<Goal[]>(this.url+'/goal/clientid/'+ id)
  }

  editGoal(data:any, id:String):Observable<Goal>{
    return this._http.patch<Goal>(this.url+'/goal/'+id, data)
  }

  deleteGoal(id: string){
    return this._http.delete(this.url+'/goal/'+id)
  }

  editGoalProgress(data:any, id:string, goalId: string):Observable<Goal>{
    return this._http.patch<Goal>(this.url+'/goal/upadategoal/'+ id +'/'+ goalId, data)
  }

  addNewGoal(data:any, id:string):Observable<Goal>{
    return this._http.patch<Goal>(this.url+'/goal/addnewgoal/'+ id, data)
  }

  savePtForm(data:any){
    return this._http.post(this.url+'/ptform', data)
  }

  getPtSessionData():Observable<OtSessionData[]>{
    return this._http.get<OtSessionData[]>(this.url+'/ptform')
  }

  getPtSessionDatabyId(id:String):Observable<OtSessionData>{
    return this._http.get<OtSessionData>(this.url+'/ptform/'+id)
  }

  getPtSessionDataId(id:String):Observable<OtSessionData>{
    return this._http.get<OtSessionData>(this.url+'/ptform/'+id)
  }

  editPtSessionData(data:any, id:String):Observable<OtSessionData>{
    return this._http.patch<OtSessionData>(this.url+'/ptform/'+id, data)
  }


}

//PT FORM

