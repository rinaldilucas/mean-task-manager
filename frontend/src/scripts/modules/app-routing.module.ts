import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogInComponent } from '@app/components/auth/login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';
import { EmptyPageComponent } from '@app/pages/empty-page/empty-page.component';
import { HomepageComponent } from '@app/pages/home/home.component';
import { ProfileComponent } from '@app/pages/profile/profile.component';
import { SettingsComponent } from '@app/pages/settings/settings.component';
import { StatisticsComponent } from '@app/pages/statistics/statistics.component';
import { AuthGuard } from '@app/scripts/guards/auth.guard';
import { LoggedInAuthGuard } from '@app/scripts/guards/logged-in.guard';
import { RoleGuard } from '@app/scripts/guards/role.guard';
import { ERole } from '@app/scripts/models/enums/role.enum';
import { CategoryResolver } from '@app/scripts/resolvers/category.resolver';

const routes: Routes = [
  {
    path: 'home',
    component: HomepageComponent,
    canActivate: [LoggedInAuthGuard],
    data: { state: 'home' },
  },
  {
    path: 'login',
    component: LogInComponent,
    canActivate: [LoggedInAuthGuard],
    data: { state: 'login' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoggedInAuthGuard],
    data: { state: 'register' },
  },
  {
    path: 'tasks',
    loadChildren: () => import('@app/scripts/modules/tasks.module').then((module) => module.TaskModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    data: { state: 'statistics' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { state: 'profile' },
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ERole.user, state: 'settings' },
    resolve: { categoryData: CategoryResolver },
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
