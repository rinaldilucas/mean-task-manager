import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { IUser } from '@app/scripts/models/user.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { UserService } from '@app/scripts/services/user.service';
import { SharedService } from '@app/scripts/services/shared.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IJwtPayload } from '@app/scripts/models/jwtPayload.interface';
@Component({
    selector: 'app-log-in',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogInComponent implements OnInit {
    form: FormGroup;

    constructor (
        private userService: UserService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private titleService: Title,
        private router: Router,
        private translateService: TranslateService,
        private sharedService: SharedService,
        private changeDetector: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.minLength(5), Validators.maxLength(150)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
            keepUserLogged: [false]
        });
    }

    ngOnInit (): void {
        this.sharedService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());
        this.translateService.get('title.login').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.authService.getUserIsLoggedIn() ? this.form.controls.keepUserLogged.setValue(true) : this.form.controls.keepUserLogged.setValue(false);
    }

    async loginAsync (): Promise<void> {
        if (!this.sharedService.isValidForm(this.form)) return;

        const user = { ...this.form.value } as IUser;
        const [result, error]: IQueryResult<IJwtPayload>[] = await this.sharedService.handlePromises(this.authService.authenticate(user.email, user.password, this.form.controls.keepUserLogged.value));

        if (!!error || !result || !result?.success) {
            if (error.status === StatusCode.ClientErrorNotFound) {
                this.sharedService.handleSnackbarMessages('login.user-error', false);
                return;
            }
            if (error.status === StatusCode.ClientErrorForbidden) {
                this.sharedService.handleSnackbarMessages('login.password-error', false);
                return;
            }
            if (error.status === StatusCode.ClientErrorUnauthorized) {
                this.sharedService.handleSnackbarMessages('login.credentials-error', false);
                return;
            }

            this.sharedService.handleSnackbarMessages('login.authentication-error', false);
        }

        if (this.authService.authenticateToken(result.data[0])) {
            this.sharedService.handleSnackbarMessages('login.authentication-success');
            this.router.navigate(['tasks']);
        } else {
            this.sharedService.handleSnackbarMessages('login.authentication-error', false);
        }
    }
}
