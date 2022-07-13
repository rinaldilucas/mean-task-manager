import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/scripts/guards/auth.guard';
import { TaskFormEntryComponent } from '@app/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';

const routes: Routes = [
    {
        path: '',
        component: TaskListComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'add', component: TaskFormEntryComponent, canActivate: [AuthGuard] },
            { path: 'edit/:id', component: TaskFormEntryComponent, canActivate: [AuthGuard] },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TaskRoutingModule {}
