import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private translateService: TranslateService) {}

    canActivate(route: ActivatedRouteSnapshot) {
        const currentUser = this.authService.getLoggedUser();
        const expectedRole = route.data['expectedRole'];

        if (currentUser.role === expectedRole) return true;

        this.translateService.get('messages.user-without-permission').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
        this.router.navigate(['/tasks']);
        return false;
    }
}
