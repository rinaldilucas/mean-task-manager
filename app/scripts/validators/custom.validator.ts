import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup } from '@angular/forms';

import { debounceTime, first, map, switchMap } from 'rxjs';

import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { AuthService } from '@services/auth.service';

export class CustomValidators {
    static incremental (control: FormControl): { [key: string]: boolean } | undefined {
        const regex = /([0-9]{4,})/;

        if (control.value && regex.test(control.value)) {
            return { hasIncremental: true };
        }
    }

    static sequential (control: FormControl): { [key: string]: boolean } | undefined {
        const regex = /(.)\1{4,}/;

        if (control.value && regex.test(control.value)) {
            return { hasSequential: true };
        }
    }

    static capitalized (control: FormControl): { [key: string]: boolean } | undefined {
        const regex = /[A-Z]/;
        if (control.value && !regex.test(control.value)) {
            return { hasntCapitalized: true };
        }
    }

    static number (control: FormControl): { [key: string]: boolean } | undefined {
        const regex = /\d/;
        if (control.value && !regex.test(control.value)) {
            return { hasntNumber: true };
        }
    }

    static specialCharacters (control: FormControl): { [key: string]: boolean } | undefined {
        const regex = /^(?=.*[\p{P}\p{S}]).+$/u;
        if (control.value && !regex.test(control.value)) {
            return { hasntSpecialCharacter: true };
        }
    }

    static equalsTo (otherField: string): (AbstractControl) => { [key: string]: boolean } | undefined {
        return (formControl: FormControl): { [key: string]: boolean } | undefined => {
            const field = (<FormGroup>formControl.root).get(otherField);
            if (field?.value !== formControl.value) { return { equalsTo: true }; }
        };
    }

    static checkEmail (authService: AuthService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return control.valueChanges.pipe(
                debounceTime(300),
                switchMap((email: string) => authService.checkIfEmailExists(email)),
                map((response: IQueryResult<IUser>) => (response?.totalCount > 0 ? { emailExists: true } : null)),
                first()
            );
        };
    }
}
