import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { IJwtPayload } from '@app/scripts/models/jwt-payload.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';
import { CustomValidators } from '@app/scripts/validators/custom.validator';
@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, TranslateModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule],
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
    private translate: TranslateService,
    private sharedService: SharedService,
  ) {
    this.form = this.formBuilder.group({
      email: [null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
          Validators.pattern(CustomValidators.emailRegex),
        ],
      ],
      password: [null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150),
        ]],
      keepUserLogged: [false],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(`${this.translate.instant('title.login')} — Mean Stack Template`);
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

    if (!result || !result.success || error) {
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
