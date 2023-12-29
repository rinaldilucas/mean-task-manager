import Async from 'async';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCode } from 'status-code-enum';

import { Category as Model } from '@api/models/category.model';
import { handlePromises, responseError, responseSuccess } from '@api/utils/http.handler';

class CategoryController {
  async getAll(request: Request, response: Response): Promise<Response | any> {
    const language = request.headers.language;
    const authorizationHeader = request.headers.authorization as string;
    const token = authorizationHeader ? authorizationHeader.split(' ')[1] : undefined;
    const userId = token ? (jwt.verify(token, String(process.env.JWT_KEY)) as any).userId : undefined;
    let onlyMine = request.query.onlyMine == 'true' ? true : false;

    let findQuery = {} as any;
    if (onlyMine) findQuery = { userId } as any;

    const countQuery = (callback: Function): any => {
      Model.find(findQuery).countDocuments({}, (error, count) => {
        if (error) callback(error, null);
        else callback(null, count);
      });
    };

    const retrieveQuery = (callback: Function): any => {
      Model.find(findQuery).exec((error, documents) => {
        if (error) callback(error, null);
        else callback(null, documents);
      });
    };

    Async.parallel([countQuery, retrieveQuery], (error: any, results: any) => {
      if (error) {
        if (language === 'en-US')
          return responseError(
            response,
            error,
            StatusCode.ServerErrorInternal,
            `Error finding categories. Error: ${error.message}. Document name: {${Model.modelName}}.`,
          );
        else
          return responseError(
            response,
            error,
            StatusCode.ServerErrorInternal,
            `Erro ao buscar categorias. Erro: ${error.message}. Nome do documento: {${Model.modelName}}.`,
          );
      }

      return responseSuccess(response, results[1], StatusCode.SuccessOK, results[0]);
    });
  }

  async create(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const [data, error] = await handlePromises(request, response, new Model(request.body).save());
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US')
        return responseError(
          response,
          {},
          StatusCode.ClientErrorBadRequest,
          `Error creating document. Document name: {${Model.modelName}}.`,
        );
      else
        return responseError(
          response,
          {},
          StatusCode.ClientErrorBadRequest,
          `Erro ao criar documento. Nome do documento: {${Model.modelName}}.`,
        );
    }

    return responseSuccess(response, data, StatusCode.SuccessCreated);
  }

  async remove(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const [document, documentError] = await handlePromises(request, response, Model.findOne({ _id: request.params._id }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US')
        return responseError(
          response,
          {},
          StatusCode.ClientErrorNotFound,
          `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`,
        );
      else
        return responseError(
          response,
          {},
          StatusCode.ClientErrorNotFound,
          `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`,
        );
    }

    const [data, error] = await handlePromises(request, response, Model.deleteOne({ _id: request.params._id }, request.body));
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US')
        return responseError(
          response,
          {},
          StatusCode.ClientErrorBadRequest,
          `Error removing document with id ${request.params._id}. Document name: {${Model.modelName}}.`,
        );
      else
        return responseError(
          response,
          {},
          StatusCode.ClientErrorBadRequest,
          `Erro ao remover documento de id ${request.params._id}. Nome do documento: {${Model.modelName}}.`,
        );
    }

    return responseSuccess(response, data, StatusCode.SuccessNoContent);
  }
}

export default new CategoryController();
