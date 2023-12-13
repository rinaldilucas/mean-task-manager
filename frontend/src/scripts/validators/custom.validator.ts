import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup } from '@angular/forms';

import { debounceTime, first, map, switchMap } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { UserService } from '@app/scripts/services/user.service';

export class CustomValidators {
  static emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  static incremental(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /12345|23456|34567|45678|56789/;

    if (control.value && regex.test(control.value)) {
      return { hasIncremental: true };
    }
  }

  static sequential(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /(.)\1{4,}/;

    if (control.value && regex.test(control.value)) {
      return { hasSequential: true };
    }
  }

  static capitalized(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /[A-Z]/;
    if (control.value && !regex.test(control.value)) {
      return { hasntCapitalized: true };
    }
  }

  static number(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /\d/;
    if (control.value && !regex.test(control.value)) {
      return { hasntNumber: true };
    }
  }

  static specialCharacters(control: FormControl): { [key: string]: boolean } | undefined {
    const regex = /^(?=.*[\p{P}\p{S}]).+$/u;
    if (control.value && !regex.test(control.value)) {
      return { hasntSpecialCharacter: true };
    }
  }

  static equalsTo(otherField: string): (AbstractControl) => { [key: string]: boolean } | undefined {
    return (formControl: FormControl): { [key: string]: boolean } | undefined => {
      const field = (<FormGroup>formControl.root).get(otherField);
      if (field?.value !== formControl.value) {
        return { equalsTo: true };
      }
    };
  }

  static checkEmail(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(300),
        switchMap((email: string) => userService.checkIfEmailExists(email)),
        map((response: IQueryResult<IUser>) => (response?.totalCount > 0 ? { emailExists: true } : null)),
        first(),
      );
    };
  }
}