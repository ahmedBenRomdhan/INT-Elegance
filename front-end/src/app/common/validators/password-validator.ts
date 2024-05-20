import { AbstractControl } from '@angular/forms';

export class PasswordValidator {

    static MatchPassword(AC: AbstractControl) {
        // @ts-ignore
      if (AC.get('confirm_password').dirty) {
            // @ts-ignore
          if (AC.get('password').value != AC.get('confirm_password').value) {

                return { MatchPassword: true };
            } else {
                return null;
            }
        }


    }
}
