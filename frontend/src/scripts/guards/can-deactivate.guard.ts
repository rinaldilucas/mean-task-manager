import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { Observable } from 'rxjs';

export interface OnDeactivate {
  onDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard implements CanDeactivate<OnDeactivate> {
  canDeactivate(component: OnDeactivate) {
    return component.onDeactivate ? component.onDeactivate() : true;
  }
}