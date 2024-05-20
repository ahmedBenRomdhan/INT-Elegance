
import { NativeDateAdapter } from '@angular/material/core';

// Create a custom date adapter to format the date
export class CustomDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (this.isValidDate(day, month, year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  }

  private isValidDate(day: number, month: number, year: number): boolean {
    // Check if the date is valid
    const date = new Date(year, month, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  }

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = this._twoDigit(date.getDate());
      const month = this._twoDigit(date.getMonth() + 1);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return date.toDateString();
  }

  private _twoDigit(n: number): string {
    return ('00' + n).slice(-2);
  }
}

// Define the custom date formats
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: { day: 'numeric', month: 'numeric', year: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};
