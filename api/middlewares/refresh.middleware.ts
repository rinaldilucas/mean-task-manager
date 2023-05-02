import jwt from 'jsonwebtoken';
import redisService from '../services/redis.service';
import { responseError } from '../utils/http-handler';
import StatusCode from 'status-code-enum';

export default async (request, response, next: any) => {
    if (request.body.refresh) {
        const token = request.body.refresh;
        try {
            const decoded: any = jwt.verify(token, String(process.env.JWT_KEY));
            if (
                decoded.type !== process.env.JWT_REFRESH ||
                decoded.aud !== process.env.JWT_AUDIENCE ||
                decoded.iss !== process.env.JWT_ISSUER
            ) {
                next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Invalid token type'));
            }

            const value = await redisService.get(token);
            if (value) { next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Refresh token was already used')); }

            request.email = decoded.sub;
            request.name = decoded.name;
            return next();
        } catch (error) {
            next(responseError(response, error, StatusCode.ClientErrorUnauthorized, 'Invalid jwt token'));
        }
    }

    next(responseError(response, {}, StatusCode.ClientErrorBadRequest, 'Refresh token is not present'));
};
