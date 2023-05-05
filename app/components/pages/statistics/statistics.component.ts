import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IUser } from '@scripts/models/user.interface';
import { AuthService } from '@services/auth.service';
import { SharedService } from '@services/shared.service';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {
    isSaving = false;
    isLoading = true;
    user!: IUser;

    constructor (
        private userService: UserService,
        private authService: AuthService,
        private titleService: Title,
        private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private router: Router,
        private sharedService: SharedService,
        private changeDetector: ChangeDetectorRef
    ) {}
}
