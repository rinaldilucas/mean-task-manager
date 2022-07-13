import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { first, map, switchMap } from 'rxjs/operators';

import { UserService } from '@app/scripts/services/user.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IUser } from '@app/scripts/models/user.interface';

export class UsernameValidator {
    static createValidator(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return control.valueChanges.pipe(
                switchMap((username: string) => userService.checkIfUsernameExists(username)),
                map((response: IQueryResult<IUser>) => (response?.count > 0 ? { userexists: true } : null)),
                first(),
            );
        };
    }
}
