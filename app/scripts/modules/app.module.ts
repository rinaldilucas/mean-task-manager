// ANGULAR
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

// LIBS
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ChartsModule } from 'ng2-charts';

// MODULES
import { AngularMaterialModule } from '@scripts/modules/angular-material.module';
import { AppRoutingModule } from '@scripts/modules/app-routing.module';
import { InterceptorModule } from '@scripts/modules/interceptor.module';

// COMPONENTS
import { AppComponent } from '@components/app.component';
import { TasksDoneComponent } from '@components/shared/charts/tasks-done/tasks-done.component';
import { WeeklyDoneComponent } from '@components/shared/charts/weekly-done/weekly-done.component';
import { HeaderComponent } from '@components/shared/header/header.component';

// AUTH
import { LogInComponent } from '@components/auth/login/login.component';
import { RegisterComponent } from '@components/auth/register/register.component';

// PAGES
import { HomepageComponent } from '@components/pages/home/home.component';
import { ProfileComponent } from '@components/pages/profile/profile.component';
import { SettingsComponent } from '@components/pages/settings/settings.component';
import { StatisticsComponent } from '@components/pages/statistics/statistics.component';
import { ConfirmationDialogComponent } from '@components/shared/dialogs/confirmation-dialog/confirmation-dialog';
import { AutocompleteOffDirective } from '@scripts/directives/autocompleteOff.directive';

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
        WeeklyDoneComponent,
        StatisticsComponent,
        ConfirmationDialogComponent,
        AutocompleteOffDirective
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
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
