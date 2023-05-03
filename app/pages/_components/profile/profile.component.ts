import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
    form: FormGroup;
    isSaving = false;
    isLoading = true;
    user!: IUser;

    constructor (
        private authService: AuthService,
        private titleService: Title,
        private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private router: Router,
        private sharedService: SharedService,
        private changeDetector: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.group({
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]]
        });
    }

    ngOnInit (): void {
        this.updateTitle();
        this.sharedService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());
    }

    async saveAsync (): Promise<void> {
        if (!this.sharedService.isValidForm(this.form)) return;

        const password = this.form.controls['password'].value;
        const [result, error]: IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.authService.changePassword(this.authService.getUserId(), password));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('profile.edit-error', false);

        this.sharedService.handleSnackbarMessages('profile.edit-success');
        this.form.reset();
        this.router.navigate(['tasks']);
    }

    updateTitle (): void {
        this.translateService.get('title.profile').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.sharedService.emitTitle.subscribe(() => this.updateTitle());
    }
}
