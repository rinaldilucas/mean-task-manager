import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Observable, map, of, startWith, take } from 'rxjs';

import { ConfirmationDialogComponent } from '@app/components/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { OnDeactivate } from '@app/scripts/guards/can-deactivate.guard';
import { ICategory } from '@app/scripts/models/category.interface';
import { EStatus } from '@app/scripts/models/enums/status.enum';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { CategoryService } from '@app/scripts/services/category.service';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormEntryComponent extends Unsubscriber implements OnDeactivate, CanDeactivate<boolean> {
  isFormSubmitted = false;
  isFormDirty = false;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private sharedService: SharedService,
    private matBottomSheet: MatBottomSheet,
  ) {
    super();
    this.open();
  }

  async open(): Promise<void> {
    const id = this.route.snapshot.params.id as string;

    await this.sharedService.handleSheets({
      component: TaskFormComponent,
      options: { id },
      disableClose: true,
    });

    this.sharedService.handleTitle(this.translate.instant('title.tasks'));
  }

  async onDeactivate(): Promise<boolean> {
    if (!this.isFormDirty || this.isFormSubmitted) {
      this.matBottomSheet.dismiss();
      return true;
    }

    const dialogRes = await this.sharedService.handleDialogs({
      component: ConfirmationDialogComponent,
      options: {
        title: 'task-form.confirmation-title',
        message: 'task-form.confirmation-message',
        action: 'task-form.confirmation-action',
      },
    });

    if (dialogRes) {
      this.matBottomSheet.dismiss();
      return true;
    } else {
      return false;
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.isFormDirty) return false;

    return true;
  }
}
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent extends Unsubscriber implements OnInit, AfterViewInit {
  @ViewChild('category', { read: MatAutocompleteTrigger })
  categoryTrigger!: MatAutocompleteTrigger;

  title!: string;
  isLoading = true;
  form!: FormGroup;

  isNew = !this.bottomsheetData?.id;
  task!: ITask;
  categories!: ICategory[];
  categoriesFilteredOptions!: Observable<ICategory[]>;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private translate: TranslateService,
    private changeDetector: ChangeDetectorRef,
    private categoryService: CategoryService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomsheetData: { id: string },
  ) {
    super();

    this.form = this.formBuilder.group({
      _id: [null, null],
      title: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: [null, [Validators.maxLength(300)]],
      date: [null, null],
      category: [null, null],
    });

    this.subs.sink = this.form.valueChanges.pipe(take(1)).subscribe(() => this.sharedService.onFormDirtyChange.emit(this.form.dirty));
  }

  async ngOnInit(): Promise<void> {
    this.title = this.isNew ? this.translate.instant('title.add-task') : this.translate.instant('title.edit-task');
    this.sharedService.handleTitle(this.title);

    const [categoryResult, categoryError]: IQueryResult<ICategory>[] = await this.sharedService.handleObservables(
      this.categoryService.getAll(),
    );
    if (!categoryResult || !categoryResult.success || categoryError) {
      this.sharedService.handleSnackbars({ translationKey: 'task-form.category-fetch-error', error: true });
      return;
    }

    this.categories = categoryResult.data;

    if (!this.isNew) {
      const [taskResult, taskError]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(
        this.taskService.get(this.bottomsheetData.id),
      );
      if (!taskResult || !taskResult.success || taskError) {
        this.sharedService.handleSnackbars({ translationKey: 'task-form.task-fetch-error', error: true });
        return;
      }

      this.task = taskResult.data[0] as ITask;
      this.form.patchValue(this.task);
    }

    this.setAutoCompletes();
    this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
  }

  async saveAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });

    const task = { ...this.form.value } as ITask;
    task.status = this.isNew ? EStatus.toDo : task.status;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(this.taskService.save(task));
    if (!result || !result.success || error) {
      this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
      this.sharedService.handleSnackbars(
        this.isNew ? { translationKey: 'task-form.create-error' } : { translationKey: 'task-form.edit-error', error: true },
      );
    }

    this.taskService.onTaskChange.emit();
    this.sharedService.onFormSubmitChange.emit(true);

    this.sharedService.handleSnackbars(
      this.isNew ? { translationKey: 'task-form.create-success' } : { translationKey: 'task-form.edit-success' },
    );
    this.close();
  }

  async close(): Promise<void> {
    this.router.navigate([this.router.url.replace(/(\/new\/?|\/edit\/?).*/gi, '')]);
  }

  setAutoCompletes(): void {
    this.categoriesFilteredOptions =
      this.form.controls.category?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const filterValue = value?.toString().toLowerCase();
          return this.categories.filter((option) => option.title.toLowerCase().includes(filterValue as string));
        }),
      ) ?? of([]);
  }

  ngAfterViewInit(): void {
    this.subs.sink = this.categoryTrigger?.panelClosingActions.subscribe(() => {
      if (this.categoryTrigger.activeOption) this.form.controls.category?.setValue(this.categoryTrigger.activeOption.value);
    });
  }
}
