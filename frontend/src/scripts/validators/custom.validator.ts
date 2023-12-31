import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup } from '@angular/forms';

import { debounceTime, first, map, switchMap } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { UserService } from '@app/scripts/services/user.service';

export class CustomValidators {
  static emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  static incremental(control: FormControl): { [key: string]: boolean } {
    const regex = /12345|23456|34567|45678|56789/;

    if (control.value && regex.test(control.value)) {
      return { hasIncremental: true };
    } else {
      return { hasIncremental: false };
    }
  }

  static sequential(control: FormControl): { [key: string]: boolean } {
    const regex = /(.)\1{4,}/;

    if (control.value && regex.test(control.value)) {
      return { hasSequential: true };
    } else {
      return { hasSequential: false };
    }
  }

  static capitalized(control: FormControl): { [key: string]: boolean } {
    const regex = /[A-Z]/;
    if (control.value && !regex.test(control.value)) {
      return { hasntCapitalized: true };
    } else {
      return { hasntCapitalized: false };
    }
  }

  static number(control: FormControl): { [key: string]: boolean } {
    const regex = /\d/;
    if (control.value && !regex.test(control.value)) {
      return { hasntNumber: true };
    } else {
      return { hasntNumber: false };
    }
  }

  static specialCharacters(control: FormControl): { [key: string]: boolean } {
    const regex = /^(?=.*[\p{P}\p{S}]).+$/u;
    if (control.value && !regex.test(control.value)) {
      return { hasntSpecialCharacter: true };
    } else {
      return { hasntSpecialCharacter: false };
    }
  }

  static equalsTo(otherField: string): (arg0: FormControl) => { [key: string]: boolean } | undefined {
    return (formControl: FormControl): { [key: string]: boolean } | undefined => {
      const field = (<FormGroup>formControl.root).get(otherField);
      if (field?.value !== formControl.value) {
        return { equalsTo: true };
      } else {
        return { equalsTo: false };
      }
    };
  }

  static checkEmail(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(300),
        switchMap((email: string) => userService.checkIfEmailExists(email)),
        map((response: IQueryResult<IUser>) => {
          if (response?.totalCount > 0) {
            return { emailExists: true };
          } else {
            return { emailExists: false };
          }
        }),
        first(),
      );
    };
  }
}
