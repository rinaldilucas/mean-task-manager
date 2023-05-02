import jwt from 'jsonwebtoken';
import { ServerError } from '../errors/server.error';

export default async (req, res, next) => {
    if (req.headers.authorization) {
        const [bearerToken, token] = req.headers.authorization.split(' ');
        console.log(bearerToken);
        if (bearerToken === 'Bearer') {
            try {
                const decoded: any = jwt.verify(token, String(process.env.JWT_KEY));
                if (
                    decoded.type !== process.env.JWT_ACCESS ||
                    decoded.aud !== process.env.JWT_AUDIENCE ||
                    decoded.iss !== process.env.JWT_ISSUER
                ) {
                    next(new ServerError(401, 'Invalid token type'));
                }
                req.email = decoded.sub;
                req.name = String(decoded.name);
                return next();
            } catch (err) {
                next(new ServerError(401, 'Invalid jwt token'));
            }
        }
        next(new ServerError(401, 'Invalid bearer token'));
    }
    next(new ServerError(400, 'Authorization header is not present'));
};
