import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, take } from 'rxjs';

import { ICategory } from '@scripts/models/category.interface';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { CategoryService } from '@services/category.service';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  isLoading = true;
  isSearching = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryControl = new FormControl();
  categories: ICategory[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef, //
    private categoryService: CategoryService,
    private translate: TranslateService,
    private titleService: Title,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.updateTitle();
    this.refreshAsync();
  }

  async refreshAsync(): Promise<void> {
    const [result, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(lastValueFrom(this.categoryService.findAll()));
    if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'settings.get-error', success: false });

    this.categories = result.data;
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  async saveCategoryAsync(event: MatChipInputEvent): Promise<void> {
    const value = (event.value || '').trim();
    if (!value) return;

    const category = { title: value } as ICategory;

    const [result, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(this.categoryService.save(category));
    if (!!error || !result || !result?.success) {
      this.sharedService.handleSnackbarMessages({ translationKey: 'settings.category-create-error', success: false });
      this.categoryControl.setValue(null);
      this.categoryInput.nativeElement.value = '';
      return;
    }

    this.sharedService.handleSnackbarMessages({ translationKey: 'settings.category-create-success' });
    this.categoryControl.setValue(null);
    this.categoryInput.nativeElement.value = '';
    this.categories.push(result.data[0]);
  }

  async removeCategoryAsync(category: ICategory): Promise<void> {
    const [, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(this.categoryService.remove(category._id));
    if (error) {
      this.sharedService.handleSnackbarMessages({ translationKey: 'settings.category-remove-error', success: false });
      this.categoryControl.setValue(null);
      this.categoryInput.nativeElement.value = '';
    }

    this.sharedService.handleSnackbarMessages({ translationKey: 'settings.category-remove-success' });
    this.categoryControl.setValue(null);
    this.categoryInput.nativeElement.value = '';
    const index = this.categories.indexOf(category);
    this.categories.splice(index, 1);
    this.changeDetector.markForCheck();
  }

  updateTitle(): void {
    this.titleService.setTitle(`${this.translate.instant('title.settings')} — Mean Stack Template`);
    this.sharedService.emitterTitle.pipe(take(1)).subscribe(() => this.updateTitle());
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.sharedService.handleSnackbarMessages({ translationKey: 'messages.language-changed' });
    this.changeDetector.markForCheck();
    this.sharedService.emitterTitle.emit();
  }
}
