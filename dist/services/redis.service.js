"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = require("crypto");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _redis = require("redis");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const generateTokenHash = token => (0, _crypto.createHash)('sha256').update(token).digest('hex');
class RedisService {
  constructor() {
    this.client = (0, _redis.createClient)();
  }
  async set({
    key,
    value,
    timeType,
    time
  }) {
    await this.client.connect();
    await this.client.set(key, value, timeType, time);
    await this.client.disconnect();
  }
  async get(key) {
    await this.client.connect();
    const result = await this.client.get(key);
    await this.client.disconnect();
    return result;
  }
  async addToBlacklist(token) {
    if (token) {
      const expirationDate = _jsonwebtoken.default.decode(token).exp;
      const tokenHash = generateTokenHash(token);
      this.set({
        key: tokenHash,
        value: 1,
        timeType: 'EX',
        time: expirationDate
      });
    }
  }
  async verifyBlacklistForToken(token) {
    const isTokenBlacklisted = await this.hasToken(token);
    if (isTokenBlacklisted) return true;else return false;
  }
  async hasToken(token) {
    const tokenHash = generateTokenHash(token);
    const result = await this.get(tokenHash);
    return result === '1';
  }
}
var _default = new RedisService();
exports.default = _default;