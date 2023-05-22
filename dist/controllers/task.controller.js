"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _async = _interopRequireDefault(require("async"));
var _statusCodeEnum = require("status-code-enum");
var _http = require("../utils/http.handler");
var _task = require("../models/task.model");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class TaskController {
  async findAllByUser(request, response) {
    const language = request.headers.language;
    const pageIndex = Number(request.query.pageIndex) ?? 1;
    const pageSize = Number(request.query.pageSize) ?? 5;
    const searchTerm = request.query.searchTerm;
    const countQuery = callback => {
      const findQuery = {
        userId: request.params.userId
      };
      const sortQuery = {};
      if (searchTerm) findQuery.title = {
        $regex: request.query.searchTerm,
        $options: 'i'
      };
      _task.Task.find(findQuery).find({
        userId: request.params.userId
      }).sort(sortQuery).countDocuments({}, (error, count) => {
        if (error) callback(error, null);else callback(null, count);
      });
    };
    const retrieveQuery = callback => {
      const findQuery = {
        userId: request.params.userId
      };
      if (searchTerm) findQuery.title = {
        $regex: request.query.searchTerm,
        $options: 'i'
      };
      const sortQuery = {};
      const sortDirection = request.query.sortDirection;
      const sortFilter = request.query.sortFilter;
      if (sortFilter && sortDirection !== '') {
        if (request.query.sortDirection === 'asc') {
          sortQuery[sortFilter] = 1;
        } else {
          sortQuery[sortFilter] = -1;
        }
      } else {
        sortQuery['date'] = 1;
      }
      _task.Task.find(findQuery).sort(sortQuery).skip(pageIndex * pageSize).limit(pageSize).exec((error, documents) => {
        if (error) callback(error, null);else callback(null, documents);
      });
    };
    _async.default.parallel([countQuery, retrieveQuery], (error, results) => {
      if (error) {
        if (language === 'en-US') return (0, _http.responseError)(response, error, _statusCodeEnum.StatusCode.ServerErrorInternal, `Error finding documents. Error: ${error.message}. Document name: {${_task.Task.modelName}}.`);else return (0, _http.responseError)(response, error, _statusCodeEnum.StatusCode.ServerErrorInternal, `Erro ao buscar documentos. Erro: ${error.message}. Nome do documento: {${_task.Task.modelName}}.`);
      }
      return (0, _http.responseSuccess)(response, results[1], _statusCodeEnum.StatusCode.SuccessOK, results[0]);
    });
  }
  async getTasksByInterval(request, response) {
    const language = request.headers.language;
    const startDate = new Date(request.query.startDate);
    const finalDate = new Date(request.query.finalDate);
    const findQuery = {
      userId: request.params.userId
    };
    findQuery.createdAt = {
      $gte: startDate,
      $lte: finalDate
    };
    const [data, error] = await (0, _http.handlePromises)(request, response, _task.Task.find(findQuery));
    if (error) return;
    if (!data) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${_task.Task.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${_task.Task.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessOK);
  }
  async findOne(request, response) {
    const language = request.headers.language;
    const [data, error] = await (0, _http.handlePromises)(request, response, _task.Task.findOne({
      _id: request.params._id
    }));
    if (error) return;
    if (!data) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${_task.Task.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${_task.Task.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessOK);
  }
  async create(request, response) {
    const language = request.headers.language;
    const [data, error] = await (0, _http.handlePromises)(request, response, new _task.Task(request.body).save());
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${_task.Task.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${_task.Task.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessCreated);
  }
  async update(request, response) {
    const language = request.headers.language;
    const [document, documentError] = await (0, _http.handlePromises)(request, response, _task.Task.findOne({
      _id: request.body._id
    }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Document not found with id ${request.body._id}. Document name: {${_task.Task.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Documento de id ${request.body._id} não encontrada. Nome do documento: {${_task.Task.modelName}}.`);
    }
    const [data, error] = await (0, _http.handlePromises)(request, response, _task.Task.updateOne({
      _id: request.body._id
    }, request.body, {
      new: true
    }));
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.body._id}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.body._id}. Nome do documento: {${_task.Task.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessOK);
  }
  async remove(request, response) {
    const language = request.headers.language;
    const [document, documentError] = await (0, _http.handlePromises)(request, response, _task.Task.findOne({
      _id: request.params._id
    }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${_task.Task.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${_task.Task.modelName}}.`);
    }
    const [data, error] = await (0, _http.handlePromises)(request, response, _task.Task.deleteOne({
      _id: request.params._id
    }, request.body));
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US') return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Error removing document with id ${request.params._id}. Document name: {${_task.Task.modelName}}.`);else return (0, _http.responseError)(response, {}, _statusCodeEnum.StatusCode.ClientErrorBadRequest, `Erro ao remover documento de id ${request.params._id}. Nome do documento: {${_task.Task.modelName}}.`);
    }
    return (0, _http.responseSuccess)(response, data, _statusCodeEnum.StatusCode.SuccessNoContent);
  }
}
var _default = new TaskController();
exports.default = _default;