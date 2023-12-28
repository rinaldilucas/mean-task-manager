import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from 'status-code-enum';

import { responseError } from '@api/utils/http.handler';

export const verifyValidations = (
  request: Request,
  response: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | undefined => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return responseError(response, errors.array(), StatusCode.ClientErrorBadRequest);
  } else {
    next();
    return undefined;
  }
};
