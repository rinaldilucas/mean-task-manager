import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { IUser } from '@app/scripts/models/user.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { UserService } from '@app/scripts/services/user.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IJwtPayload } from '@app/scripts/models/jwtPayload.interface';
import { UtilService } from '@app/scripts/services/util.service';

@Component({
    selector: 'app-log-in',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnInit {
    form: FormGroup;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private titleService: Title,
        private snackBar: MatSnackBar,
        private router: Router,
        private translateService: TranslateService,
        private utilService: UtilService,
        private changeDetector: ChangeDetectorRef,
    ) {
        this.form = this.formBuilder.group({
            username: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
        });
    }

    ngOnInit(): void {
        this.utilService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());
        this.translateService.get('title.login').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
    }

    login(): void {
        if (!this.utilService.isValidForm(this.form)) return;

        const user = { ...this.form.value } as IUser;
        this.userService.authenticate(user.username, user.password).subscribe({
            next: (result: IQueryResult<IJwtPayload>) => {
                if (!result || !result.success) {
                    this.translateService.get('login.authentication-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    return;
                }

                if (this.authService.authenticateToken(result.data[0])) {
                    this.translateService.get('login.login-success').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    this.router.navigate([`${this.router.url.split(/\/(login)\/?/gi)[0]}/tasks`]);
                }
            },
            error: (error: IQueryResult<IUser>) => {
                if (error.status === StatusCode.ClientErrorNotFound) {
                    this.translateService.get('login.user-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    return;
                }
                if (error.status === StatusCode.ClientErrorForbidden) {
                    this.translateService.get('input.password-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    return;
                }
                if (error.status === StatusCode.ClientErrorUnauthorized) {
                    this.translateService.get('login.credentials-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    return;
                }
                this.translateService.get('login.authentication-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
            },
        });
    }
}
