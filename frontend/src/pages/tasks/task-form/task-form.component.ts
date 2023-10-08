import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';

import { BottomSheetComponent } from '@app/components/shared/bottom-sheet/bottom-sheet/bottom-sheet.component';
import { ConfirmationDialogComponent } from '@app/components/shared/dialogs/confirmation-dialog/confirmation-dialog';
import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { OnDeactivate } from '@app/scripts/guards/can-deactivate.guard';
import { ICategory } from '@app/scripts/models/category.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent extends Unsubscriber implements OnInit, AfterViewInit, OnDeactivate, CanDeactivate<boolean> {
  @ViewChild('category', { read: MatAutocompleteTrigger }) categoryTrigger!: MatAutocompleteTrigger;

  title!: string;
  form!: FormGroup;

  isNew = !this.route.snapshot.data.resolverData?.task._id;
  task = this.route.snapshot.data.resolverData?.task;
  categories = this.route.snapshot.data.resolverData?.categories;
  categoriesFilteredOptions!: Observable<ICategory[]>;

  constructor(
    private bottomSheet: BottomSheetComponent,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private titleService: Title,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {
    super();

    this.form = this.formBuilder.group({
      _id: [this.task?._id, null],
      title: [
        this.task?.title,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.task?.description,
        [
          Validators.maxLength(300)],
      ],
      date: [this.task?.date, null],
      category: [this.task?.category, null],
    });
  }

  ngOnInit(): void {
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

  close(): void {
    this.dismissModalAndNavigate();
  }

  setAutoCompletes(): void {
    this.categoriesFilteredOptions = this.form.controls.category.valueChanges
      .pipe(
        startWith(''),
        map((value) => {
          const filterValue = value?.toString().toLowerCase();
          return this.categories?.filter((option) => option.title.toLowerCase().includes(filterValue));
        }),
      );
  }

  ngAfterViewInit(): void {
    this.subs.sink = this.categoryTrigger.panelClosingActions.subscribe(() => {
      if (this.categoryTrigger.activeOption)
        this.form.controls.category.setValue(this.categoryTrigger.activeOption.value);
    });
  }

  dismissModalAndNavigate(): void {
    this.form.reset();
    this.bottomSheet.dismiss();
    this.router.navigate([this.router.url.replace(/(\/new\/?|\/edit\/?).*/gi, '')]);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.dirty) return false;

    return true;
  }

  async onDeactivate(): Promise<any> {
    if (!this.form.dirty) return true;

    return await this.sharedService.handleDialogs(
      {
        component: ConfirmationDialogComponent,
        options: {
          title: 'task-form.confirmation-title',
          message: 'task-form.confirmation-message',
          action: 'task-form.confirmation-discard'
        },
      })
  }
}
