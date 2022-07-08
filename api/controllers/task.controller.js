const Task = require('../models/task.model');
const { StatusCode } = require('status-code-enum');
const httpHandler = require('../utils/http-handler');

exports.findAllByUser = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Task.find({ userId: request.params.userId })
        .sort({ date: -1 })
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar tarefas. Erro: ${error.message}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding tasks. Error: ${error.message}.`);
        });
};

exports.findOne = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Task.findOne({ _id: request.params._i2d })
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Task doesn't exists.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Tarefa não existe.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
            }
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error retrieving Task with id ${request.params._id}.`);
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
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error creating task. Error: ${error.message}.`);
        });
};

exports.update = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Task.findByIdAndUpdate(request.body._id, request.body, { new: true })
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
            }

            httpHandler.success(response, result);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
            }
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error updating task with id ${request.params._id}. Error: ${error}.`);
        });
};

exports.delete = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Task.findByIdAndRemove(request.params._id)
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessAccepted);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `Task not found with id ${request.params._id}.`);
            }
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Could not delete task with id ${request.params._id}. Error: ${error}.`);
        });
};
