import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormEntryComponent } from '@app/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { CanDeactivateGuard } from '@app/scripts/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    children: [
      {
        path: 'new',
        component: TaskFormEntryComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'edit/:id',
        component: TaskFormEntryComponent,
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
