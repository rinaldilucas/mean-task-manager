import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { IUser } from '@app/scripts/models/user.interface';
import { UserService } from '@app/scripts/services/user.service';
import { ERole } from '@app/scripts/models/enum/role.enum';
import { EmailValidator } from '@app/scripts/validators/email.validator';
import { SharedService } from '@app/scripts/services/shared.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { AuthService } from '@app/scripts/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
    form: FormGroup;

    constructor (
        private userService: UserService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private titleService: Title,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private translateService: TranslateService,
        private sharedService: SharedService
    ) {
        this.form = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.minLength(5), Validators.maxLength(150)], [EmailValidator.createValidator(this.userService)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]]
        });
    }

    ngOnInit (): void {
        this.sharedService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());
        this.translateService.get('title.register').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
    }

    async registerAsync (): Promise<void> {
        if (!this.sharedService.isValidForm(this.form)) return;

        const user = { ...this.form.value, role: ERole.user } as IUser;
        const [result, error]:IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.authService.register(user));
        if (!!error || !result || !result?.success) {
            if (error?.status === StatusCode.ClientErrorConflict) return this.sharedService.handleSnackbarMessages('register.email-error', false);
            else return this.sharedService.handleSnackbarMessages('register.create-error', false);
        }

        this.sharedService.handleSnackbarMessages('register.create-success');
        this.router.navigate(['login']);
    }
}
