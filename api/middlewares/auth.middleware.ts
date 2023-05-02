import { responseError } from '../utils/http-handler';
import jwt from 'jsonwebtoken';
import StatusCode from 'status-code-enum';

export default async (request, response, next) => {
    if (request.headers.authorization) {
        const [bearerToken, token] = request.headers.authorization.split(' ');

        if (bearerToken === 'Bearer') {
            try {
                const decoded: any = jwt.verify(token, String(process.env.JWT_KEY));
                if (
                    decoded.type !== process.env.JWT_ACCESS ||
                    decoded.aud !== process.env.JWT_AUDIENCE ||
                    decoded.iss !== process.env.JWT_ISSUER
                ) {
                    next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Invalid token type'));
                }
                request.email = decoded.sub;
                return next();
            } catch (error) {
                next(responseError(response, error, StatusCode.ClientErrorUnauthorized, 'Invalid jwt token'));
            }
        }

        next(responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Invalid bearer token'));
    }
    next(responseError(response, {}, StatusCode.ClientErrorBadRequest, 'Authorization header is not present'));
};
