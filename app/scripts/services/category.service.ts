import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@app/environments/environment';
import { ICategory } from '@scripts/models/category.interface';
import { AuthService } from '@services/auth.service';
import { CrudService } from '@services/crud.service';
import { SharedService } from '@services/shared.service';

const endpoint = environment.baseUri + '/categories';

@Injectable({ providedIn: 'root' })
export class CategoryService extends CrudService<ICategory> {
    constructor (
        protected override http: HttpClient, //
        protected override sharedService: SharedService,
        protected override authService: AuthService
    ) {
        super(http, sharedService, authService, endpoint);
    }
}
