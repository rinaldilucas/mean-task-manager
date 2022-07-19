import httpHandler from '../utils/http-handler';
import { StatusCode } from 'status-code-enum';
import { validationResult } from 'express-validator';

export const verifyValidations = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) return httpHandler.error(response, errors.array(), StatusCode.ClientErrorBadRequest);
    else next();
};
