"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyBlacklistForToken = exports.hasToken = exports.add = void 0;
var _crypto = require("crypto");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _util = require("util");
var _redis = _interopRequireDefault(require("../utils/redis.handler"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const existsAsync = (0, _util.promisify)(_redis.default.exists).bind(_redis.default);
const setAsync = (0, _util.promisify)(_redis.default.set).bind(_redis.default);
const generateTokenHash = token => {
  return (0, _crypto.createHash)('sha256').update(token).digest('hex');
};
const add = async token => {
  if (token) {
    const expirationDate = _jsonwebtoken.default.decode(token).exp;
    const tokenHash = generateTokenHash(token);
    await setAsync(tokenHash, '');
    _redis.default.expireat(tokenHash, expirationDate);
  }
};
exports.add = add;
const hasToken = async token => {
  const tokenHash = generateTokenHash(token);
  const result = await existsAsync(tokenHash);
  return result === 1;
};
exports.hasToken = hasToken;
const verifyBlacklistForToken = async token => {
  const isTokenBlacklisted = await hasToken(token);
  if (isTokenBlacklisted) return true;else return false;
};
exports.verifyBlacklistForToken = verifyBlacklistForToken;