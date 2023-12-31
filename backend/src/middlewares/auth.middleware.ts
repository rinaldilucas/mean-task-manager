import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import StatusCode from 'status-code-enum';

import RedisService from '@api/services/redis.service';
import { responseError } from '@api/utils/http.handler';

export default async (request: Request, response: Response, next: NextFunction): Promise<NextFunction | undefined | void> => {
  const language = request.headers.language;

  if (request.headers.authorization) {
    const [bearerToken, token] = request.headers.authorization.split(' ');

    if (bearerToken === 'Bearer') {
      try {
        const blacklistedToken = await RedisService.findBlacklistedToken(token as string);

        if (blacklistedToken) {
          if (language === 'en-US')
            return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Token invalidated by logout.'));
          else return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Token invalidado por logout.'));
        }

        const decoded: any = jwt.verify(token as string, String(process.env.JWT_KEY));
        if (
          decoded.type !== process.env.JWT_ACCESS ||
          decoded.aud !== process.env.JWT_AUDIENCE ||
          decoded.iss !== process.env.JWT_ISSUER
        ) {
          if (language === 'en-US')
            return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Invalid token type.'));
          else return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Tipo de token inválido.'));
        }

        return next();
      } catch (error) {
        if (language === 'en-US')
          return next(responseError(response, error, StatusCode.ClientErrorUnauthorized, 'Invalid jwt token.'));
        else return next(responseError(response, error, StatusCode.ClientErrorUnauthorized, 'JWT inválido.'));
      }
    }

    if (language === 'en-US') return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Invalid bearer token.'));
    else return next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Bearer token inválido.'));
  }

  if (language === 'en-US')
    return next(responseError(response, {}, StatusCode.ClientErrorBadRequest, 'Authorization header is not present.'));
  else return next(responseError(response, {}, StatusCode.ClientErrorBadRequest, 'Cabeçalho de autorização não está presente.'));
};
