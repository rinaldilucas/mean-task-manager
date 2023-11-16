import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AutoCompleteOffDirective } from '@app/scripts/directives/autocomplete-off.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [AutoCompleteOffDirective],
})
export class DirectiveModule {}
