import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { StatusCode } from 'status-code-enum';

import { CustomValidators } from '@app/scripts/validators/custom.validator';
import { IJwtPayload } from '@scripts/models/jwtPayload.interface';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { AuthService } from '@services/auth.service';
import { SharedService } from '@services/shared.service';
@Component({
  selector: 'app-log-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnInit {
  form: FormGroup;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    private sharedService: SharedService,
  ) {
    this.form = this.formBuilder.group({
      email: [null,
        [Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
          Validators.pattern(CustomValidators.emailRegex),
        ],
      ],
      password: [null,
        [Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150),
        ]],
      keepUserLogged: [false],
    });
  }

  ngOnInit(): void {
    this.translateService.get('title.login').pipe(take(1)).subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));

    if (this.authService.getKeepUserLoggedIn()) {
      this.form.controls.keepUserLogged.setValue(true);
    } else {
      this.form.controls.keepUserLogged.setValue(false);
    }
  }

  async loginAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;

    const user = { ...this.form.value } as IUser;
    const [result, error]: IQueryResult<IJwtPayload>[] = await this.sharedService.handlePromises(this.authService.authenticate(user.email, user.password, this.form.controls.keepUserLogged.value));

    if (!!error || !result || !result?.success) {
      if (error.status === StatusCode.ClientErrorUnauthorized) {
        this.sharedService.handleSnackbarMessages({ translationKey: 'login.credentials-error', success: false });
        return;
      }
      if (error.status === StatusCode.ClientErrorTooManyRequests) {
        this.sharedService.handleSnackbarMessages({ translationKey: 'login.too-many-requests-error', success: false });
        return;
      }
      this.sharedService.handleSnackbarMessages({ translationKey: 'login.authentication-error', success: false });
    }

    if (result && this.authService.authenticateToken(result.data[0])) {
      this.sharedService.handleSnackbarMessages({ translationKey: 'login.authentication-success' });
      this.router.navigate(['tasks']);
    } else {
      this.sharedService.handleSnackbarMessages({ translationKey: 'login.authentication-error', success: false });
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.showPassword = !this.showPassword;
  }
}
