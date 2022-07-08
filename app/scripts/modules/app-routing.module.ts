// CORE
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// GUARD
import { AuthGuard } from '@app/scripts/guards/auth.guard';

// PAGES
import { LogInComponent } from '@app/pages/auth/login/login.component';
import { RegisterComponent } from '@app/pages/auth/register/register.component';
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { EmptyPageComponent } from '@app/pages/_components/empty-page.component';
import { HomepageComponent } from '@app/pages/home/home.component';
import { ProfileComponent } from '@app/pages/_components/profile/profile.component';
import { SettingsComponent } from '@app/pages/settings/settings.component';

// MODALS
import { TaskFormEntryComponent } from '@app/pages/tasks/task-form/task-form.component';

const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    { path: 'login', component: LogInComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'tasks',
        component: TaskListComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'add', component: TaskFormEntryComponent, canActivate: [AuthGuard] },
            { path: 'edit/:id', component: TaskFormEntryComponent, canActivate: [AuthGuard] },
        ],
    },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'callback', component: EmptyPageComponent, canActivate: [AuthGuard] },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', redirectTo: 'tasks', canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
