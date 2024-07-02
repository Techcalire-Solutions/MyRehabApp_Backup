import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getJwtToken()
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${myToken}`}
      })
    }
    return next.handle(request)
    .pipe(
      catchError((err: any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 403){
            localStorage.clear()
            this.router.navigate([''])
            // alert(err.error.message)
            // alert('Token is expired, Please login again...')
          }
        }
        return throwError(()=>{
          console.log(err)
          alert(err.error.message)
        })
      })
   );
  }
}
