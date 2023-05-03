import Async from 'async';
import { Request, Response } from 'express';
import { StatusCode } from 'status-code-enum';

import { User as Model } from '../models/user.model';
import { handlePromises, responseError, responseSuccess } from '../utils/http-handler';

class UserController {
    public async findAll (request: Request, response: Response): Promise<Response | any> {
        const language = request.headers.language;

        const countQuery = (callback): any => {
            Model.find()
                .countDocuments({}, (error, count) => {
                    if (error) callback(error, null);
                    else callback(null, count);
                });
        };

        const retrieveQuery = (callback): any => {
            Model.find()
                .exec((error, documents) => {
                    if (error) callback(error, null);
                    else callback(null, documents);
                });
        };

        Async.parallel([countQuery, retrieveQuery], (error: any, results: any) => {
            if (error) {
                if (language === 'en-US') return responseError(response, error, StatusCode.ServerErrorInternal, `Error finding users. Error: ${error.message}. Document name: {${Model.modelName}}.`);
                else return responseError(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar usuários. Erro: ${error.message}. Nome do documento: {${Model.modelName}}.`);
            }

            responseSuccess(response, results[1], StatusCode.SuccessOK, results[0]);
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

        responseSuccess(response, data, StatusCode.SuccessOK);
    }

    public async findOneByEmail (request: Request, response: Response): Promise<Response | undefined> {
        const [data, error] = await handlePromises(request, response, Model.findOne({ email: request.params.email }));
        if (error) return;
        if (!data) return responseSuccess(response, {}, StatusCode.SuccessOK, 0);

        responseSuccess(response, { alreadyRegistered: true }, StatusCode.SuccessOK);
    }
}

export default new UserController();
