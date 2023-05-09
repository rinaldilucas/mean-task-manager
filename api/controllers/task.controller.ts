import Async from 'async';
import { Request, Response } from 'express';
import { StatusCode } from 'status-code-enum';

import { handlePromises, responseError, responseSuccess } from '@api/utils/http.handler';
import { Task as Model } from '@models/task.model';

class TaskController {
    public async findAllByUser (request: Request, response: Response): Promise<Response | any> {
        const language = request.headers.language;
        const pageIndex = Number(request.query.pageIndex) ?? 1;
        const pageSize = Number(request.query.pageSize) ?? 5;
        const searchTerm = request.query.searchTerm;

        const countQuery = (callback): any => {
            const findQuery = { userId: request.params.userId } as any;
            const sortQuery = {};

            if (searchTerm) findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };

            Model.find(findQuery)
                .find({ userId: request.params.userId })
                .sort(sortQuery)
                .countDocuments({}, (error, count) => {
                    if (error) callback(error, null);
                    else callback(null, count);
                });
        };

        const retrieveQuery = (callback): any => {
            const findQuery = { userId: request.params.userId } as any;
            if (searchTerm) findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };

            const sortQuery = {};
            const sortDirection = request.query.sortDirection;
            const sortFilter = request.query.sortFilter as string;

            if (sortFilter && sortDirection !== '') {
                if (request.query.sortDirection === 'asc') {
                    sortQuery[sortFilter] = 1;
                } else {
                    sortQuery[sortFilter] = -1;
                }
            } else { sortQuery['date'] = 1; }

            Model.find(findQuery)
                .sort(sortQuery)
                .skip(pageIndex * pageSize)
                .limit(pageSize)
                .exec((error, documents) => {
                    if (error) callback(error, null);
                    else callback(null, documents);
                });
        };

        Async.parallel([countQuery, retrieveQuery], (error: any, results: any) => {
            if (error) {
                if (language === 'en-US') return responseError(response, error, StatusCode.ServerErrorInternal, `Error finding documents. Error: ${error.message}. Document name: {${Model.modelName}}.`);
                else return responseError(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar documentos. Erro: ${error.message}. Nome do documento: {${Model.modelName}}.`);
            }

            return responseSuccess(response, results[1], StatusCode.SuccessOK, results[0]);
        });
    }

    public async findOne (request: Request, response: Response): Promise<Response | undefined> {
        const language = request.headers.language;

        const [data, error] = await handlePromises(request, response, Model.findOne({ _id: request.params._id }));
        if (error) return;
        if (!data) {
            if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return responseError(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
        }

        return responseSuccess(response, data, StatusCode.SuccessOK);
    }

    public async create (request: Request, response: Response): Promise<Response | undefined> {
        const language = request.headers.language;

        const [data, error] = await handlePromises(request, response, new Model(request.body).save());
        if (error) return;
        if (!data || data.n === 0) {
            if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${Model.modelName}}.`);
            else return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${Model.modelName}}.`);
        }

        return responseSuccess(response, data, StatusCode.SuccessCreated);
    }

    public async update (request: Request, response: Response): Promise<Response | undefined> {
        const language = request.headers.language;

        const [document, documentError] = await handlePromises(request, response, Model.findOne({ _id: request.body._id }));
        if (documentError) return;
        if (!document) {
            if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.body._id}. Document name: {${Model.modelName}}.`);
            else return responseError(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.body._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
        }

        const [data, error] = await handlePromises(request, response, Model.updateOne({ _id: request.body._id }, request.body, { new: true }));
        if (error) return;
        if (!data || data.n === 0) {
            if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.body._id}.`);
            else return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.body._id}. Nome do documento: {${Model.modelName}}.`);
        }

        return responseSuccess(response, data, StatusCode.SuccessOK);
    }

    public async remove (request: Request, response: Response): Promise<Response | undefined> {
        const language = request.headers.language;

        const [document, documentError] = await handlePromises(request, response, Model.findOne({ _id: request.params._id }));
        if (documentError) return;
        if (!document) {
            if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return responseError(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
        }

        const [data, error] = await handlePromises(request, response, Model.deleteOne({ _id: request.params._id }, request.body));
        if (error) return;
        if (!data || data.n === 0) {
            if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Error removing document with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao remover documento de id ${request.params._id}. Nome do documento: {${Model.modelName}}.`);
        }

        return responseSuccess(response, data, StatusCode.SuccessOK);
    }

    public async getTasksDoneWeekly (request: Request, response: Response): Promise<Response | any> {
        const language = request.headers.language;

        const findQuery = { userId: request.params.userId } as any;
        findQuery.createdAt = { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay() - 35), $lte: new Date() };

        const [data, error] = await handlePromises(request, response, Model.find(findQuery));
        if (error) return;
        if (!data) {
            if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return responseError(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
        }

        return responseSuccess(response, data, StatusCode.SuccessOK);
    }
}

export default new TaskController();
