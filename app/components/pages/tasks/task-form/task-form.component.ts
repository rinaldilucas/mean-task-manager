import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ICategory } from '@scripts/models/category.interface';
import { EStatus } from '@scripts/models/enum/status.enum';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { AuthService } from '@services/auth.service';
import { CategoryService } from '@services/category.service';
import { SharedService } from '@services/shared.service';
import { TaskService } from '@services/task.service';

@Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormEntryComponent implements OnDestroy {
    title!: string;

    routeSubscription!: Subscription;

    constructor (
        private bottomSheet: MatBottomSheet, //
        private router: Router,
        private route: ActivatedRoute,
        private titleService: Title,
        private translateService: TranslateService
    ) {
        this.open();
    }

    open (): void {
        this.routeSubscription = this.route.params.subscribe((params: Params) => {
            const id = params['id'] ? params['id'] : null;
            const config: MatBottomSheetConfig = { data: id, disableClose: true };
            const sheetRef = this.bottomSheet.open(TaskFormBottomSheetComponent, config);
            sheetRef.afterDismissed().subscribe(() => {
                this.translateService.get('title.tasks').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
                this.router.navigate(['tasks']);
            });
        });
    }

    ngOnDestroy (): void {
        this.routeSubscription.unsubscribe();
    }
}
@Component({
    selector: 'app-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormBottomSheetComponent implements OnInit, AfterViewInit {
    @ViewChild('category', { read: MatAutocompleteTrigger }) categoryTrigger!: MatAutocompleteTrigger;

    title!: string;
    isSaving = false;
    form: FormGroup;

    categories!: ICategory[];
    categoriesFilteredOptions!: Observable<ICategory[]>;

    constructor (
        private changeDetector: ChangeDetectorRef,
        private taskService: TaskService,
        private categoryService: CategoryService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private bottomSheetRef: MatBottomSheetRef<TaskFormBottomSheetComponent>,
        private router: Router,
        private titleService: Title,
        private translateService: TranslateService,
        private sharedService: SharedService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public id: string
    ) {
        this.form = this.formBuilder.group({
            title: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            description: [null, [Validators.maxLength(300)]],
            date: [null, null],
            category: [null, null]
        });
    }

    async ngOnInit (): Promise<void> {
        const isEdit = !!this.id;
        this.sharedService.inputErrorListener.subscribe(() => this.changeDetector.detectChanges());

        if (!isEdit) {
            this.translateService.get('title.add-task').subscribe((text: string) => {
                this.title = text;
                this.titleService.setTitle(`${this.title} — Mean Stack Template`);
            });
        } else {
            this.translateService.get('title.edit-task').subscribe((text: string) => {
                this.title = text;
                this.titleService.setTitle(`${this.title} — Mean Stack Template`);
            });

            const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.getTask(this.id));
            if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-form.get-error', success: false });

            this.form.patchValue(result.data[0]);
            this.changeDetector.markForCheck();
        }

        const [categories, categoriesError] = await this.sharedService.handlePromises(this.categoryService.listCategories());
        if (!!categoriesError || !categories || !categories?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-form.get-error', success: false });

        this.categories = categories.data;
        this.setAutoCompletes();
    }

    ngAfterViewInit (): void {
        this.categoryTrigger.panelClosingActions.subscribe(() => {
            if (this.categoryTrigger.activeOption) {
                this.form.controls['category'].setValue(this.categoryTrigger.activeOption.value);
            }
        });
    }

    private _filterCategories (value: string): ICategory[] {
        const filterValue = value?.toString().toLowerCase();
        return this.categories.filter((option) => option.title.toLowerCase().includes(filterValue));
    }

    refresh (): void {
        this.changeDetector.detectChanges();
        this.bottomSheetRef.dismiss();
    }

    async saveAsync (): Promise<void> {
        if (!this.sharedService.isValidForm(this.form)) return;

        const isEdit = !!this.id;
        const task = {
            ...this.form.value,
            userId: this.authService.getUserId(),
            _id: isEdit ? this.id : null
        } as ITask;
        task.status = EStatus.toDo;

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(isEdit ? this.taskService.updateTask(task) : this.taskService.createTask(task));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages(isEdit ? { translationKey: 'task-form.edit-error', success: false } : { translationKey: 'task-form.create-error', success: false });

        this.sharedService.handleSnackbarMessages(isEdit ? { translationKey: 'task-form.edit-success' } : { translationKey: 'task-form.create-success' });
        this.taskService.emitTask.emit(task);
        this.form.reset();
        this.close();
    }

    close (): void {
        this.bottomSheetRef.dismiss();
        this.form.reset();
        this.router.navigate(['tasks']);
    }

    setAutoCompletes (): void {
        this.categoriesFilteredOptions = this.form.controls['category'].valueChanges.pipe(
            startWith(''),
            map((value) => this._filterCategories(value))
        );
    }
}
