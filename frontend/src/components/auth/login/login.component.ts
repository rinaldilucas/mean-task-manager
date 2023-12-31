import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { IJwtPayload } from '@app/scripts/models/jwt-payload.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';
import { UserService } from '@app/scripts/services/user.service';
import { CustomValidators } from '@app/scripts/validators/custom.validator';

@Component({
  selector: 'app-log-in',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnInit {
  form: FormGroup;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private sharedService: SharedService,
    private userService: UserService,
  ) {
    this.form = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(150), Validators.pattern(CustomValidators.emailRegex)],
      ],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
      keepUserLogged: [false],
    });
  }

  ngOnInit(): void {
    this.sharedService.handleTitle(this.translate.instant('title.login'));

    if (this.authService.getKeepUserLoggedIn()) {
      this.form.controls.keepUserLogged?.setValue(true);
    } else {
      this.form.controls.keepUserLogged?.setValue(false);
    }
  }

  async loginAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;

    const user = { ...this.form.value } as IUser;
    const [result, error]: IQueryResult<IJwtPayload>[] = await this.sharedService.handleObservables(
      this.userService.authenticate(user.email, user.password, this.form.controls.keepUserLogged?.value),
    );

    if (!result || !result.success || error) {
      if (error?.status === StatusCode.ClientErrorUnauthorized) {
        this.sharedService.handleSnackbars({ translationKey: 'login.credentials-error', error: true });
        return;
      }
      if (error?.status === StatusCode.ClientErrorTooManyRequests) {
        this.sharedService.handleSnackbars({ translationKey: 'login.too-many-requests-error', error: true });
        return;
      }
      this.sharedService.handleSnackbars({ translationKey: 'login.authentication-error', error: true });
    }

    if (result && this.authService.authenticateToken(result.data[0] as IJwtPayload)) {
      this.sharedService.handleSnackbars({ translationKey: 'login.authentication-success' });
      this.router.navigate(['tasks']);
    } else {
      this.sharedService.handleSnackbars({ translationKey: 'login.authentication-error', error: true });
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.showPassword = !this.showPassword;
  }
}
