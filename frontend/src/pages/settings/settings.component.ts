import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

import { ICategory } from '@app/scripts/models/category.interface';
import { ELanguage } from '@app/scripts/models/enums/language.enum';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { CategoryService } from '@app/scripts/services/category.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  isLoading = false;
  isSearching = false;
  isProcessing = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryControl = new FormControl();
  form!: FormGroup;

  categories = this.route.snapshot.data.categoryData as ICategory[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private categoryService: CategoryService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      languageOptions: [ELanguage.english],
    });
  }

  ngOnInit(): void {
    this.verifyLanguage();
    this.updateTitle();
  }

  async saveCategoryAsync(event: MatChipInputEvent): Promise<void> {
    const value = (event.value || '').trim();
    if (!value) return;

    this.isProcessing = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });
    const category = { title: value } as ICategory;

    const [result, error]: IQueryResult<ICategory>[] = await this.sharedService.handleObservables(this.categoryService.save(category));
    if (!result || !result.success || error) {
      this.sharedService.handleSnackbars({ translationKey: 'settings.category-create-error', error: true });
      this.categoryControl.setValue(null);
      this.categoryInput.nativeElement.value = '';
      return;
    }

    this.sharedService.handleSnackbars({ translationKey: 'settings.category-create-success' });
    this.categoryControl.setValue(null);
    this.categoryInput.nativeElement.value = '';
    this.categories.push(result.data[0] as ICategory);
    this.isProcessing = this.sharedService.handleLoading({
      isLoading: false,
      changeDetector: this.changeDetector,
    });
  }

  async removeCategoryAsync(category: ICategory): Promise<void> {
    this.isProcessing = this.sharedService.handleLoading({
      isLoading: true,
      changeDetector: this.changeDetector,
    });

    const [, error]: IQueryResult<ICategory>[] = await this.sharedService.handleObservables(this.categoryService.remove(category._id));
    if (error) {
      this.sharedService.handleSnackbars({ translationKey: 'settings.category-remove-error', error: true });
      this.categoryControl.setValue(null);
      this.categoryInput.nativeElement.value = '';
    }

    this.sharedService.handleSnackbars({ translationKey: 'settings.category-remove-success' });
    const index = this.categories.indexOf(category);
    this.categories.splice(index, 1);
    this.isProcessing = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
  }

  updateTitle(): void {
    this.sharedService.handleTitle(this.translate.instant('title.settings'));
    this.sharedService.onTitleChange
      .pipe(take(1))
      .subscribe(() => this.sharedService.handleTitle(this.translate.instant('title.settings')));
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.sharedService.handleSnackbars({ translationKey: 'messages.language-changed' });
    this.changeDetector.markForCheck();
    this.sharedService.onTitleChange.emit();
  }

  verifyLanguage(): void {
    const language = localStorage.getItem('language') ?? 'en-US';
    this.translate.use(language);

    if (language === 'en-US') {
      this.form.get('languageOptions')?.setValue(ELanguage.english);
    } else {
      this.form.get('languageOptions')?.setValue(ELanguage.portuguese);
    }
  }
}
