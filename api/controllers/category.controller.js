const Category = require('../models/category.model');
const httpHandler = require('../utils/http-handler');
const { StatusCode } = require('status-code-enum');

exports.findAll = (request, response) => {
    const language = request.headers.language;

    Category.find()
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding categories. Error: ${error.message}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar categorias. Erro: ${error.message}.`);
        });
};

exports.findOne = (request, response) => {
    const language = request.headers.language;

    Category.findById(request.params._id)
        .then((result) => {
            if (!result) {
                if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Category not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Categoria de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error retrieving category with id ${request.params._id}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar categoria com id ${request.params._id}.`);
        });
};

exports.create = (request, response) => {
    const language = request.headers.language;

    const category = new Category(request.body);
    category
        .save()
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessCreated);
        })
        .catch((error) => {
            if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error creating category. Error: ${error.message}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao criar categoria. Erro: ${error.message}.`);
        });
};

exports.delete = (request, response) => {
    const language = request.headers.language;

    Category.findByIdAndRemove(request.params._id)
        .then((result) => {
            if (!result) {
                if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Category not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Categoria de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result, StatusCode.SuccessAccepted);
        })
        .catch((error) => {
            if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error removing category with id ${request.params._id}. Error: ${error}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao remover categoria de id ${request.params._id}. Erro: ${error}.`);
        });
};
