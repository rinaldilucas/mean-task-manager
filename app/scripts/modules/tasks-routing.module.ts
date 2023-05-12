import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormEntryComponent } from '@components/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@components/pages/tasks/task-list/task-list.component';
import { AuthGuard } from '@scripts/guards/auth.guard';
import { FormGuard } from '@scripts/guards/form.guard';

const routes: Routes = [
    {
        path: '',
        component: TaskListComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'add', component: TaskFormEntryComponent },
            { path: 'edit/:id', component: TaskFormEntryComponent, canDeactivate: [FormGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule {}
