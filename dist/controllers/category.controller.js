"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _async = _interopRequireDefault(require("async"));
var _statusCodeEnum = require("status-code-enum");
var _http = require("../utils/http.handler");
var _category = require("../models/category.model");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CategoryController {
  async findAll(request, response) {
    const language = request.headers.language;
    const countQuery = callback => {
      _category.Category.find().countDocuments({}, (error, count) => {
        if (error) callback(error, null);else callback(null, count);
      });
    };
    const retrieveQuery = callback => {
      _category.Category.find().exec((error, documents) => {
        if (error) callback(error, null);else callback(null, documents);
      });
    };
    _async.default.parallel([countQuery, retrieveQuery], (error, results) => {
      if (error) {
        if (language === 'en-US') return (0, _http.responseError)(response, error, _statusCodeEnum.StatusCode.ServerErrorInternal, `Error finding categories. Error: ${error.message}. Document name: {${_category.Category.modelName}}.`);else return (0, _http.responseError)(response, error, _statusCodeEnum.StatusCode.ServerErrorInternal, `Erro ao buscar categorias. Erro: ${error.message}. Nome do documento: {${_category.Category.modelName}}.`);
      }
      return (0, _http.responseSuccess)(response, results[1], _statusCodeEnum.StatusCode.SuccessOK, results[0]);
    });
  }
  async create(request, response) {
    const language = request.headers.language;
    const [data, error] = await (0, _http.handlePromises)(request, response, new _category.Category(request.body).save());
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${_category.Category.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${_category.Category.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessCreated);
  }
  async remove(request, response) {
    const language = request.headers.language;
    const [document, documentError] = await (0, _http.handlePromises)(request, response, _category.Category.findOne({
      _id: request.params._id
    }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${_category.Category.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${_category.Category.modelName}}.`);
    }
    const [data, error] = await (0, _http.handlePromises)(request, response, _category.Category.deleteOne({
      _id: request.params._id
    }, request.body));
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Error removing document with id ${request.params._id}. Document name: {${_category.Category.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Erro ao remover documento de id ${request.params._id}. Nome do documento: {${_category.Category.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessOK);
  }
}
var _default = new CategoryController();
exports.default = _default;