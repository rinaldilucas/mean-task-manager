"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _statusCodeEnum = require("status-code-enum");
var _jwt = _interopRequireDefault(require("../services/jwt.service"));
var _redis = require("../services/redis.service");
var _http = require("../utils/http.handler");
var _user = require("../models/user.model");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class AuthController {
  async authenticate(request, response) {
    const language = request.headers.language;
    const [document, documentError] = await (0, _http.handlePromises)(request, response, _user.User.findOne({
      email: request.body.email
    }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorUnauthorized, 'Missmatch credential: Invalid email.');else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorUnauthorized, 'Erro de credencial: Usuário inválido.');
    }
    const [validation, validationError] = await (0, _http.handlePromises)(request, response, _bcrypt.default.compare(request.body.password, document.password));
    if (validationError) return;
    if (!validation) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorUnauthorized, 'Missmatch credential: Invalid password.');else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorUnauthorized, 'Erro de credencial: Senha inválida.');
    }
    const {
      access,
      refresh
    } = _jwt.default.generate(document.email, document._id, document.role);
    const jwtPayload = {
      access,
      refresh,
      expiresIn: process.env.JWT_ACCESS_TIME,
      userId: document._id,
      keepUserLoggedIn: request.body.keepUserLoggedIn
    };
    return (0, _http.responseSuccess)(response, jwtPayload, _statusCodeEnum.StatusCode.SuccessOK);
  }
  async register(request, response) {
    const language = request.headers.language;
    const [salt] = await (0, _http.handlePromises)(request, response, _bcrypt.default.genSalt(Number(process?.env?.SALT_RONDS) || 12));
    const [hashPass] = await (0, _http.handlePromises)(request, response, _bcrypt.default.hash(request.body.password, salt));
    const newUser = new _user.User({
      email: request.body.email,
      role: request.body.role,
      password: hashPass
    });
    const [document, documentError] = await (0, _http.handlePromises)(request, response, _user.User.findOne({
      email: request.body.email
    }));
    if (documentError) return;
    if (document) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorConflict, `User already exists with email ${request.params.email}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorConflict, `Usuário de nome ${request.params.email} já existe.`);
    }
    const [data, error] = await (0, _http.handlePromises)(request, response, newUser.save());
    if (error) return;
    if (!data) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${_user.User.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${_user.User.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessCreated);
  }
  async changePassword(request, response) {
    const language = request.headers.language;
    const [salt] = await (0, _http.handlePromises)(request, response, _bcrypt.default.genSalt(Number(process.env.SALT_RONDS)));
    const [hashPass] = await (0, _http.handlePromises)(request, response, _bcrypt.default.hash(request.body.password, salt));
    const newBody = {
      ...request.body,
      password: hashPass
    };
    const [document, documentError] = await (0, _http.handlePromises)(request, response, _user.User.findOne({
      _id: request.body._id
    }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Document not found with id ${request.body._id}. Document name: {${_user.User.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Documento de id ${request.body._id} não encontrada. Nome do documento: {${_user.User.modelName}}.`);
    }
    const [data, error] = await (0, _http.handlePromises)(request, response, _user.User.updateOne({
      _id: request.body._id
    }, newBody, {
      new: true
    }));
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.body._id}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.body._id}. Nome do documento: {${_user.User.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessOK);
  }
  async refreshToken(request, response) {
    const language = request.headers.language;
    const {
      access,
      refresh
    } = await _jwt.default.refreshJwt({
      email: request.body.email,
      userId: request.body.userId,
      role: request.body.role,
      token: request.body.refresh
    });
    if (!access || !refresh) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorUnauthorized, 'Error refreshing token.');else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorUnauthorized, 'Erro ao atualizar token.');
    }
    const jwtPayload = {
      access,
      refresh,
      expiresIn: process.env.JWT_ACCESS_TIME,
      userId: request.body.userId
    };
    return (0, _http.responseSuccess)(response, jwtPayload, _statusCodeEnum.StatusCode.SuccessOK);
  }
  async logout(request, response) {
    const token = request.body.token;
    const [, addToBlacklistError] = await (0, _http.handlePromises)(request, response, (0, _redis.add)(token));
    if (addToBlacklistError) return;
    return (0, _http.responseSuccess)(response, {}, _statusCodeEnum.StatusCode.SuccessOK);
  }
}
var _default = new AuthController();
exports.default = _default;