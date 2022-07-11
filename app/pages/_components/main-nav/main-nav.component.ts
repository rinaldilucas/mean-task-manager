import { Component, ChangeDetectorRef, OnInit, HostBinding } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

import { AuthService } from '@app/scripts/services/auth.service';
import { TaskService } from '@app/scripts/services/task.service';
import { UserService } from '@app/scripts/services/user.service';

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
    @HostBinding('class') className = '';
    time = new Date();
    opened: boolean;
    isLogged = false;
    toggleTheme = new FormControl(false);

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map((result) => result.matches),
        shareReplay(),
    );

    constructor(
        private translateService: TranslateService,
        private authService: AuthService,
        private breakpointObserver: BreakpointObserver,
        private snackBar: MatSnackBar,
        public taskService: TaskService,
        public userService: UserService,
        public changeDetector: ChangeDetectorRef,
        public router: Router,
        private overlay: OverlayContainer,
    ) {}

    ngOnInit(): void {
        setInterval(() => (this.time = new Date()), 1000);
        this.isLogged = this.authService.getIsAuth();
        this.authService.emitMenu.subscribe((result: boolean) => (this.isLogged = result));

        this.toggleTheme.valueChanges.subscribe((darkMode) => {
            const darkClassName = 'darkMode';
            this.className = darkMode ? darkClassName : '';
            if (darkMode) {
                this.overlay.getContainerElement().classList.add(darkClassName);
            } else {
                this.overlay.getContainerElement().classList.remove(darkClassName);
            }
        });
    }

    logout(): void {
        this.authService.logout();

        this.translateService.get('messages.user-logout').subscribe((text: string) => {
            let message = text;
            this.snackBar.open(message, undefined, { duration: 5000 });
        });
    }

    changeLanguage(language: string): void {
        this.translateService.use(language);

        this.translateService.get('messages.language-changed').subscribe((text: string) => {
            let message = text;
            this.snackBar.open(message, undefined, { duration: 5000 });
        });
    }

    changeTheme(): void {}
}
