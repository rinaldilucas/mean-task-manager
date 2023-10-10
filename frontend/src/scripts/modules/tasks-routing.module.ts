import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormComponent } from '@app/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { CanDeactivateGuard } from '@app/scripts/guards/can-deactivate.guard';
import { TaskResolver } from '@app/scripts/resolvers/task.resolver';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    children: [
      { path: 'new', component: TaskFormComponent, canDeactivate: [CanDeactivateGuard], resolve: { taskData: TaskResolver } },
      { path: 'edit/:id', component: TaskFormComponent, canDeactivate: [CanDeactivateGuard], resolve: { taskData: TaskResolver } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule { }
