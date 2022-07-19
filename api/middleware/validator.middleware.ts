import { responseError } from '../utils/http-handler';
import { StatusCode } from 'status-code-enum';
import { validationResult } from 'express-validator';

export const verifyValidations = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) return responseError(response, errors.array(), StatusCode.ClientErrorBadRequest);
    else next();
};
