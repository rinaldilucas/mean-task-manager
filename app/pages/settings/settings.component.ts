import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ICategory } from '@app/scripts/models/category.interface';
import { CategoryService } from '@app/scripts/services/category.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { SharedService } from '@app/scripts/services/shared.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    constructor(
        private changeDetector: ChangeDetectorRef, //
        private categoryService: CategoryService,
        private translateService: TranslateService,
        private titleService: Title,
        private sharedService: SharedService,
    ) {}

    ngOnInit(): void {
        this.translateService.get('title.settings').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.refreshAsync();
    }

    async refreshAsync(): Promise<void> {
        const [result, error] = await this.sharedService.handlePromises(this.categoryService.listCategories());
        if (!!error || !result || !result.success) {
            this.sharedService.handleSnackbarMessages('task-form.get-error', false);
            return;
        }

        this.categories = result.data.map((category: ICategory) => {
            return {
                _id: category._id,
                title: category.title,
            } as ICategory;
        });

        this.isLoading = false;
        this.changeDetector.markForCheck();
    }

    saveCategory(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        const category = { title: value } as ICategory;

        if (!value) {
            return;
        }

        this.categoryService.createCategory(category).subscribe({
            next: (result: IQueryResult<ICategory>) => {
                if (!result || !result.success) {
                    this.sharedService.handleSnackbarMessages('settings.category-create-error', false);
                    return;
                }

                this.sharedService.handleSnackbarMessages('settings.category-create-success');
                this.categoryService.emitCategory.emit(result.data[0]);
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
                this.categories.push(result.data[0]);
            },
            error: () => {
                this.sharedService.handleSnackbarMessages('settings.category-create-error', false);
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
            },
        });
    }

    removeCategory(category: ICategory): void {
        this.categoryService.removeCategory(category._id).subscribe({
            next: () => {
                this.sharedService.handleSnackbarMessages('settings.category-remove-success');
                this.categoryService.emitCategory.emit(category);
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
                const index = this.categories.indexOf(category);
                this.categories.splice(index, 1);
                this.changeDetector.markForCheck();
            },
            error: () => {
                this.sharedService.handleSnackbarMessages('settings.category-remove-error', false);
                this.categoryCtrl.setValue(null);
                this.categoryInput.nativeElement.value = '';
            },
        });
    }
}
