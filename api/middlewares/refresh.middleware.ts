import jwt from 'jsonwebtoken';
import { ServerError } from '../errors/server.error';
import redisService from '../services/redis.service';

export default async (req, res, next) => {
    if (req.body.refresh) {
        const token = req.body.refresh;
        try {
            const decoded: any = jwt.verify(token, String(process.env.JWT_KEY));
            if (
                decoded.type !== process.env.JWT_REFRESH ||
                decoded.aud !== process.env.JWT_AUDIENCE ||
                decoded.iss !== process.env.JWT_ISSUER
            ) {
                next(new ServerError(401, 'Invalid token type'));
            }
            const value = await redisService.get(token);
            if (value) {
                next(new ServerError(401, 'Refresh token was already used'));
            }
            req.email = decoded.sub;
            req.name = decoded.name;
            return next();
        } catch (err) {
            next(new ServerError(401, 'Invalid jwt token'));
        }
    }
    next(new ServerError(400, 'Refresh token is not present'));
};
