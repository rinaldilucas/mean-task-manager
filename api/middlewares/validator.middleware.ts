import { validationResult } from 'express-validator';
import { StatusCode } from 'status-code-enum';
import { responseError } from '../utils/http-handler';

export const verifyValidations = (request: any, response: any, next: any) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) return responseError(response, errors.array(), StatusCode.ClientErrorBadRequest);
    else next();
};
