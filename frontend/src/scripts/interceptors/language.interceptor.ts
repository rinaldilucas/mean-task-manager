import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const language = localStorage.getItem('language') ?? 'en-US';
    request = request.clone({
      headers: request.headers.set('Language', language),
    });

    return next.handle(request);
  }
}
