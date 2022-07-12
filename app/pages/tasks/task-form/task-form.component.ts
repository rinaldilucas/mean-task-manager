import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef, MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '@app/scripts/services/auth.service';
import { TaskService } from '@app/scripts/services/task.service';
import { CategoryService } from '@app/scripts/services/category.service';
import { ITask } from '@app/scripts/models/task.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';

@Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormEntryComponent {
    title!: string;

    constructor(private bottomSheet: MatBottomSheet, private router: Router, private route: ActivatedRoute, private titleService: Title, private translateService: TranslateService) {
        this.open();
    }

    open(): void {
        this.route.params.subscribe((params: Params) => {
            const id = params['id'] ? params['id'] : null;
            const config: MatBottomSheetConfig = { data: id };
            const sheetRef = this.bottomSheet.open(TaskFormBottomSheetComponent, config);
            sheetRef.afterDismissed().subscribe(() => {
                this.translateService.get('title.tasks').subscribe((text: string) => {
                    this.titleService.setTitle(`${text} — Mean Stack Template`);
                });
                this.router.navigate(['/tasks']);
            });
        });
    }
}
@Component({
    selector: 'app-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormBottomSheetComponent implements OnInit, AfterViewInit {
    @ViewChild('category', { read: MatAutocompleteTrigger }) categoryTrigger!: MatAutocompleteTrigger;

    title!: string;
    isSaving = false;
    form: FormGroup;

    categories!: ICategory[];
    categoriesFilteredOptions!: Observable<ICategory[]>;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private taskService: TaskService,
        private categoriesService: CategoryService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private bottomSheetRef: MatBottomSheetRef<TaskFormBottomSheetComponent>,
        private router: Router,
        private titleService: Title,
        private translateService: TranslateService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public id: string,
    ) {
        this.form = this.formBuilder.group({
            title: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
            description: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
            date: [null, null],
            category: [null, null],
        });
    }

    ngOnInit(): void {
        this.categoriesService.listCategories().subscribe((result: IQueryResult<ICategory>) => {
            this.categories = result.data;
            this.setAutoCompletes();
        });

        if (this.id) {
            this.taskService.getTask(this.id).subscribe((result: IQueryResult<ITask>) => {
                this.form.patchValue(result.data[0]);
                this.changeDetector.markForCheck();
                this.translateService.get('title.edit-task').subscribe((text: string) => {
                    this.title = text;
                    this.titleService.setTitle(`${this.title} — Mean Stack Template`);
                });
            });
        } else {
            this.translateService.get('title.add-task').subscribe((text: string) => {
                this.title = text;
                this.titleService.setTitle(`${this.title} — Mean Stack Template`);
            });
        }
    }

    ngAfterViewInit(): void {
        this.categoryTrigger.panelClosingActions.subscribe(() => {
            if (this.categoryTrigger.activeOption) {
                console.log(this.categoryTrigger.activeOption.value);
                this.form.controls['category'].setValue(this.categoryTrigger.activeOption.value);
            }
        });
    }

    private _filterCategories(value: string): ICategory[] {
        const filterValue = value?.toString().toLowerCase();
        return this.categories.filter((option) => option.title.toLowerCase().includes(filterValue));
    }

    refresh(): void {
        this.changeDetector.detectChanges();
        this.bottomSheetRef.dismiss();
    }

    save(): void {
        if (!this.isValidForm()) return;

        const task = { ...this.form.value, userId: this.authService.getUserId() } as ITask;
        if (!this.id) {
            task.status = EStatus.toDo;
            this.taskService.createTask(task).subscribe({
                next: () => {
                    this.snackBar.open('Task added with success.', undefined, { duration: 5000 });
                    this.taskService.emitTask.emit(task);
                    this.form.reset();
                    this.close();
                },
                error: () => this.snackBar.open('Error adding the task.', undefined, { duration: 8000 }),
            });
        } else {
            task._id = this.id;
            this.taskService.updateTask(task).subscribe({
                next: () => {
                    this.snackBar.open('Task edited with success.', undefined, { duration: 5000 });
                    this.form.reset();
                    this.taskService.emitTask.emit();
                    this.close();
                },
                error: () => this.snackBar.open('Error updating the task.', undefined, { duration: 8000 }),
            });
        }
    }

    close(): void {
        this.bottomSheetRef.dismiss();
        this.form.reset();
        this.router.navigate([`${this.router.url.split(/\/(add|edit)\/?/gi)[0]}/`]);
    }

    setAutoCompletes(): void {
        this.categoriesFilteredOptions = this.form.controls['category'].valueChanges.pipe(
            startWith(''),
            map((value) => this._filterCategories(value)),
        );
    }

    isValidForm(): boolean {
        if (!this.form.valid) {
            this.snackBar.open('You must fill the mandatory fields.', undefined, { duration: 8000 });
            this.highlightRequiredInput();
            return false;
        }
        return true;
    }

    highlightRequiredInput(): void {
        this.form.markAllAsTouched();
        for (const input of Object.keys(this.form.controls)) {
            if (!this.form.get(input)?.valid) {
                const invalidControl = document.querySelector(`[formcontrolname="${input}"]`);
                (invalidControl as HTMLInputElement).focus();
                break;
            }
        }
        this.changeDetector.detectChanges();
    }
}
