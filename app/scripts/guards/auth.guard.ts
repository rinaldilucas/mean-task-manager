import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor (private authService: AuthService, private router: Router) {}

    canActivate (): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((resolve) => {
            if (this.authService.verifyAuthorization()) {
                resolve(true);
            } else {
                this.router.navigate(['login']);
                resolve(false);
            }
        });
    }
}
