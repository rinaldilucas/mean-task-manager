import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { first, map, switchMap } from 'rxjs/operators';

import { UserService } from '@app/scripts/services/user.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IUser } from '@app/scripts/models/user.interface';

export class EmailValidator {
    static createValidator(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return control.valueChanges.pipe(
                switchMap((email: string) => userService.checkIfEmailExists(email)),
                map((response: IQueryResult<IUser>) => (response?.count > 0 ? { emailexists: true } : null)),
                first(),
            );
        };
    }
}
