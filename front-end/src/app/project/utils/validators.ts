import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maxValidator(max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value && value > max) {
      return { maxExceeded: true };
    }
    return null;
  };
}