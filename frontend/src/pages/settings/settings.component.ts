import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Title } from '@angular/platform-browser';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { lastValueFrom, take } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { CategoryService } from '@root/src/scripts/services/category.service';
import { SharedService } from '@root/src/scripts/services/shared.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TranslateModule, AngularMaterialModule, ReactiveFormsModule, FormsModule],
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
    private changeDetector: ChangeDetectorRef,
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
    if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'settings.get-error', error: true });

    this.categories = result.data;
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  async saveCategoryAsync(event: MatChipInputEvent): Promise<void> {
    const value = (event.value || '').trim();
    if (!value) return;

    const category = { title: value } as ICategory;

    const [result, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(this.categoryService.save(category));
    if (!result || !result.success || error) {
      this.sharedService.handleSnackbars({ translationKey: 'settings.category-create-error', error: true });
      this.categoryControl.setValue(null);
      this.categoryInput.nativeElement.value = '';
      return;
    }

    this.sharedService.handleSnackbars({ translationKey: 'settings.category-create-success' });
    this.categoryControl.setValue(null);
    this.categoryInput.nativeElement.value = '';
    this.categories.push(result.data[0]);
  }

  async removeCategoryAsync(category: ICategory): Promise<void> {
    const [, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(this.categoryService.remove(category._id));
    if (error) {
      this.sharedService.handleSnackbars({ translationKey: 'settings.category-remove-error', error: true });
      this.categoryControl.setValue(null);
      this.categoryInput.nativeElement.value = '';
    }

    this.sharedService.handleSnackbars({ translationKey: 'settings.category-remove-success' });
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
    this.sharedService.handleSnackbars({ translationKey: 'messages.language-changed' });
    this.changeDetector.markForCheck();
    this.sharedService.emitterTitle.emit();
  }
}
