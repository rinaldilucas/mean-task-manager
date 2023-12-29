import Async from 'async';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCode } from 'status-code-enum';

import { Task as Model } from '@api/models/task.model';
import { handlePromises, responseError, responseSuccess } from '@api/utils/http.handler';

class TaskController {
  async getAll(request: Request, response: Response): Promise<Response | any> {
    const userId = (
      jwt.verify((request.headers.authorization as string).split(' ')[1] as string, String(process.env.JWT_KEY)) as JwtPayload
    ).userId as string;
    const language = request.headers.language;
    const pageIndex = Number(request.query.pageIndex) ?? 1;
    const pageSize = Number(request.query.pageSize) ?? 5;
    const searchTerm = request.query.searchTerm;
    const startDate = request.query.startDate ? new Date((request.query as any).startDate) : null;
    const finalDate = request.query.finalDate ? new Date((request.query as any).finalDate) : null;

    const countQuery = (callback: Function): any => {
      const findQuery = { userId } as any;

      if (searchTerm) findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };
      if (startDate && finalDate) findQuery.createdAt = { $gte: startDate, $lte: finalDate };

      Model.find(findQuery)
        .find({ userId })
        .countDocuments({}, (error, count) => {
          if (error) callback(error, null);
          else callback(null, count);
        });
    };

    const retrieveQuery = (callback: Function): any => {
      const findQuery = { userId } as any;
      if (searchTerm) findQuery.title = { $regex: request.query.searchTerm, $options: 'i' };
      if (startDate && finalDate) findQuery.createdAt = { $gte: startDate, $lte: finalDate };

      const sortQuery = {} as any;
      const sortDirection = request.query.sortDirection;
      const sortFilter = request.query.sortFilter as string;

      if (sortFilter && sortDirection !== '') {
        if (request.query.sortDirection === 'asc') {
          sortQuery[sortFilter] = 1;
        } else {
          sortQuery[sortFilter] = -1;
        }
      } else {
        sortQuery.date = 1;
      }

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
        if (language === 'en-US')
          return responseError(
            response,
            error,
            StatusCode.ServerErrorInternal,
            `Error finding documents. Error: ${error.message}. Document name: {${Model.modelName}}.`,
          );
        else
          return responseError(
            response,
            error,
            StatusCode.ServerErrorInternal,
            `Erro ao buscar documentos. Erro: ${error.message}. Nome do documento: {${Model.modelName}}.`,
          );
      }

      return responseSuccess(response, results[1], StatusCode.SuccessOK, results[0]);
    });
  }

  async getOne(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const [data, error] = await handlePromises(request, response, Model.findOne({ _id: request.params._id }));
    if (error) return;
    if (!data) {
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

    return responseSuccess(response, data, StatusCode.SuccessOK);
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

  async update(request: Request, response: Response): Promise<Response | undefined> {
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

    const [data, error] = await handlePromises(
      request,
      response,
      Model.updateOne({ _id: request.params._id }, request.body, { new: true }),
    );
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US')
        return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.params._id}.`);
      else
        return responseError(
          response,
          {},
          StatusCode.ClientErrorBadRequest,
          `Erro ao atualizar documento de id ${request.params._id}. Nome do documento: {${Model.modelName}}.`,
        );
    }

    return responseSuccess(response, data, StatusCode.SuccessOK);
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

export default new TaskController();
