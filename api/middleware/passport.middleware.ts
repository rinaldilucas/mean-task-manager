import passport from 'passport';
import { StatusCode } from 'status-code-enum';
import { responseError } from '../utils/http-handler';

export const applyBearerStrategy = (request: any, response: any, next: any) => {
    passport.authenticate('bearer', { session: false }, (error: any, payload: any) => {
        if (error?.name === 'JsonWebTokenError') return responseError(response, error, StatusCode.ClientErrorUnauthorized, `Invalid Token. Error: ${error.message}.`);
        if (error?.name === 'TokenExpiredError') return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Token expired.');
        if (error) return responseError(response, error, StatusCode.ServerErrorInternal, `Invalid Token. Error: ${error.message}.`);

        if (!payload) return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Not authorized.');

        request.userData = {
            email: payload.email,
            _id: payload._id
        };

        next();
    })(request, response, next);
};
