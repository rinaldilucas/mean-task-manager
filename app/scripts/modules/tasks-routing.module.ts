import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormEntryComponent } from '@components/pages/tasks/task-form/task-form.component';
import { TaskListComponent } from '@components/pages/tasks/task-list/task-list.component';

const routes: Routes = [
    {
        path: '',
        component: TaskListComponent,
        children: [
            { path: 'add', component: TaskFormEntryComponent },
            { path: 'edit/:id', component: TaskFormEntryComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule {}
