import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor (private authService: AuthService) {}

    intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isLogged = this.authService.verifyAuthorization();

        if (isLogged) {
            const authToken = this.authService.getToken();
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`
                }
            });
        }

        return next.handle(request);
    }
}
