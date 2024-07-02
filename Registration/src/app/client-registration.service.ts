import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, observable } from 'rxjs';
import { Client } from './models/client';
@Injectable({
  providedIn: 'root'
})
export class ClientRegistrationService {
  updateRoutineForm(data: { routine: { clientid: string; toiletingAndBath: unknown; toiletTrained: unknown; dayAndNight: unknown;toiletNight: unknown, accidents: unknown; toiletPaperUse: unknown; managingClothing: unknown; washingHands: unknown; toiletRemarks:unknown; bathingAndBrushing: unknown; typicalNightSleep: unknown; typicalWakeup: unknown; homework: unknown; routineStrategies: unknown; difficultSituation: unknown; howYouKnowAboutUs: unknown; }; }) {
    throw new Error('Method not implemented.');
  }
  // url = 'http://localhost:8000/client'
  private baseUrl:String = "";

  constructor(private _http:HttpClient) {
    this.baseUrl = environment.baseUrl
  }

  saveClient(data:any){
    return this._http.post(environment.baseUrl+'/client',data)
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
  
  uploadImage(file):Observable<any>{
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post(environment.baseUrl+'/client/fileupload',formData);
  }
  
  getClients():Observable<Client[]>{
    return this._http.get<Client[]>(environment.baseUrl+'/client');
  }


}


