import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({
    providedIn: 'root',
})
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((result) => {
            if (this.authService.verifyAuthorization()) {
                result(true);
            } else {
                this.router.navigate(['/login']);
                result(false);
            }
        });
    }
}
