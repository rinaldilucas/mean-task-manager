const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const blacklist = require('../redis/blacklist-handler');

async function verifyBlacklistForToken(token) {
    const isTokenBlacklisted = await blacklist.hasToken(token);
    if (isTokenBlacklisted) {
        throw new jwt.JsonWebTokenError('Token invalidated by logout.');
    }
}

passport.use(
    new BearerStrategy(async (token, done) => {
        try {
            await verifyBlacklistForToken(token);
            const payload = jwt.verify(token, process.env.JWT_KEY);
            done(null, payload, { token: token });
        } catch (error) {
            done(error);
        }
    }),
);
