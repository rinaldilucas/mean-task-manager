import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import StatusCode from 'status-code-enum';

import RedisService from '@api/services/redis.service';
import { responseError } from '@api/utils/http.handler';

export default async (request: Request, response: Response, next: NextFunction): Promise<NextFunction | undefined | void> => {
  const language = request.headers.language;

  if (request.body.refresh) {
    const token = request.body.refresh;

    try {
      const decoded: any = jwt.verify(token, String(process.env.JWT_KEY));
      if (
        decoded.type !== process.env.JWT_REFRESH ||
        decoded.aud !== process.env.JWT_AUDIENCE ||
        decoded.iss !== process.env.JWT_ISSUER
      ) {
        if (language === 'en-US') return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Invalid token type.'));
        else return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Tipo de token inválido.'));
      }

      const value = await RedisService.findBlacklistedToken(token);
      if (value) {
        if (language === 'en-US')
          return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Refresh token was already used.'));
        else return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Refresh token já utilizado.'));
      }

      request.body.email = decoded.sub;
      return next();
    } catch (error) {
      if (language === 'en-US')
        return next(responseError(response, error, StatusCode.ClientErrorUnauthorized, 'Invalid refresh token.'));
      else return next(responseError(response, error, StatusCode.ClientErrorUnauthorized, 'Refresh token inválido.'));
    }
  }

  if (language === 'en-US')
    return next(responseError(response, {}, StatusCode.ClientErrorBadRequest, 'Refresh token is not present.'));
  else return next(responseError(response, {}, StatusCode.ClientErrorBadRequest, 'Refresh token não está presente.'));
};
