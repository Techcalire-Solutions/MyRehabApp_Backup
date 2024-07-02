import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  catchError, map, mapTo, of, ReplaySubject, startWith, tap } from 'rxjs';
import { User } from './models/User';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private readonly token = 'token'
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN'
  private loggedUser: any

  constructor(private _http:HttpClient) { }

  private  currentUserSource = new ReplaySubject<User>(1)

  currentUser$ = this.currentUserSource.asObservable().pipe(
    startWith()
  );

  url = environment.baseUrl

  saveUser(data:any){
    return this._http.post(this.url+'/user/register',data)
  }

  login(data: any){
    return this._http.post(this.url + '/user/login', data)
    .pipe(
      tap((tokens) => this.doLoginUser(data.email, tokens)),
      mapTo(true),
      catchError((error: any) => {
        console.log(error)
        return of(false)
      })
    )
  }

  clientLogin(data: any){
    return this._http.post(this.url + '/clientlogin/login', data)
    .pipe(
      tap((tokens) => this.doLoginUser(data.email, tokens)),
      mapTo(true),
      catchError((error: any) => {
        console.log(error)
        return of(false)
      })
    )
  }

  private doLoginUser(userName: String, tokens: any){
   
    this.storeTokens(tokens)
  }

  private storeTokens(tokens: any){
    localStorage.setItem(this.JWT_TOKEN, tokens.token.accessToken)

    localStorage.setItem('token', JSON.stringify(tokens))
  }

  getJwtToken(){
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn(): boolean{
    let loggedStatus = this.getJwtToken()
    return !!this.getJwtToken();
  }

  logout(){
    localStorage.clear()
    // localStorage.removeItem(this.JWT_TOKEN);
    // localStorage.removeItem(this.REFRESH_TOKEN);
    // localStorage.removeItem(this.token);
    // return this._http.post(this.url + '/logout', {
    //   'refreshToken': this.getRefreshToken()
    // }).pipe(
    //   tap((tokens) => this.doLogoutUser()),
    //   mapTo(true),
    //   catchError((error: any) => {
    //     alert(error.error)
    //     return of(false)
    //   })
    // )

  }

  getConcessionCategory(){
    return this._http.get(this.url + '/admin/concessioncount')
  }

 
}
