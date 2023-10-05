import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormEntryComponent } from '@app/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { TaskCategoryResolver } from '@app/scripts/resolvers/task-category.resolver';
import { TaskIdResolver } from '@app/scripts/resolvers/task-id.resolver';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    children: [
      {
        path: 'add',
        component: TaskFormEntryComponent,
        resolve: { task: TaskIdResolver, categories: TaskCategoryResolver }
      },
      {
        path: 'edit/:id',
        component: TaskFormEntryComponent,
        resolve: { task: TaskIdResolver, categories: TaskCategoryResolver }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule { }
