import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { CategoryService } from '@app/scripts/services/category.service';
import { SharedService } from '@app/scripts/services/shared.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
    @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    isLoading = true;
    isSearching = false;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    categoryCtrl = new FormControl();
    filteredCategories!: Observable<string[]>;
    categories: ICategory[] = [];

    constructor (
        private changeDetector: ChangeDetectorRef, //
        private categoryService: CategoryService,
        private translateService: TranslateService,
        private titleService: Title,
        private sharedService: SharedService
    ) {}

    ngOnInit (): void {
        this.updateTitle();
        this.refreshAsync();
    }

    async refreshAsync (): Promise<void> {
        const [result, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(this.categoryService.listCategories());
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('task-form.get-error', false);

        this.categories = result.data.map((category: ICategory) => ({ _id: category._id, title: category.title }));
        this.isLoading = false;
        this.changeDetector.markForCheck();
    }

    async saveCategoryAsync (event: MatChipInputEvent): Promise<void> {
        const value = (event.value || '').trim();
        const category = { title: value } as ICategory;

        if (!value) return;

        const [result, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(this.categoryService.createCategory(category));
        if (!!error || !result || !result?.success) {
            this.sharedService.handleSnackbarMessages('settings.category-create-error', false);
            this.categoryCtrl.setValue(null);
            this.categoryInput.nativeElement.value = '';
            return;
        }

        this.sharedService.handleSnackbarMessages('settings.category-create-success');
        this.categoryService.emitCategory.emit(result.data[0]);
        this.categoryCtrl.setValue(null);
        this.categoryInput.nativeElement.value = '';
        this.categories.push(result.data[0]);
    }

    async removeCategoryAsync (category: ICategory): Promise<void> {
        const [result, error]: IQueryResult<ICategory>[] = await this.sharedService.handlePromises(this.categoryService.removeCategory(category._id));
        if (!!error || !result || !result?.success) {
            this.sharedService.handleSnackbarMessages('settings.category-remove-error', false);
            this.categoryCtrl.setValue(null);
            this.categoryInput.nativeElement.value = '';
        }

        this.sharedService.handleSnackbarMessages('settings.category-remove-success');
        this.categoryService.emitCategory.emit(category);
        this.categoryCtrl.setValue(null);
        this.categoryInput.nativeElement.value = '';
        const index = this.categories.indexOf(category);
        this.categories.splice(index, 1);
        this.changeDetector.markForCheck();
    }

    updateTitle (): void {
        this.translateService.get('title.settings').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.sharedService.emitTitle.subscribe(() => this.updateTitle());
    }

    changeLanguage (language: string): void {
        this.translateService.use(language);
        localStorage.setItem('language', language);
        this.sharedService.handleSnackbarMessages('messages.language-changed');
        this.changeDetector.markForCheck();
        this.sharedService.emitTitle.emit();
    }
}
