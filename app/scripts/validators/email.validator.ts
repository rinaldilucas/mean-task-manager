import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { first, map, switchMap } from 'rxjs/operators';

import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { UserService } from '@scripts/services/user.service';

export class EmailValidator {
    static createValidator (userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return control.valueChanges.pipe(
                switchMap((email: string) => userService.checkIfEmailExists(email)),
                map((response: IQueryResult<IUser>) => (response?.totalCount > 0 ? { alreadyregistered: true } : null)),
                first()
            );
        };
    }
}
