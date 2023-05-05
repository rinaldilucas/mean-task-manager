import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ErrorInterceptor } from '@scripts/helpers/error.interceptor';
import { LanguageInterceptor } from '@scripts/helpers/language.interceptor';
import { TokenInterceptor } from '@scripts/helpers/token.interceptor';

@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true }
    ]
})
export class InterceptorModule {}
