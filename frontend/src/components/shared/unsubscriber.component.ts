import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { SubSink } from 'subsink';

import { SharedService } from '@app/scripts/services/shared.service';

@Component({
  selector: 'app-unsubscriber',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class Unsubscriber implements OnDestroy {
  subs = new SubSink();
  removeSubscriptionsFromService = false;

  ngOnDestroy(): void {
    this.resetSubscriptions();
  }

  resetSubscriptions(): void {
    this.subs.unsubscribe();

    if (this.removeSubscriptionsFromService) {
      SharedService.removeSubscriptions();
    }
  }
}
