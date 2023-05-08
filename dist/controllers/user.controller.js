"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _async = _interopRequireDefault(require("async"));
var _statusCodeEnum = require("status-code-enum");
var _user = require("../models/user.model");
var _http = require("../utils/http.handler");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class UserController {
  async findAll(request, response) {
    const language = request.headers.language;
    const countQuery = callback => {
      _user.User.find().countDocuments({}, (error, count) => {
        if (error) callback(error, null);else callback(null, count);
      });
    };
    const retrieveQuery = callback => {
      _user.User.find().exec((error, documents) => {
        if (error) callback(error, null);else callback(null, documents);
      });
    };
    _async.default.parallel([countQuery, retrieveQuery], (error, results) => {
      if (error) {
        if (language === 'en-US') return (0, _http.responseError)(response, error, _statusCodeEnum.StatusCode.ServerErrorInternal, `Error finding users. Error: ${error.message}. Document name: {${_user.User.modelName}}.`);else return (0, _http.responseError)(response, error, _statusCodeEnum.StatusCode.ServerErrorInternal, `Erro ao buscar usuários. Erro: ${error.message}. Nome do documento: {${_user.User.modelName}}.`);
      }
      (0, _http.responseSuccess)(response, results[1], _statusCodeEnum.StatusCode.SuccessOK, results[0]);
    });
  }
  async findOne(request, response) {
    const language = request.headers.language;
    const [data, error] = await (0, _http.handlePromises)(request, response, _user.User.findOne({
      _id: request.params._id
    }));
    if (error) return;
    if (!data) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${_user.User.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${_user.User.modelName}}.`);
    }
    (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessOK);
  }
  async findOneByEmail(request, response) {
    const [data, error] = await (0, _http.handlePromises)(request, response, _user.User.findOne({
      email: request.params.email
    }));
    if (error) return;
    if (!data) return (0, _http.responseSuccess)(response, {}, _statusCodeEnum.StatusCode.SuccessOK, 0);
    (0, _http.responseSuccess)(response, {
      alreadyRegistered: true
    }, _statusCodeEnum.StatusCode.SuccessOK);
  }
}
var _default = new UserController();
exports.default = _default;