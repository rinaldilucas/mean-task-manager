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

  ngOnDestroy(): void {
    this.removeSubscriptions();
  }

  removeSubscriptions(): void {
    this.subs.unsubscribe();
    SharedService.removeSubscriptions();
  }
}
