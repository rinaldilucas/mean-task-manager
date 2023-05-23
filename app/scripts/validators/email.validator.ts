import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { delay, first, map, switchMap } from 'rxjs/operators';

import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { AuthService } from '@services/auth.service';

export class EmailValidator {
    static createValidator (authService: AuthService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return control.valueChanges.pipe(
                delay(500),
                switchMap((email: string) => authService.checkIfEmailExists(email)),
                map((response: IQueryResult<IUser>) => (response?.totalCount > 0 ? { emailexists: true } : null)),
                first()
            );
        };
    }
}
