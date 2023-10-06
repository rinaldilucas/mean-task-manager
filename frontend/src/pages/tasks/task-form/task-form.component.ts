import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';

import { ConfirmationDialogComponent } from '@app/components/shared/dialogs/confirmation-dialog/confirmation-dialog';
import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { ICategory } from '@app/scripts/models/category.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { ITask } from '@app/scripts/models/task.interface';
import { IQueryResult } from '@root/src/scripts/models/query-result.interface';
import { SharedService } from '@root/src/scripts/services/shared.service';
import { TaskService } from '@root/src/scripts/services/task.service';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormEntryComponent implements OnInit {
  constructor(
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.open();
  }

  open(): void {
    const task = this.route.snapshot.data.taskData.task as ITask;
    const categories = this.route.snapshot.data.taskData.categories as ICategory;

    const config: MatBottomSheetConfig = { data: { task, categories }, disableClose: true };
    const sheetRef = this.bottomSheet.open(TaskFormBottomSheetComponent, config);
    sheetRef.afterDismissed().subscribe(() => {
      this.titleService.setTitle(`${this.translate.instant('title.tasks')} — Mean Stack Template`);
      this.router.navigate(['tasks']);
    });
  }
}
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormBottomSheetComponent extends Unsubscriber implements OnInit, AfterViewInit {
  @ViewChild('category', { read: MatAutocompleteTrigger }) categoryTrigger!: MatAutocompleteTrigger;

  title!: string;
  isSaving = false;
  form!: FormGroup;

  isNew = !this.bottomsheetData?.task._id;
  task = this.bottomsheetData.task;
  categories = this.bottomsheetData.categories;
  categoriesFilteredOptions!: Observable<ICategory[]>;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<TaskFormBottomSheetComponent>,
    private router: Router,
    private sharedService: SharedService,
    private titleService: Title,
    private translate: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomsheetData: { task: ITask, categories: ICategory[] },
  ) {
    super();

    this.form = this.formBuilder.group({
      _id: [this.task._id, null],
      title: [
        this.task.title,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.task.description,
        [
          Validators.maxLength(300)],
      ],
      date: [this.task.date, null],
      category: [this.task.category, null],
    });
  }

  async ngOnInit(): Promise<void> {
    this.title = this.isNew ? this.translate.instant('title.add-task') : this.translate.instant('title.edit-task');
    this.titleService.setTitle(`${this.title} — Mean Stack Template`);
    this.setAutoCompletes();
  }

  async saveAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;

    const task = { ...this.form.value } as ITask;
    task.status = this.isNew ? EStatus.toDo : task.status;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.save(task));
    if (!result || !result.success || error) return this.sharedService.handleSnackbars(this.isNew ? { translationKey: 'task-form.create-error' } : { translationKey: 'task-form.edit-error', error: true });

    this.sharedService.handleSnackbars(this.isNew ? { translationKey: 'task-form.create-success' } : { translationKey: 'task-form.edit-success' });
    this.taskService.emitterTask.emit(task);
    this.form.reset();
    this.close();
  }

  async close(): Promise<void> {
    if (this.form.dirty) {
      const res = await this.sharedService.handleDialogs(
        {
          component: ConfirmationDialogComponent,
          options: {
            title: 'task-form.confirmation-title',
            message: 'task-form.confirmation-message',
            action: 'task-form.confirmation-discard'
          },
        })

      if (res)
        this.dismissModalAndNavigate('tasks');
    } else {
      this.dismissModalAndNavigate('tasks');
    }
  }

  setAutoCompletes(): void {
    this.categoriesFilteredOptions = this.form.controls.category.valueChanges
      .pipe(
        startWith(''),
        map((value) => {
          const filterValue = value?.toString().toLowerCase();
          return this.categories.filter((option) => option.title.toLowerCase().includes(filterValue));
        }),
      );
  }

  ngAfterViewInit(): void {
    this.subs.sink = this.categoryTrigger.panelClosingActions.subscribe(() => {
      if (this.categoryTrigger.activeOption)
        this.form.controls.category.setValue(this.categoryTrigger.activeOption.value);
    });
  }

  dismissModalAndNavigate(path: string): void {
    this.bottomSheetRef.dismiss();
    this.form.reset();
    this.router.navigate([path]);
  }
}
