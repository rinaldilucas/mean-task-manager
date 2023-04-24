import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import { verifyBlacklistForToken } from '../redis/blacklist-handler';

passport.use(
    new Strategy(async (token: any, done: any) => {
        try {
            await verifyBlacklistForToken(token);
            const payload = jwt.verify(token, String(process.env.JWT_KEY));
            done(null, payload, { token });
        } catch (error) {
            done(error);
        }
    })
);
