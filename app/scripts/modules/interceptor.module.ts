import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from '@app/scripts/helpers/jwt.interceptor';
import { ErrorInterceptor } from '@app/scripts/helpers/error.interceptor';

@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
})
export class InterceptorModule {}
