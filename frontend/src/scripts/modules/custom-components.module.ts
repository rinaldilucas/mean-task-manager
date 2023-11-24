import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingComponent } from '@app/components/shared/loading/loading.component';
import { NoDataComponent } from '@app/components/shared/no-data/no-data.component';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';

@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [LoadingComponent, NoDataComponent],
  exports: [LoadingComponent, NoDataComponent],
})
export class CustomComponentsModule {}
