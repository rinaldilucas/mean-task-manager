import { Injectable } from '@angular/core';

import { IFormDeactivate } from '../models/formDeactivate';

@Injectable({ providedIn: 'root' })
export class FormGuard {
    canDeactivate (component: IFormDeactivate): void {
        component.canDeactivate();
    }
}
