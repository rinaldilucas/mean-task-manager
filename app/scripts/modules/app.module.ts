import { ScrollingModule } from '@angular/cdk/scrolling';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localePt from '@angular/common/locales/pt';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ChartsModule } from 'ng2-charts';
import { Observable, from } from 'rxjs';

import { AppComponent } from '@components/app.component';
import { LogInComponent } from '@components/auth/login/login.component';
import { RegisterComponent } from '@components/auth/register/register.component';
import { HomepageComponent } from '@components/pages/home/home.component';
import { ProfileComponent } from '@components/pages/profile/profile.component';
import { SettingsComponent } from '@components/pages/settings/settings.component';
import { StatisticsComponent } from '@components/pages/statistics/statistics.component';
import { TasksDoneComponent } from '@components/shared/charts/tasks-done/tasks-done.component';
import { WeeklyDoneComponent } from '@components/shared/charts/weekly-done/weekly-done.component';
import { ConfirmationDialogComponent } from '@components/shared/dialogs/confirmation-dialog/confirmation-dialog';
import { HeaderComponent } from '@components/shared/header/header.component';
import { AutocompleteOffDirective } from '@scripts/directives/autocompleteOff.directive';
import { AngularMaterialModule } from '@scripts/modules/angular-material.module';
import { AppRoutingModule } from '@scripts/modules/app-routing.module';
import { InterceptorModule } from '@scripts/modules/interceptor.module';

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(import(`../../assets/i18n/${lang}.json`));
  }
}

registerLocaleData(localeEn, 'en');
registerLocaleData(localeEs, 'es');
registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
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
    AutocompleteOffDirective,
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
        useClass: WebpackTranslateLoader,
      },
    }),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
