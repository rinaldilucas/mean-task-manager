// CORE
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GUARD
import { AuthGuard } from '@app/scripts/guards/auth.guard';
import { LoggedInAuthGuard } from '@app/scripts/guards/loggedIn.guard';
import { RoleGuard } from '@app/scripts/guards/role.guard';

// PAGES
import { EmptyPageComponent } from '@app/pages/_components/empty-page.component';
import { ProfileComponent } from '@app/pages/_components/profile/profile.component';
import { StatisticsComponent } from '@app/pages/_components/statistics/statistics.component';
import { LogInComponent } from '@app/pages/auth/login/login.component';
import { RegisterComponent } from '@app/pages/auth/register/register.component';
import { HomepageComponent } from '@app/pages/home/home.component';
import { SettingsComponent } from '@app/pages/settings/settings.component';

// ENUM
import { ERole } from '@app/scripts/models/enum/role.enum';

const routes: Routes = [
    { path: 'home', component: HomepageComponent, canActivate: [LoggedInAuthGuard] },
    { path: 'login', component: LogInComponent, canActivate: [LoggedInAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [LoggedInAuthGuard] },
    {
        path: 'tasks',
        loadChildren: () => import('@app/scripts/modules/tasks.module').then((module) => module.TaskModule)
    },
    { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ERole.user } },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', component: EmptyPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
