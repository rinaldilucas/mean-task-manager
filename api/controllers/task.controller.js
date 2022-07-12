const Task = require('../models/task.model');
const httpHandler = require('../utils/http-handler');
const { StatusCode } = require('status-code-enum');

exports.findAllByUser = async (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    const async = require('async');
    let pageIndex = +request.query.pageIndex;
    const pageSize = +request.query.pageSize;

    var countQuery = function (callback) {
        Task.find({ userId: request.params.userId })
            .sort({ date: -1 })
            .count({}, (error, count) => {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, count);
                }
            });
    };

    if (pageIndex) {
        var retrieveQuery = function (callback) {
            Task.find({ userId: request.params.userId })
                .sort({ date: -1 })
                .skip(pageIndex * pageSize)
                .limit(pageSize)
                .exec((error, docs) => {
                    if (error) {
                        callback(error, null);
                    } else {
                        callback(null, docs);
                    }
                });
        };

        async.parallel([countQuery, retrieveQuery], function (error, results) {
            if (error) {
                if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding tasks. Error: ${error.message}.`);
                else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar tarefas. Erro: ${error.message}.`);
                return;
            }

            httpHandler.success(response, results[1], StatusCode.SuccessOK, results[0]);
        });
    } else {
        pageIndex = 1;

        var retrieveQuery = function (callback) {
            Task.find({ userId: request.params.userId })
                .sort({ date: -1 })
                .limit(pageSize)
                .exec((error, docs) => {
                    if (error) {
                        callback(error, null);
                    } else {
                        callback(null, docs);
                    }
                });
        };

        async.parallel([countQuery, retrieveQuery], function (error, results) {
            if (error) {
                if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding tasks. Error: ${error.message}.`);
                else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar tarefas. Erro: ${error.message}.`);
                return;
            }

            httpHandler.success(response, results[1], StatusCode.SuccessOK, results[0]);
        });
    }
};

exports.findOne = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Task.findOne({ _id: request.params._id })
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Tarefa de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error retrieving task with id ${request.params._id}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar tarefa com id ${request.params._id}.`);
        });
};

exports.create = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    const task = new Task(request.body);
    task.save()
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessCreated);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error creating task. Error: ${error.message}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao criar tarefa. Erro: ${error.message}.`);
        });
};

exports.update = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Task.findByIdAndUpdate(request.body._id, request.body, { new: true })
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Tarefa de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error updating task with id ${request.params._id}. Error: ${error}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao atualizar tarefa de id ${request.params._id}. Erro: ${error}.`);
        });
};

exports.delete = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Task.findByIdAndRemove(request.params._id)
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Tarefa de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result, StatusCode.SuccessAccepted);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error removing task with id ${request.params._id}. Error: ${error}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao remover tarefa de id ${request.params._id}. Erro: ${error}.`);
        });
};
