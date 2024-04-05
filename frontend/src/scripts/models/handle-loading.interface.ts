import { ChangeDetectorRef } from '@angular/core';

export interface IHandleLoading {
  isLoading: boolean;
  changeDetector: ChangeDetectorRef;
  detectChanges?: boolean;
  bothDetections?: boolean;
}
