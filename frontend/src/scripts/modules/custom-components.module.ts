import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoaderComponent } from '@app/components/shared/loader/loader.component';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';

@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
})
export class CustomComponentsModule { }
