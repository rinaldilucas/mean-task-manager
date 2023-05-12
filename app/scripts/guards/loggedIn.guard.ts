import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedInAuthGuard {
    constructor (private authService: AuthService, private router: Router) { }

    canActivate (): void {
        if (this.authService.getIsAuthenticated()) {
            this.router.navigate(['tasks']);
        }
    }
}
