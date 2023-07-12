import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

import { TaskFormBottomSheetComponent } from '@components/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@components/pages/tasks/task-list/task-list.component';
import { AngularMaterialModule } from '@scripts/modules/angular-material.module';
import { TaskRoutingModule } from '@scripts/modules/tasks-routing.module';
import { ConvertDatePipe } from '@scripts/pipes/convertDate.pipe';

@NgModule({
  declarations: [TaskFormBottomSheetComponent, TaskListComponent, ConvertDatePipe],
  imports: [TaskRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, AngularMaterialModule, TableVirtualScrollModule, TranslateModule],
  exports: [],
})
export class TaskModule {}
