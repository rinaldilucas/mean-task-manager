// CORE
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

// MODULES
import { AngularMaterialModule } from '@scripts/modules/angular-material.module';
import { TaskRoutingModule } from '@scripts/modules/tasks-routing.module';

import { TaskFormBottomSheetComponent } from '@app/components/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/components/pages/tasks/task-list/task-list.component';
import { ConvertDatePipe } from '@scripts/pipes/convertDate.pipe';

@NgModule({
    declarations: [TaskFormBottomSheetComponent, TaskListComponent, ConvertDatePipe],
    imports: [TaskRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, AngularMaterialModule, TableVirtualScrollModule, TranslateModule],
    entryComponents: [TaskFormBottomSheetComponent],
    exports: []
})
export class TaskModule {}
