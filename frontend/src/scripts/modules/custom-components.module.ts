import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingComponent } from '@app/components/shared/loading/loading.component';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';

@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
})
export class CustomComponentsModule {}
