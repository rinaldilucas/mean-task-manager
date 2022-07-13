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
        private changeDetector: ChangeDetectorRef,
        private translateService: TranslateService,
    ) {
        this.form = this.formBuilder.group({
            username: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
        });
    }

    ngOnInit(): void {
        this.translateService.get('title.login').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
    }

    login(): void {
        if (!this.isValidForm()) return;

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

    isValidForm(): boolean {
        if (!this.form.valid) {
            this.translateService.get('messages.mandatory-fields').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
            this.highlightRequiredInput();
            return false;
        }
        return true;
    }

    highlightRequiredInput(): void {
        this.form.markAllAsTouched();
        for (const input of Object.keys(this.form.controls)) {
            if (!this.form.get(input)?.valid) {
                const invalidControl = document.querySelector(`[formcontrolname="${input}"]`);
                (invalidControl as HTMLInputElement).focus();
                break;
            }
        }
        this.changeDetector.detectChanges();
    }
}
