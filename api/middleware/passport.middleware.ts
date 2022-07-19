import passport from 'passport';
import { responseError } from '../utils/http-handler';
import { StatusCode } from 'status-code-enum';

export const applyBearerStrategy = (request, response, next) => {
    passport.authenticate('bearer', { session: false }, (error, payload) => {
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
