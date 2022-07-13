// CORE
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChartsModule } from 'ng2-charts';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// MODULES
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { AppRoutingModule } from '@app/scripts/modules/app-routing.module';
import { InterceptorModule } from '@app/scripts/modules/interceptor.module';
import { AppComponent } from '@app/pages/app.component';

// SERVICES
import { AuthService } from '@app/scripts/services/auth.service';
import { UtilService } from '@app/scripts/services/util.service';
import { UserService } from '@app/scripts/services/user.service';
import { TaskService } from '@app/scripts/services/task.service';

// COMPONENTS
import { MainNavComponent } from '@app/pages/_components/main-nav/main-nav.component';
import { ProfileComponent } from '@app/pages/_components/profile/profile.component';
import { TasksDoneComponent } from '@app/pages/_components/charts/tasks-done/tasks-done.component';
import { WeekEarningsComponent } from '@app/pages/_components/charts/week-earnings/week-earnings.component';
import { InitialFundsComponent } from '@app/pages/_components/charts/initial-funds/initial-funds.component';
import { ProfitOverFundsComponent } from '@app/pages/_components/charts/profit-over-funds/profit-over-funds.component';

// PAGES
import { TaskListComponent } from '@app/pages/tasks/task-list/task-list.component';
import { RegisterComponent } from '@app/pages/auth/register/register.component';
import { LogInComponent } from '@app/pages/auth/login/login.component';
import { HomepageComponent } from '@app/pages/home/home.component';
import { SettingsComponent } from '@app/pages/settings/settings.component';

// MODALS
import { TaskFormBottomSheetComponent, TaskFormEntryComponent } from '@app/pages/tasks/task-form/task-form.component';

// PIPES
import { ConvertDatePipe } from '@app/scripts/pipes/convertDate.pipe';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localePt, 'pt-BR');

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        LogInComponent,
        RegisterComponent,
        ProfileComponent,
        SettingsComponent,
        MainNavComponent,
        TasksDoneComponent,
        WeekEarningsComponent,
        InitialFundsComponent,
        ProfitOverFundsComponent,
    ],
    entryComponents: [TaskFormBottomSheetComponent],
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
                deps: [HttpClient],
            },
        }),
    ],
    providers: [AuthService, UtilService, TaskService, UserService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
