import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.getLoggedUser();
    const expectedRole = route.data.expectedRole;

    if (currentUser.role === expectedRole) return true;

    this.sharedService.handleSnackbars({ translationKey: 'messages.user-without-permission', error: true });
    this.router.navigate(['tasks']);
    return false;
  }
}
