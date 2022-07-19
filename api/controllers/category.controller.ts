
import { Request, Response } from 'express';
import { Category as Model } from '../models/category.model';
import StatusCode from 'status-code-enum';
import httpHandler from '../utils/http-handler';

class CategoryController {
    public async findAll (request: Request, response: Response): Promise<Response> {
        const [data, error] = await httpHandler.handlePromises(request, response, Model.find());
        if (error) return;
        if (data?.length === 0) return httpHandler.success(response, data, StatusCode.SuccessOK);

        httpHandler.success(response, data, StatusCode.SuccessOK);
    }

    public async create (request: Request, response: Response): Promise<Response> {
        const language = request.headers.language;

        const [data, error] = await httpHandler.handlePromises(request, response, new Model(request.body).save());
        if (error) return;
        if (!data || data.n === 0) {
            if (language === 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${Model.modelName}}.`);
        }

        httpHandler.success(response, data, StatusCode.SuccessCreated);
    }

    public async remove (request: Request, response: Response): Promise<Response> {
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
    }
}

export default new CategoryController();
