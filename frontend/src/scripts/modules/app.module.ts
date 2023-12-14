import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localePt from '@angular/common/locales/pt';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { Observable, from } from 'rxjs';

import { AppComponent } from '@app/components/app.component';
import { LogInComponent } from '@app/components/auth/login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';
import { TasksDoneComponent } from '@app/components/shared/charts/tasks-done/tasks-done.component';
import { WeeklyDoneComponent } from '@app/components/shared/charts/weekly-done/weekly-done.component';
import { ConfirmationDialogComponent } from '@app/components/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { HeaderComponent } from '@app/components/shared/header/header.component';
import { HomepageComponent } from '@app/pages/home/home.component';
import { ProfileComponent } from '@app/pages/profile/profile.component';
import { SettingsComponent } from '@app/pages/settings/settings.component';
import { StatisticsComponent } from '@app/pages/statistics/statistics.component';
import { AutoCompleteOffDirective } from '@app/scripts/directives/autocomplete-off.directive';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { AppRoutingModule } from '@app/scripts/modules/app-routing.module';
import { CustomComponentsModule } from '@app/scripts/modules/custom-components.module';
import { InterceptorModule } from '@app/scripts/modules/interceptor.module';

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(import(`../../../assets/i18n/${lang}.json`));
  }
}

registerLocaleData(localeEn, 'en-US');
registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    AutoCompleteOffDirective,
    ConfirmationDialogComponent,
    HeaderComponent,
    HeaderComponent,
    HomepageComponent,
    LogInComponent,
    ProfileComponent,
    RegisterComponent,
    SettingsComponent,
    StatisticsComponent,
    StatisticsComponent,
    TasksDoneComponent,
    WeeklyDoneComponent,
  ],
  imports: [
    AngularMaterialModule,
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    CommonModule,
    CustomComponentsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    InterceptorModule,
    ReactiveFormsModule,
    RouterModule,
    ScrollingModule,
    TableVirtualScrollModule,
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
export class AppModule {}
