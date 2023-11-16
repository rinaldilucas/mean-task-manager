import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'convertDate', pure: false })
export class ConvertDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string, pattern = 'mediumDate'): string | null {
    const datePipe: DatePipe = new DatePipe(this.translate.currentLang);
    return datePipe.transform(value, pattern);
  }
}
