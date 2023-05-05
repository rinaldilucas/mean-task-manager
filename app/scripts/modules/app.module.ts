// CORE
import { ScrollingModule } from '@angular/cdk/scrolling';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ChartsModule } from 'ng2-charts';

// MODULES
import { AppComponent } from '@app/pages/app.component';
import { AngularMaterialModule } from '@scripts/modules/angular-material.module';
import { AppRoutingModule } from '@scripts/modules/app-routing.module';
import { InterceptorModule } from '@scripts/modules/interceptor.module';

// SERVICES
import { AuthService } from '@scripts/services/auth.service';
import { SharedService } from '@scripts/services/shared.service';
import { TaskService } from '@scripts/services/task.service';
import { UserService } from '@scripts/services/user.service';

// COMPONENTS
import { MonthlyDoneComponent } from '@app/pages/_components/charts/monthly-done/monthly-done.component';
import { ProfitOverFundsComponent } from '@app/pages/_components/charts/profit-over-funds/profit-over-funds.component';
import { TasksDoneComponent } from '@app/pages/_components/charts/tasks-done/tasks-done.component';
import { WeekEarningsComponent } from '@app/pages/_components/charts/week-earnings/week-earnings.component';
import { MainNavComponent } from '@app/pages/_components/main-nav/main-nav.component';
import { ProfileComponent } from '@app/pages/_components/profile/profile.component';
import { StatisticsComponent } from '@app/pages/_components/statistics/statistics.component';

// PAGES
import { LogInComponent } from '@app/pages/auth/login/login.component';
import { RegisterComponent } from '@app/pages/auth/register/register.component';
import { HomepageComponent } from '@app/pages/home/home.component';
import { SettingsComponent } from '@app/pages/settings/settings.component';

// MODALS

export function createTranslateLoader (http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localePt, 'pt-BR');

@NgModule({
    declarations: [
        AppComponent, //
        HomepageComponent,
        LogInComponent,
        RegisterComponent,
        ProfileComponent,
        SettingsComponent,
        MainNavComponent,
        TasksDoneComponent,
        WeekEarningsComponent,
        MonthlyDoneComponent,
        ProfitOverFundsComponent,
        StatisticsComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        AngularMaterialModule,
        ScrollingModule,
        ChartsModule,
        TableVirtualScrollModule,
        InterceptorModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [AuthService, SharedService, TaskService, UserService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
