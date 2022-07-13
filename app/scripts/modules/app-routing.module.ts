// CORE
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// GUARD
import { AuthGuard } from '@app/scripts/guards/auth.guard';
import { RoleGuard } from '@app/scripts/guards/role.guard';

// PAGES
import { EmptyPageComponent } from '@app/pages/_components/empty-page.component';
import { LogInComponent } from '@app/pages/auth/login/login.component';
import { RegisterComponent } from '@app/pages/auth/register/register.component';
import { HomepageComponent } from '@app/pages/home/home.component';
import { ProfileComponent } from '@app/pages/_components/profile/profile.component';
import { SettingsComponent } from '@app/pages/settings/settings.component';

// ENUM
import { ERole } from '@app/scripts/models/enum/role.enum';

const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    { path: 'login', component: LogInComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'tasks',
        loadChildren: () => import('@app/pages/tasks/tasks.module').then((module) => module.TaskModule),
    },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ERole.user } },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', component: EmptyPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
