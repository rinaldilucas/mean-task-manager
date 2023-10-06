import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormEntryComponent } from '@app/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { TaskResolver } from '@app/scripts/resolvers/task.resolver';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    children: [
      {
        path: 'add',
        component: TaskFormEntryComponent,
        resolve: { taskData: TaskResolver }
      },
      {
        path: 'edit/:id',
        component: TaskFormEntryComponent,
        resolve: { taskData: TaskResolver }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule { }
