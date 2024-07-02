import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientLogin } from './models/client-login';
import { Task } from './models/task';

@Injectable({
  providedIn: 'root'
})
export class ParentService {

  url = environment.baseUrl

  constructor(private _http:HttpClient) { }

  addTask(data:any){
    return this._http.post(this.url+'/therapist/task',data);
  }

  getTask(): Observable<Task[]>{
    return this._http.get<Task[]>(this.url+'/therapist/task');
  }

  getTaskById(id: string): Observable<Task>{
    return this._http.get<Task>(this.url+'/therapist/task/'+ id);
  }

  getClientLogin(id: string): Observable<ClientLogin>{
    return this._http.get<ClientLogin>(this.url+'/clientlogin/getclient/'+id);
  }

  uploadTask(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/therapist/taskfileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  updateTask(data:any, id:any, taskid: any){
    return this._http.patch(this.url+'/therapist/starttask/' + id + '/' + taskid, data)
  }

  updateTaskStatus(data:any, id:any, taskId: any){
    return this._http.patch(this.url+'/therapist/taskstatus/' + id + '/' + taskId, data)
  }

  reviewTask(data:any, id:any, taskid: any){
    return this._http.patch(this.url+'/therapist/reviewtask/' + id + '/' + taskid, data)
  }

  updateStatus(data:any, id:any){
    return this._http.patch(this.url+'/therapist/status/' + id, data)
  }

  updateClientLogin(id: string, clientId: string, data:any){
    return this._http.patch<ClientLogin>(this.url+'/clientlogin/client/'+ id + '/' + clientId, data);
  }

  uploadImage(file: Blob): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/admin/fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }
}
