import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';

import { ConfirmationDialogComponent } from '@app/components/shared/dialogs/confirmation-dialog/confirmation-dialog';
import { Unsubscriber } from '@app/components/shared/unsubscriber.component';
import { ICategory } from '@app/scripts/models/category.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormEntryComponent implements OnInit {
  constructor(
    private bottomSheet: MatBottomSheet, //
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.open();
  }

  open(): void {
    const task = this.route.snapshot.data.task as ITask;
    const categories = this.route.snapshot.data.categories as ITask;

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
    private dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomsheetData: { task: ITask, categories: ICategory[] },
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.isNew = !this.bottomsheetData.task?._id;

    this.form = this.formBuilder.group({
      _id: [this.bottomsheetData.task._id, null],
      title: [
        this.bottomsheetData.task.title,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.bottomsheetData.task.description,
        [
          Validators.maxLength(300)],
      ],
      date: [this.bottomsheetData.task.date, null],
      category: [this.bottomsheetData.task.category, null],
    });

    if (this.isNew) {
      this.title = this.translate.instant('title.add-task');
    } else {
      this.title = this.translate.instant('title.edit-task');
    }

    this.titleService.setTitle(`${this.title} — Mean Stack Template`);
    this.setAutoCompletes();
  }

  async saveAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;

    const task = { ...this.form.value } as ITask;
    task.status = this.isNew ? EStatus.toDo : task.status;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.save(task));
    if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages(this.isNew ? { translationKey: 'task-form.create-error', success: false } : { translationKey: 'task-form.edit-error', success: false });

    this.sharedService.handleSnackbarMessages(this.isNew ? { translationKey: 'task-form.create-success' } : { translationKey: 'task-form.edit-success' });
    this.taskService.emitterTask.emit(task);
    this.form.reset();
    this.close();
  }

  close(): void {
    if (this.form.dirty) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { title: 'task-form.confirmation-title', message: 'task-form.confirmation-message', action: 'task-form.confirmation-discard' },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) this.dismissModalAndNavigate('tasks');
      });
    } else {
      this.dismissModalAndNavigate('tasks');
    }
  }

  setAutoCompletes(): void {
    this.categoriesFilteredOptions = this.form.controls.category
      .valueChanges
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
      if (this.categoryTrigger.activeOption) { this.form.controls.category.setValue(this.categoryTrigger.activeOption.value); }
    });
  }

  dismissModalAndNavigate(path: string): void {
    this.bottomSheetRef.dismiss();
    this.form.reset();
    this.router.navigate([path]);
  }
}
