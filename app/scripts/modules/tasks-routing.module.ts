import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormEntryComponent } from '@components/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@components/pages/tasks/task-list/task-list.component';
import { TaskCategoryResolverGuard } from '@scripts/guards/taskCategoryResolver.guard';
import { TaskIdResolverGuard } from '@scripts/guards/taskIdResolver.guard';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    children: [
      { path: 'add', component: TaskFormEntryComponent, resolve: { task: TaskIdResolverGuard, categories: TaskCategoryResolverGuard } },
      { path: 'edit/:id', component: TaskFormEntryComponent, resolve: { task: TaskIdResolverGuard, categories: TaskCategoryResolverGuard } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
