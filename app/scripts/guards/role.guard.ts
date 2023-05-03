import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor (
        private authService: AuthService, //
        private router: Router,
        private sharedService: SharedService
    ) {}

    canActivate (route: ActivatedRouteSnapshot) {
        const currentUser = this.authService.getLoggedUser();
        const expectedRole = route.data['expectedRole'];

        if (currentUser.role === expectedRole) return true;

        this.sharedService.handleSnackbarMessages('messages.user-without-permission', false);
        this.router.navigate(['tasks']);
        return false;
    }
}
