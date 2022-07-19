import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy } from 'passport-http-bearer';
import { verifyBlacklistForToken } from '../redis/blacklist-handler';

passport.use(
    new Strategy(async (token, done) => {
        try {
            await verifyBlacklistForToken(token);
            const payload = jwt.verify(token, process.env.JWT_KEY);
            done(null, payload, { token });
        } catch (error) {
            done(error);
        }
    })
);
