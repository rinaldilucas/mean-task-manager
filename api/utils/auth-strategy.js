const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpHandler = require('../utils/http-handler');
const blacklist = require('../redis/blacklist-handler');
const { StatusCode } = require('status-code-enum');

async function verifyPassword(senha, senhaHash) {
    const validPassword = await bcrypt.compare(senha, senhaHash);
    if (!validPassword) {
        httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Invalid password.`);
        // throw new InvalidArgumentError('E-mail ou senha inválidos!');
    }
}

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
