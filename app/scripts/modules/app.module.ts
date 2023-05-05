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
import { AngularMaterialModule } from '@scripts/modules/angular-material.module';
import { AppRoutingModule } from '@scripts/modules/app-routing.module';
import { InterceptorModule } from '@scripts/modules/interceptor.module';

// SERVICES
import { AuthService } from '@scripts/services/auth.service';
import { SharedService } from '@scripts/services/shared.service';
import { TaskService } from '@scripts/services/task.service';
import { UserService } from '@scripts/services/user.service';

// COMPONENTS
import { AppComponent } from '@app/components/app.component';
import { MonthlyDoneComponent } from '@app/components/shared/charts/monthly-done/monthly-done.component';
import { ProfitOverFundsComponent } from '@app/components/shared/charts/profit-over-funds/profit-over-funds.component';
import { TasksDoneComponent } from '@app/components/shared/charts/tasks-done/tasks-done.component';
import { WeekEarningsComponent } from '@app/components/shared/charts/week-earnings/week-earnings.component';
import { HeaderComponent } from '@app/components/shared/header/header.component';

// AUTH
import { LogInComponent } from '@app/components/auth//login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';

// PAGES
import { HomepageComponent } from '@app/components/pages/home/home.component';
import { ProfileComponent } from '@app/components/pages/profile/profile.component';
import { SettingsComponent } from '@app/components/pages/settings/settings.component';
import { StatisticsComponent } from '@app/components/pages/statistics/statistics.component';

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
        HeaderComponent,
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
