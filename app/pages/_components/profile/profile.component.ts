import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { IUser } from '@app/scripts/models/user.interface';
import { UserService } from '@app/scripts/services/user.service';
import { AuthService } from '@app/scripts/services/auth.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
    form: FormGroup;
    isSaving = false;
    isLoading = true;
    user!: IUser;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private titleService: Title,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private changeDetector: ChangeDetectorRef,
    ) {
        this.form = this.formBuilder.group({
            username: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
        });
    }

    ngOnInit(): void {
        this.translateService.get('title.profile').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.refresh();
    }

    refresh(): void {
        this.userService.getUser(this.authService.getUserId()).subscribe((result: IQueryResult<IUser>) => {
            this.user = result.data[0];
            this.form.controls['username'].patchValue(this.user.username);
            this.isLoading = false;
        });
    }

    save(): void {
        if (!this.isValidForm()) {
            return;
        }

        const user = { ...this.form.value, _id: this.authService.getUserId() };
        user.username = this.form.controls['username'].value ? this.form.controls['username'].value : user.username;
        user.password = this.form.controls['password'].value ? this.form.controls['password'].value : user.password;

        this.userService.updateUser(user).subscribe({
            next: () => {
                this.form.reset();
                this.snackBar.open('Profile edited with success.', undefined, { duration: 5000 });
                this.refresh();
            },
            error: () => this.snackBar.open('Error editing profile.', undefined, { duration: 8000 }),
        });
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
