import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

import { TaskFormBottomSheetComponent } from '@app/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { TaskRoutingModule } from '@app/scripts/modules/tasks-routing.module';
import { ConvertDatePipe } from '@app/scripts/pipes/convert-date.pipe';

@NgModule({
  declarations: [TaskFormBottomSheetComponent, TaskListComponent, ConvertDatePipe],
  imports: [TaskRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, AngularMaterialModule, TableVirtualScrollModule, TranslateModule],
  exports: [],
})
export class TaskModule { }
