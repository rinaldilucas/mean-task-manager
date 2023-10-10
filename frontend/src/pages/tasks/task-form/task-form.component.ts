import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';

import { DiscardChangesDialogComponent } from '@app/components/shared/dialogs/discard-changes-dialog/discard-changes-dialog';
import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { OnDeactivate } from '@app/scripts/guards/can-deactivate.guard';
import { ICategory } from '@app/scripts/models/category.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormEntryComponent implements OnDeactivate, CanDeactivate<boolean> {
  isFormSubmitted = false;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService,
    private sharedService: SharedService,
    private matBottomSheet: MatBottomSheet,
  ) {
    this.open();
  }

  async open(): Promise<void> {
    const task = this.route.snapshot.data.taskData.task as ITask;
    const categories = this.route.snapshot.data.taskData.categories as ICategory;

    this.sharedService.emitterForm.subscribe((form: FormGroup) => this.form = form);
    this.sharedService.emitterFormSubmit.subscribe((isFormSubmitted: boolean) => this.isFormSubmitted = isFormSubmitted);

    await this.sharedService.handleSheets({
      component: TaskFormBottomSheetComponent,
      options: { task, categories },
      disableClose: true,
    });

    this.titleService.setTitle(`${this.translate.instant('title.tasks')} — Mean Stack Template`);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.dirty) return false;

    return true;
  }

  async onDeactivate(): Promise<any> {
    if (this.form?.pristine || this.isFormSubmitted) {
      this.matBottomSheet.dismiss();
      return true;
    }

    const dialogRes: { dialogRef, result: boolean } = await this.sharedService.handleDialogs({
      component: DiscardChangesDialogComponent,
      options: {
        title: 'task-form.confirmation-title',
        message: 'task-form.confirmation-message',
        action: 'task-form.confirmation-discard',
      },
    });

    if (!dialogRes.result) return false;

    this.matBottomSheet.dismiss();
    return true;
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
  isLoading = false;
  form!: FormGroup;

  isNew = !this.bottomsheetData?.task._id;
  task = this.bottomsheetData.task;
  categories = this.bottomsheetData.categories;
  categoriesFilteredOptions!: Observable<ICategory[]>;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private titleService: Title,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomsheetData: { task: ITask, categories: ICategory[] },
  ) {
    super();

    this.form = this.formBuilder.group({
      _id: [this.task._id, null],
      title: [this.task.title, [Validators.required, Validators.minLength(2), Validators.maxLength(100)],],
      description: [this.task.description, [Validators.maxLength(300)]],
      date: [this.task.date, null],
      category: [this.task.category, null],
    });

    this.sharedService.emitterForm.emit(this.form);
    this.form.valueChanges.subscribe(() => this.sharedService.emitterForm.emit(this.form));
  }

  ngOnInit(): void {
    this.title = this.isNew ? this.translate.instant('title.add-task') : this.translate.instant('title.edit-task');
    this.titleService.setTitle(`${this.title} — Mean Stack Template`);
    this.setAutoCompletes();
  }

  async saveAsync(): Promise<void> {
    if (!this.sharedService.isValidForm(this.form)) return;
    this.isLoading = true;

    const task = { ...this.form.value } as ITask;
    task.status = this.isNew ? EStatus.toDo : task.status;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.save(task));
    if (!result || !result.success || error) {
      this.isLoading = false;
      this.cdRef.markForCheck();
      return this.sharedService.handleSnackbars(this.isNew ? { translationKey: 'task-form.create-error' } : { translationKey: 'task-form.edit-error', error: true });
    }

    this.sharedService.handleSnackbars(this.isNew ? { translationKey: 'task-form.create-success' } : { translationKey: 'task-form.edit-success' });
    this.taskService.emitterTask.emit(task);
    this.sharedService.emitterFormSubmit.emit(true);
    this.close();
  }

  async close(): Promise<void> {
    this.router.navigate([this.router.url.replace(/(\/new\/?|\/edit\/?).*/gi, '')]);
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
    this.subs.sink = this.categoryTrigger?.panelClosingActions.subscribe(() => {
      if (this.categoryTrigger.activeOption)
        this.form.controls.category.setValue(this.categoryTrigger.activeOption.value);
    });
  }
}
