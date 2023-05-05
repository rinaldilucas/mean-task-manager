import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { ERole } from '@scripts/models/enum/role.enum';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { AuthService } from '@scripts/services/auth.service';
import { SharedService } from '@scripts/services/shared.service';
import { UserService } from '@scripts/services/user.service';
import { EmailValidator } from '@scripts/validators/email.validator';

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
            if (error?.status === StatusCode.ClientErrorConflict) return this.sharedService.handleSnackbarMessages({ translationKey: 'register.email-error', success: false });
            else return this.sharedService.handleSnackbarMessages({ translationKey: 'register.create-error', success: false });
        }

        this.sharedService.handleSnackbarMessages({ translationKey: 'register.create-success' });
        this.router.navigate(['login']);
    }
}
