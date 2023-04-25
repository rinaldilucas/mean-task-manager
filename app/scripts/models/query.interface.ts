import { Observable } from 'rxjs';

import { QueriesHandlerService } from '@app/scripts/services/queriesHandler.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';

export interface IQuery<T> {
    isValid(): boolean;
    execute(queriesHandler: QueriesHandlerService): Observable<IQueryResult<T>>;
}
