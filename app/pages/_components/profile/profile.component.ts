import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { IUser } from '@app/scripts/models/user.interface';
import { UserService } from '@app/scripts/services/user.service';
import { AuthService } from '@app/scripts/services/auth.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { UtilService } from '@app/scripts/services/util.service';

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
        private router: Router,
        private utilService: UtilService,
        private changeDetector: ChangeDetectorRef,
    ) {
        this.form = this.formBuilder.group({
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
        });
    }

    ngOnInit(): void {
        this.utilService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());
        this.translateService.get('title.profile').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
    }

    save(): void {
        if (!this.utilService.isValidForm(this.form)) return;

        this.userService.getUser(this.authService.getUserId()).subscribe({
            next: (result: IQueryResult<IUser>) => {
                if (!result || !result.success) {
                    this.translateService.get('profile.edit-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
                    return;
                }

                const user = result.data[0];
                user.password = this.form.controls['password'].value;

                this.userService.changePassword(user).subscribe({
                    next: () => {
                        this.translateService.get('profile.edit-success').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 5000 }));
                        this.form.reset();
                        this.router.navigate([`${this.router.url.split(/\/(profile)\/?/gi)[0]}/tasks`]);
                    },
                    error: () => this.translateService.get('profile.edit-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 })),
                });
            },
            error: () => this.translateService.get('profile.edit-error').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 })),
        });
    }
}
