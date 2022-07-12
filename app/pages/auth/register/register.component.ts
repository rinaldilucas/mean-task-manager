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
    ) {
        this.form = this.formBuilder.group({
            username: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
        });
    }

    ngOnInit(): void {
        this.translateService.get('title.register').subscribe((text: string) => {
            this.titleService.setTitle(`${text} — Mean Stack Template`);
        });
    }

    register(): void {
        if (!this.isValidForm()) {
            return;
        }

        const user = { ...this.form.value, role: ERole.user } as IUser;

        this.userService.register(user).subscribe(
            (result: IQueryResult<IUser>) => {
                if (!result || !result.success) {
                    this.snackBar.open('Error creating user.', undefined, { duration: 8000 });
                }

                this.snackBar.open('User created with success.', undefined, { duration: 5000 });
                this.router.navigate([`${this.router.url.split(/\/(register)\/?/gi)[0]}/login`]);
            },
            (error: IQueryResult<IUser>) => {
                if (error.status === StatusCode.ClientErrorConflict) {
                    this.snackBar.open('Username already taken.', undefined, { duration: 8000 });
                    return;
                }

                this.snackBar.open('Error creating user.', undefined, { duration: 8000 });
            },
        );
    }

    isValidForm(): boolean {
        if (!this.form.valid) {
            this.snackBar.open('You must fill the mandatory fields.', undefined, { duration: 8000 });
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
