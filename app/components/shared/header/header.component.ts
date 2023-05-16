import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '@services/auth.service';
import { TaskService } from '@services/task.service';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
    time = new Date();
    opened!: boolean;
    isLogged = false;
    toggleTheme = new FormControl(false);
    subscriptions: Subscription[] = [];

    isDesktop$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.WebLandscape).pipe(
        map((result) => result.matches),
        shareReplay()
    );

    constructor (
        private authService: AuthService,
        private breakpointObserver: BreakpointObserver,
        public taskService: TaskService,
        public userService: UserService,
        public changeDetector: ChangeDetectorRef,
        public router: Router
    ) {}

    ngOnInit (): void {
        setInterval(() => (this.time = new Date()), 1000);
        this.isLogged = this.authService.getIsAuthenticated();
        this.subscriptions.push(this.authService.emitMenu.subscribe((result: boolean) => {
            this.isLogged = result;
            this.changeDetector.detectChanges();
        }));

        const darkClassName = 'dark-mode';
        const previousTheme = localStorage.getItem('theme') as string;
        if (previousTheme) {
            document.body.classList.add(darkClassName);
            this.toggleTheme = new FormControl(true);
        }

        this.subscriptions.push(this.toggleTheme.valueChanges.subscribe((enableDarkMode) => {
            if (enableDarkMode) {
                document.body.classList.add(darkClassName);
                localStorage.setItem('theme', darkClassName);
            } else {
                document.body.classList.remove(darkClassName);
                localStorage.removeItem('theme');
            }
        }));
    }

    logout (): void {
        this.authService.logoutAsync();
    }

    ngOnDestroy (): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }
}
