// CORE
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// MODULES
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { TaskRoutingModule } from '@app/pages/tasks/tasks-routing.module';

// PAGES
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';

// MODALS
import { TaskFormBottomSheetComponent } from '@app/pages/tasks/task-form/task-form.component';
import { ConvertDatePipe } from '@app/scripts/pipes/convertDate.pipe';

@NgModule({
    declarations: [TaskFormBottomSheetComponent, TaskListComponent, ConvertDatePipe],
    imports: [TaskRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, AngularMaterialModule, TableVirtualScrollModule, TranslateModule],
    exports: [],
})
export class TaskModule {}
