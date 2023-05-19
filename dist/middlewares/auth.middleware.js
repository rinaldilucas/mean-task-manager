"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _statusCodeEnum = _interopRequireDefault(require("status-code-enum"));
var _redis = require("../services/redis.service");
var _http = require("../utils/http.handler");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = async (request, response, next) => {
  const language = request.headers.language;
  if (request.headers.authorization) {
    const [bearerToken, token] = request.headers.authorization.split(' ');
    if (bearerToken === 'Bearer') {
      try {
        const blacklistedToken = await (0, _redis.verifyBlacklistForToken)(token);
        if (blacklistedToken) {
          if (language === 'en-US') return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorUnauthorized, 'Token invalidated by logout.'));else return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorUnauthorized, 'Token invalidado por logout.'));
        }
        const decoded = _jsonwebtoken.default.verify(token, String(process.env.JWT_KEY));
        if (decoded.type !== process.env.JWT_ACCESS || decoded.aud !== process.env.JWT_AUDIENCE || decoded.iss !== process.env.JWT_ISSUER) {
          if (language === 'en-US') return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorUnauthorized, 'Invalid token type.'));else return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorUnauthorized, 'Tipo de token inválido.'));
        }
        request.body.email = decoded.sub;
        return next();
      } catch (error) {
        if (language === 'en-US') return next((0, _http.responseError)(response, error, _statusCodeEnum.default.ClientErrorUnauthorized, 'Invalid jwt token.'));else return next((0, _http.responseError)(response, error, _statusCodeEnum.default.ClientErrorUnauthorized, 'JWT inválido.'));
      }
    }
    if (language === 'en-US') return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorUnauthorized, 'Invalid bearer token.'));else return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorUnauthorized, 'Bearer token inválido.'));
  }
  if (language === 'en-US') return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorBadRequest, 'Authorization header is not present.'));else return next((0, _http.responseError)(response, {}, _statusCodeEnum.default.ClientErrorBadRequest, 'Cabeçalho de autorização não está presente.'));
};
exports.default = _default;