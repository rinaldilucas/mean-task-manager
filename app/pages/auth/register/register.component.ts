import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { IUser } from '@app/scripts/models/user.interface';
import { UserService } from '@app/scripts/services/user.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { ERole } from '@app/scripts/models/enum/role.enum';
import { EmailValidator } from '@app/scripts/validators/email.validator';
import { UtilService } from '@app/scripts/services/util.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
    form: FormGroup;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private titleService: Title,
        private snackBar: MatSnackBar,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private translateService: TranslateService,
        private utilService: UtilService,
    ) {
        this.form = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.minLength(5), Validators.maxLength(150)], [EmailValidator.createValidator(this.userService)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
        });
    }

    ngOnInit(): void {
        this.utilService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());
        this.translateService.get('title.register').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
    }

    register(): void {
        if (!this.utilService.isValidForm(this.form)) return;

        const user = { ...this.form.value, role: ERole.user } as IUser;
        this.userService.register(user).subscribe({
            next: (result: IQueryResult<IUser>) => {
                if (!result || !result.success) {
                    this.translateService.get('register.create-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                }

                this.translateService.get('register.create-success').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 5000 }));
                this.router.navigate([`${this.router.url.split(/\/(register)\/?/gi)[0]}/login`]);
            },
            error: (error: IQueryResult<IUser>) => {
                if (error.status === StatusCode.ClientErrorConflict) {
                    this.translateService.get('register.email-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    return;
                }
                this.translateService.get('register.create-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
            },
        });
    }
}
