import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

    canActivate(route: ActivatedRouteSnapshot) {
        const currentUser = this.authService.getLoggedUser();
        const expectedRole = route.data['expectedRole'];

        if (currentUser.role === expectedRole) {
            return true;
        }

        this.snackBar.open('User without permission.', undefined, { duration: 5000 });
        this.router.navigate(['/tasks']);
        return false;
    }
}
