import { Observable } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { QueriesHandlerService } from '@app/scripts/services/queriesHandler.service';

export interface IQuery<T> {
    isValid(): boolean;
    execute(queriesHandler: QueriesHandlerService): Observable<IQueryResult<T>>;
}
