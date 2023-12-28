import { Request, Response } from 'express';
import ExpressBrute from 'express-brute';
import StatusCode from 'status-code-enum';

import { responseError } from '@api/utils/http.handler';

const failCallback = (request: Request, response: Response): Response<any, Record<string, any>> => {
  const language = request.headers.language;

  if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorTooManyRequests, 'Too many attempts to login.');
  else return responseError(response, {}, StatusCode.ClientErrorTooManyRequests, 'Muitas tentativas de login.');
};

const store = new ExpressBrute.MemoryStore();
export const bruteforce = new ExpressBrute(store, {
  freeRetries: process.env.ENVIRONMENT === 'PRODUCTION' ? 5 : 1000,
  minWait: 5 * 60 * 1000,
  maxWait: 60 * 60 * 1000,
  failCallback,
});
