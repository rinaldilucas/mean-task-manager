import Async from 'async';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { QueryOptions } from 'mongoose';
import { StatusCode } from 'status-code-enum';

import { User as Model } from '@api/models/user.model';
import jwtService from '@api/services/jwt.service';
import RedisService from '@api/services/redis.service';
import { handlePromises, responseError, responseSuccess } from '@api/utils/http.handler';

class UserController {
  async getAll(request: Request, response: Response): Promise<Response | any> {
    const language = request.headers.language;

    const countQuery = (callback: Function): any => {
      Model.find().countDocuments({}, (error, count) => {
        if (error) callback(error, null);
        else callback(null, count);
      });
    };

    const retrieveQuery = (callback: Function): any => {
      Model.find().exec((error, documents) => {
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
            `Error finding users. Error: ${error.message}. Document name: {${Model.modelName}}.`,
          );
        else
          return responseError(
            response,
            error,
            StatusCode.ServerErrorInternal,
            `Erro ao buscar usuários. Erro: ${error.message}. Nome do documento: {${Model.modelName}}.`,
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

    const [salt] = await handlePromises(request, response, bcrypt.genSalt(Number(process?.env?.SALT_ROUNDS) || 12));
    const [hashPass] = await handlePromises(request, response, bcrypt.hash(request.body.password, salt));

    const newUser = new Model({
      email: request.body.email,
      role: request.body.role,
      password: hashPass,
    });

    const [document, documentError] = await handlePromises(request, response, Model.findOne({ email: request.body.email }));
    if (documentError) return;
    if (document) {
      if (language === 'en-US')
        return responseError(response, {}, StatusCode.ClientErrorConflict, `User already exists with email ${request.body.email}.`);
      else return responseError(response, {}, StatusCode.ClientErrorConflict, `Usuário de nome ${request.body.email} já existe.`);
    }

    const [data, error] = await handlePromises(request, response, newUser.save());
    if (error) return;
    if (!data) {
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

  async authenticate(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const [document, documentError] = await handlePromises(request, response, Model.findOne({ email: request.body.email }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Mismatch credentials.');
      else return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Erro de credencial.');
    }

    const [validation, validationError] = await handlePromises(
      request,
      response,
      bcrypt.compare(request.body.password, document.password),
    );
    if (validationError) return;
    if (!validation) {
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Mismatch credentials.');
      else return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Erro de credencial.');
    }

    const { access, refresh } = jwtService.generate(document.email, document._id, document.role);

    const jwtPayload = {
      access,
      refresh,
      expiresIn: process.env.JWT_ACCESS_TIME,
      userId: document._id,
      keepUserLoggedIn: request.body.keepUserLoggedIn,
    };

    return responseSuccess(response, jwtPayload, StatusCode.SuccessOK);
  }

  async checkIfEmailExists(request: Request, response: Response): Promise<Response | undefined> {
    const [data, error] = await handlePromises(request, response, Model.findOne({ email: request.params.email } as QueryOptions));
    if (error) return;
    if (!data) return responseSuccess(response, { emailExists: false }, StatusCode.SuccessOK);

    return responseSuccess(response, { emailExists: true }, StatusCode.SuccessOK);
  }

  async changePassword(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const [salt] = await handlePromises(request, response, bcrypt.genSalt(Number(process.env.SALT_ROUNDS)));
    const [hashPass] = await handlePromises(request, response, bcrypt.hash(request.body.password, salt));
    const newBody = { ...request.body, password: hashPass };

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
      Model.updateOne({ _id: request.params._id }, newBody, { new: true }),
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

  async refreshToken(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const { access, refresh } = await jwtService.refreshJwt({
      email: request.body.email,
      userId: request.body.userId,
      role: request.body.role,
      token: request.body.refresh,
    });

    if (!access || !refresh) {
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Error refreshing token.');
      else return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Erro ao atualizar token.');
    }

    const jwtPayload = {
      access,
      refresh,
      expiresIn: process.env.JWT_REFRESH_TIME,
      userId: request.body.userId,
    };

    return responseSuccess(response, jwtPayload, StatusCode.SuccessOK);
  }

  async logout(request: Request, response: Response): Promise<Response | undefined> {
    const token = request.body.token;
    const [, addToBlacklistError] = await handlePromises(request, response, RedisService.addToBlacklist(token));
    if (addToBlacklistError) return;

    return responseSuccess(response, {}, StatusCode.SuccessOK);
  }
}

export default new UserController();
