import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from '@app/scripts/services/shared.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-unsubscriber',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class Unsubscriber implements OnDestroy {
    private subscriptions = new SubSink();
    disposeServicesOnDestroy = false;

    ngOnDestroy (): void {
        this.resetSubscriptions();
    }

    resetSubscriptions (): void {
        this.subscriptions.unsubscribe();
        if (this.disposeServicesOnDestroy) SharedService.disposeSubscriptions();
    }

    addSubscription (subscription: Subscription): void {
        this.subscriptions.add(subscription);
    }
}
