import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup } from '@angular/forms';

import { debounceTime, first, map, switchMap } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { UserService } from '@app/scripts/services/user.service';

export class CustomValidators {
  static emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  static incremental(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /12345|23456|34567|45678|56789/;

    if (control.value && regex.test(control.value)) {
      return { hasIncremental: true };
    }
    return undefined;
  }

  static sequential(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /(.)\1{4,}/;

    if (control.value && regex.test(control.value)) {
      return { hasSequential: true };
    }
    return undefined;
  }

  static capitalized(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /[A-Z]/;
    if (control.value && !regex.test(control.value)) {
      return { hasntCapitalized: true };
    }
    return undefined;
  }

  static number(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /\d/;
    if (control.value && !regex.test(control.value)) {
      return { hasntNumber: true };
    }
    return undefined;
  }

  static specialCharacters(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /^(?=.*[\p{P}\p{S}]).+$/u;
    if (control.value && !regex.test(control.value)) {
      return { hasntSpecialCharacter: true };
    }
    return undefined;
  }

  static equalsTo(otherField: string): (arg0: FormControl) => { [key: string]: boolean } | undefined {
    return (formControl: FormControl): { [key: string]: boolean } | undefined => {
      const field = (<FormGroup>formControl.root).get(otherField);
      if (field?.value !== formControl.value) {
        return { equalsTo: true };
      }
      return undefined;
    };
  }

  static checkEmail(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(300),
        switchMap((email: string) => userService.checkIfEmailExists(email)),
        map((response: IQueryResult<{ emailExists: string }>) => {
          if (response.data[0]?.emailExists) {
            return { emailExists: true };
          } else {
            return null;
          }
        }),
        first(),
      );
    };
  }
}
