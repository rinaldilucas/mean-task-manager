import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormEntryComponent } from '@app/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { AuthGuard } from '@scripts/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: TaskListComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'add', component: TaskFormEntryComponent, canActivate: [AuthGuard] },
            { path: 'edit/:id', component: TaskFormEntryComponent, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule {}
