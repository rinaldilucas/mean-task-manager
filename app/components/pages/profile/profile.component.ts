import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DirectiveModule } from '@app/scripts/modules/directive.module';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, DirectiveModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  isLoading = true;
  user!: IUser;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private sharedService: SharedService,
  ) {
    this.form = this.formBuilder.group({
      password: [null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150),
        ]],
    });
  }

  ngOnInit(): void {
    this.updateTitle();
  }

  async saveAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;

    const password = this.form.controls.password.value;
    const [result, error]: IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.authService.changePassword(this.authService.getUserId(), password));
    if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'profile.edit-error', success: false });

    this.sharedService.handleSnackbarMessages({ translationKey: 'profile.edit-success' });
    this.form.reset();
    this.router.navigate(['tasks']);
  }

  updateTitle(): void {
    this.titleService.setTitle(`${this.translate.instant('title.profile')} — Mean Stack Template`);
    this.sharedService.emitterTitle.pipe(take(1)).subscribe(() => this.updateTitle());
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.showPassword = !this.showPassword;
  }
}
