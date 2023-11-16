import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-page',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyPageComponent {}
