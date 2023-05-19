import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from '@app/scripts/services/shared.service';

@Component({
    selector: 'app-unsubscriber',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class Unsubscriber implements OnDestroy {
    subscriptions: Subscription[] = [];
    disposeServicesOnDestroy = false;

    ngOnDestroy (): void {
        this.resetSubscriptions();
    }

    resetSubscriptions (): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        if (this.disposeServicesOnDestroy) SharedService.disposeSubscriptions();
    }

    addSubscription (subscription: Subscription): void {
        this.subscriptions.push(subscription);
    }
}
