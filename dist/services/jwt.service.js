"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _redis = _interopRequireDefault(require("./redis.service"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class JwtService {
  generate(email, userId, role) {
    const access = _jsonwebtoken.default.sign({
      email,
      userId,
      role,
      type: process.env.JWT_ACCESS
    }, String(process.env.JWT_KEY), {
      subject: email,
      expiresIn: parseInt(String(process.env.JWT_ACCESS_TIME), 10),
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER
    });
    const refresh = _jsonwebtoken.default.sign({
      email,
      userId,
      role,
      type: process.env.JWT_REFRESH
    }, String(process.env.JWT_KEY), {
      subject: email,
      expiresIn: parseInt(String(process.env.JWT_REFRESH_TIME), 10),
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER
    });
    return {
      access,
      refresh
    };
  }
  async refreshJwt({
    email,
    userId,
    role,
    token
  }) {
    await _redis.default.set({
      key: token,
      value: '1',
      timeType: 'EX',
      time: parseInt(String(process.env.JWT_REFRESH_TIME), 10)
    });
    return this.generate(email, userId, role);
  }
}
var _default = new JwtService();
exports.default = _default;