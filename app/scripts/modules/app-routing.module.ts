// ANGULAR
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
  { path: 'home', component: HomepageComponent, canActivate: [LoggedInAuthGuard], data: { state: 'home' } },
  { path: 'login', component: LogInComponent, canActivate: [LoggedInAuthGuard], data: { state: 'login' } },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInAuthGuard], data: { state: 'register' } },
  {
    path: 'tasks',
    loadChildren: () => import('@scripts/modules/tasks.module').then((module) => module.TaskModule),
    canLoad: [AuthGuard],
  },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard], data: { state: 'statistics' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { state: 'profile' } },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ERole.user, state: 'settings' } },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
