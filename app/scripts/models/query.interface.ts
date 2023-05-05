import { Observable } from 'rxjs';

import { IQueryResult } from '@scripts/models/queryResult.interface';
import { QueriesHandlerService } from '@services/queriesHandler.service';

export interface IQuery<T> {
    isValid(): boolean;
    execute(queriesHandler: QueriesHandlerService): Observable<IQueryResult<T>>;
}
