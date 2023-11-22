import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from 'status-code-enum';

import { ERole } from '@app/scripts/models/enums/role.enum';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { UserService } from '@app/scripts/services/user.service';
import { CustomValidators } from '@app/scripts/validators/custom.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private sharedService: SharedService,
    private changeDetector: ChangeDetectorRef,
    private userService: UserService,
  ) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150), Validators.pattern(CustomValidators.emailRegex)], [CustomValidators.checkEmail(this.userService)]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(150), CustomValidators.incremental, CustomValidators.sequential, CustomValidators.capitalized, CustomValidators.number, CustomValidators.specialCharacters]],
      confirmPassword: [null, [Validators.required, CustomValidators.equalsTo('password')]],
    });
  }

  ngOnInit(): void {
    this.sharedService.handleTitle(this.translate.instant('title.register'));
  }

  async registerAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });

    const user = { ...this.form.value, role: ERole.user } as IUser;
    const [result, error]: IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.userService.register(user));
    if (!result || !result.success || error) {
      if (error?.status === StatusCode.ClientErrorConflict) return this.sharedService.handleSnackbars({ translationKey: 'register.email-error', error: true });
      else this.sharedService.handleSnackbars({ translationKey: 'register.create-error', error: true });
      this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
      return;
    }

    this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
    this.sharedService.handleSnackbars({ translationKey: 'register.create-success' });
    this.router.navigate(['login']);
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.showPassword = !this.showPassword;
  }
}
