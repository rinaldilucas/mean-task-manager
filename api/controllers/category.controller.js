const Model = require('../models/category.model');
const httpHandler = require('../utils/http-handler');
const { StatusCode } = require('status-code-enum');

exports.findAll = async (request, response) => {
    const language = request.headers.language;

    try {
        const document = await Model.find();
        if (document?.length === 0)
            if (language == 'en-US') return httpHandler.success(response, document, StatusCode.SuccessOK);
            else return httpHandler.success(response, document, StatusCode.SuccessOK);

        httpHandler.success(response, document, StatusCode.SuccessOK);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.create = async (request, response) => {
    const language = request.headers.language;

    try {
        const document = await new Model(request.body).save();
        if (!document || document.n === 0)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error creating category.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao criar categoria.`);

        httpHandler.success(response, document, StatusCode.SuccessCreated);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.delete = async (request, response) => {
    const language = request.headers.language;

    try {
        const document = await Model.findOne({ _id: request.params._id });
        if (!document)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);

        const result = await Model.deleteOne({ _id: request.params._id }, request.body);
        if (!result || result.n === 0)
            if (language == 'en-US')
                return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error removing document with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao remover documento de id ${request.params._id}. Nome do documento: {${Model.modelName}}.`);

        httpHandler.success(response, result, StatusCode.SuccessNoContent);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};
