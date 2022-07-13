const Task = require('../models/task.model');
const httpHandler = require('../utils/http-handler');
const { StatusCode } = require('status-code-enum');

exports.findAllByUser = async (request, response) => {
    const language = request.headers.language;

    const async = require('async');
    const pageIndex = +request.query.pageIndex ?? 1;
    const pageSize = +request.query.pageSize ?? 5;
    const hasSearchTerm = request.query.searchTerm;

    var countQuery = (callback) => {
        var findQuery = {
            userId: request.params.userId,
        };

        if (hasSearchTerm) {
            findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };
        }

        Task.find(findQuery)
            .find({ userId: request.params.userId })
            .sort({ date: -1 })
            .countDocuments({}, (error, count) => {
                if (error) callback(error, null);
                else callback(null, count);
            });
    };
    var retrieveQuery = (callback) => {
        var findQuery = {
            userId: request.params.userId,
        };

        if (hasSearchTerm) {
            findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };
        }

        Task.find(findQuery)
            .sort({ date: -1 })
            .skip(pageIndex * pageSize)
            .limit(pageSize)
            .exec((error, documents) => {
                if (error) callback(error, null);
                else callback(null, documents);
            });
    };

    async.parallel([countQuery, retrieveQuery], function (error, results) {
        if (error) {
            if (language == 'en') return httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding tasks. Error: ${error.message}.`);
            else return httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar tarefas. Erro: ${error.message}.`);
        }

        httpHandler.success(response, results[1], StatusCode.SuccessOK, results[0]);
    });
};

exports.findOne = (request, response) => {
    const language = request.headers.language;

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
    const language = request.headers.language;

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
    const language = request.headers.language;

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
    const language = request.headers.language;

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
