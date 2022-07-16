import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { AuthService } from '@app/scripts/services/auth.service';
import { TaskService } from '@app/scripts/services/task.service';
import { UserService } from '@app/scripts/services/user.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavComponent implements OnInit {
    time = new Date();
    opened!: boolean;
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
        public taskService: TaskService,
        public userService: UserService,
        public changeDetector: ChangeDetectorRef,
        public router: Router,
        private sharedService: SharedService,
    ) {}

    ngOnInit(): void {
        setInterval(() => (this.time = new Date()), 1000);
        this.isLogged = this.authService.getIsAuth();
        this.authService.emitMenu.subscribe((result: boolean) => (this.isLogged = result));

        const darkClassName = 'darkMode';
        const previousTheme = localStorage.getItem('theme') as string;
        if (previousTheme) {
            document.body.classList.add(darkClassName);
            this.toggleTheme = new FormControl(true);
        }

        this.toggleTheme.valueChanges.subscribe((enableDarkMode) => {
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

    changeLanguage(language: string): void {
        this.translateService.use(language);
        localStorage.setItem('language', language);
        this.sharedService.handleSnackbarMessages('messages.language-changed');
    }
}
