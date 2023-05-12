// CORE
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GUARD
import { AuthGuard } from '@scripts/guards/auth.guard';
import { LoggedInAuthGuard } from '@scripts/guards/loggedIn.guard';
import { RoleGuard } from '@scripts/guards/role.guard';

// AUTH
import { LogInComponent } from '@components/auth/login/login.component';
import { RegisterComponent } from '@components/auth/register/register.component';

// PAGES
import { EmptyPageComponent } from '@components/pages/empty-page.component';
import { HomepageComponent } from '@components/pages/home/home.component';
import { ProfileComponent } from '@components/pages/profile/profile.component';
import { SettingsComponent } from '@components/pages/settings/settings.component';
import { StatisticsComponent } from '@components/pages/statistics/statistics.component';

// ENUM
import { ERole } from '@scripts/models/enum/role.enum';

const routes: Routes = [
    { path: 'home', component: HomepageComponent, canActivate: [LoggedInAuthGuard] },
    { path: 'login', component: LogInComponent, canActivate: [LoggedInAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [LoggedInAuthGuard] },
    {
        path: 'tasks',
        loadChildren: () => import('@scripts/modules/tasks.module').then((module) => module.TaskModule),
        canActivate: [AuthGuard],
        canLoad: [AuthGuard]
    },
    { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ERole.user } },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: EmptyPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
