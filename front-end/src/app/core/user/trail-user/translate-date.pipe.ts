
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'translateDate'
})
export class TranslateDatePipe implements PipeTransform {
  constructor(
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {}

  transform(value: string | null, locale: string): string {
    if (!value) {
      return '';
    }

    if (locale === 'fr') {
      return this.datePipe.transform(
        value,
        'd MMMM y à HH:mm', // Desired French date format
        'fr'
      ) || '';
    } else {
      return this.datePipe.transform(
        value,
        'long', // Default date format for other locales
        locale
      ) || '';
    }
  }
}
