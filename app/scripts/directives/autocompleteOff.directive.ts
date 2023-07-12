import { Directive, ElementRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[autocompleteOff]',
})
export class AutocompleteOffDirective {
  constructor(private element: ElementRef) {
    const w: any = window;
    const isChrome = w.chrome;

    if (isChrome) {
      this.element.nativeElement.setAttribute('autocomplete', 'new-password');
      this.element.nativeElement.setAttribute('autocorrect', 'off');
      this.element.nativeElement.setAttribute('autocapitalize', 'none');
      this.element.nativeElement.setAttribute('spellcheck', 'false');
    }
  }
}
