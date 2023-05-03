import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StatusCode } from 'status-code-enum';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor (private authService: AuthService) {}

    intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error) => {
                if (error.status === StatusCode.ClientErrorUnauthorized) {
                    const isUserPreviouslyLogged = !!localStorage.getItem('token');
                    if (isUserPreviouslyLogged) this.authService.logoutAsync();
                }
                return throwError(error);
            })
        );
    }
}
