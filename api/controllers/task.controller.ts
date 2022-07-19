import StatusCode from 'status-code-enum';
import Model from '../models/category.model';
import httpHandler from '../utils/http-handler';
import async from 'async';

export const findAllByUser = async (request, response) => {
    const language = request.headers.language;
    const pageIndex = +request.query.pageIndex ?? 1;
    const pageSize = +request.query.pageSize ?? 5;
    const hasSearchTerm = request.query.searchTerm;

    const countQuery = (callback) => {
        const findQuery = {
            userId: request.params.userId
        };

        if (hasSearchTerm) findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };

        Model.find(findQuery)
            .find({ userId: request.params.userId })
            .sort({ date: -1 })
            .countDocuments({}, (error, count) => {
                if (error) callback(error, null);
                else callback(null, count);
            });
    };

    const retrieveQuery = (callback) => {
        const findQuery = {
            userId: request.params.userId
        };

        if (hasSearchTerm) findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };

        Model.find(findQuery)
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
            if (language === 'en') return httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding documents. Error: ${error.message}. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar documentos. Erro: ${error.message}. Nome do documento: {${Model.modelName}}.`);
        }

        httpHandler.success(response, results[1], StatusCode.SuccessOK, results[0]);
    });
};

export const findOne = async (request, response) => {
    const language = request.headers.language;

    const [data, error] = await httpHandler.handlePromises(request, response, Model.findOne({ _id: request.params._id }));
    if (error) return;
    if (!data) {
        if (language === 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
    }

    httpHandler.success(response, data, StatusCode.SuccessOK);
};

export const create = async (request, response) => {
    const language = request.headers.language;

    const [data, error] = await httpHandler.handlePromises(request, response, new Model(request.body).save());
    if (error) return;
    if (!data || data.n === 0) {
        if (language === 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${Model.modelName}}.`);
    }

    httpHandler.success(response, data, StatusCode.SuccessCreated);
};

export const update = async (request, response) => {
    const language = request.headers.language;

    const [document, documentError] = await httpHandler.handlePromises(request, response, Model.findOne({ _id: request.body._id }));
    if (documentError) return;
    if (!document) {
        if (language === 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.body._id}. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.body._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
    }

    const [data, error] = await httpHandler.handlePromises(request, response, Model.updateOne({ _id: request.body._id }, request.body, { new: true }));
    if (error) return;
    if (!data || data.n === 0) {
        if (language === 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.body._id}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.body._id}. Nome do documento: {${Model.modelName}}.`);
    }

    httpHandler.success(response, data, StatusCode.SuccessOk);
};

export const remove = async (request, response) => {
    const language = request.headers.language;

    const [document, documentError] = await httpHandler.handlePromises(request, response, Model.findOne({ _id: request.params._id }));
    if (documentError) return;
    if (!document) {
        if (language === 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
    }

    const [data, error] = await httpHandler.handlePromises(request, response, Model.deleteOne({ _id: request.params._id }, request.body));
    if (error) return;
    if (!data || data.n === 0) {
        if (language === 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error removing document with id ${request.params._id}. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao remover documento de id ${request.params._id}. Nome do documento: {${Model.modelName}}.`);
    }

    httpHandler.success(response, data, StatusCode.SuccessOk);
};
