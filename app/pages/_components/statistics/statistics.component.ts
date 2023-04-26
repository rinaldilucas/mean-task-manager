import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IUser } from '@app/scripts/models/user.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';
import { UserService } from '@app/scripts/services/user.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent implements OnInit {
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

    ngOnInit (): void {
    }
}
