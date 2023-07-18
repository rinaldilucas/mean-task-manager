import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import { Unsubscriber } from '@app/components/shared/unsubscriber.component';
import { routerTransition } from '@app/scripts/animations/router.animations';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  animations: [routerTransition],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends Unsubscriber implements OnInit {
  time = new Date();
  opened!: boolean;
  toggleTheme = new FormControl(false);
  isLogged = false;
  isDesktop = false;
  isSidebarIsOpened = false;
  sidebarSize = '1.81rem';

  isDesktop$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.WebLandscape).pipe(
    map((result) => result.matches),
    shareReplay(),
    tap((result: boolean) => {
      this.isDesktop = result;
    }),
  );

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private changeDetector: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    setInterval(() => (this.time = new Date()), 1000);
    this.isLogged = this.authService.getIsAuthenticated();
    this.isSidebarIsOpened = this.isLogged;

    this.subs.sink = this.authService.emitterMenu.subscribe((result: boolean) => {
      this.isLogged = result;
      this.changeDetector.markForCheck();
    });
    this.subs.sink = this.authService.sidebarEmitter.subscribe(() => {
      this.isSidebarIsOpened = !!(this.isDesktop && this.isLogged);
      this.changeDetector.markForCheck();
    });

    const darkClassName = 'dark-mode';
    const previousTheme = localStorage.getItem('theme') as string;
    if (previousTheme) {
      document.body.classList.add(darkClassName);
      this.toggleTheme = new FormControl(true);
    }

    this.subs.sink = this.toggleTheme.valueChanges.subscribe((enableDarkMode) => {
      if (enableDarkMode) {
        document.body.classList.add(darkClassName);
        localStorage.setItem('theme', darkClassName);
      } else {
        document.body.classList.remove(darkClassName);
        localStorage.removeItem('theme');
      }
    });
  }

  logout(): void {
    this.authService.logoutAsync();
  }

  getState(outlet: RouterOutlet): string {
    return outlet.activatedRouteData.state;
  }
}
