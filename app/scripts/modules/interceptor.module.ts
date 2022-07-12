import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokenInterceptor } from '@app/scripts/helpers/token.interceptor';
import { ErrorInterceptor } from '@app/scripts/helpers/error.interceptor';

@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
})
export class InterceptorModule {}
