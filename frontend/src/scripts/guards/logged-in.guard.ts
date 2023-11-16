import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedInAuthGuard {
  private authService = this.injector.get(AuthService);

  constructor(
    private injector: Injector,
    private router: Router,
  ) {}

  canActivate(): void {
    if (this.authService.getIsAuthenticated()) {
      this.router.navigate(['tasks']);
    }
  }
}
