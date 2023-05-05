// CORE
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GUARD
import { AuthGuard } from '@scripts/guards/auth.guard';
import { LoggedInAuthGuard } from '@scripts/guards/loggedIn.guard';
import { RoleGuard } from '@scripts/guards/role.guard';

// AUTH
import { LogInComponent } from '@app/components/auth/login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';

// PAGES
import { EmptyPageComponent } from '@app/components/pages/empty-page.component';
import { HomepageComponent } from '@app/components/pages/home/home.component';
import { ProfileComponent } from '@app/components/pages/profile/profile.component';
import { SettingsComponent } from '@app/components/pages/settings/settings.component';
import { StatisticsComponent } from '@app/components/pages/statistics/statistics.component';

// ENUM
import { ERole } from '@scripts/models/enum/role.enum';

const routes: Routes = [
    { path: 'home', component: HomepageComponent, canActivate: [LoggedInAuthGuard] },
    { path: 'login', component: LogInComponent, canActivate: [LoggedInAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [LoggedInAuthGuard] },
    {
        path: 'tasks',
        loadChildren: () => import('@scripts/modules/tasks.module').then((module) => module.TaskModule)
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
