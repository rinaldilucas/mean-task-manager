import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedInAuthGuard {
    constructor (private authService: AuthService, private router: Router) { }

    canActivate (): boolean {
        if (this.authService.getIsAuthenticated()) {
            this.router.navigate(['tasks']);
            return false;
        } else {
            return true;
        }
    }
}
