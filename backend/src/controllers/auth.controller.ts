import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCode } from 'status-code-enum';

import { User as Model } from '@api/models/user.model';
import jwtService from '@api/services/jwt.service';
import { add as addToBlacklist } from '@api/services/redis.service';
import { handlePromises, responseError, responseSuccess } from '@api/utils/http.handler';

class AuthController {
  async authenticate(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const [document, documentError] = await handlePromises(request, response, Model.findOne({ email: request.body.email }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Mismatch credentials.');
      else return responseError(response, {}, StatusCode.ClientErrorUnauthorized, 'Erro de credencial.');
    }

    const [validation, validationError] = await handlePromises(request, response, bcrypt.compare(request.body.password, document.password));
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

  async register(request: Request, response: Response): Promise<Response | undefined> {
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
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorConflict, `User already exists with email ${request.params.email}.`);
      else return responseError(response, {}, StatusCode.ClientErrorConflict, `Usuário de nome ${request.params.email} já existe.`);
    }

    const [data, error] = await handlePromises(request, response, newUser.save());
    if (error) return;
    if (!data) {
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${Model.modelName}}.`);
      else return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${Model.modelName}}.`);
    }

    return responseSuccess(response, data, StatusCode.SuccessCreated);
  }

  async checkIfEmailExists(request: Request, response: Response): Promise<Response | undefined> {
    const [data, error] = await handlePromises(request, response, Model.findOne({ email: request.params.email }));
    if (error) return;
    if (!data) return responseSuccess(response, {}, StatusCode.SuccessNoContent, 0);

    return responseSuccess(response, { emailExists: true }, StatusCode.SuccessOK);
  }

  async changePassword(request: Request, response: Response): Promise<Response | undefined> {
    const language = request.headers.language;

    const [salt] = await handlePromises(request, response, bcrypt.genSalt(Number(process.env.SALT_ROUNDS)));
    const [hashPass] = await handlePromises(request, response, bcrypt.hash(request.body.password, salt));
    const newBody = { ...request.body, password: hashPass };

    const [document, documentError] = await handlePromises(request, response, Model.findOne({ _id: request.body._id }));
    if (documentError) return;
    if (!document) {
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.body._id}. Document name: {${Model.modelName}}.`);
      else return responseError(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.body._id} não encontrada. Nome do documento: {${Model.modelName}}.`);
    }

    const [data, error] = await handlePromises(request, response, Model.updateOne({ _id: request.body._id }, newBody, { new: true }));
    if (error) return;
    if (!data || data.n === 0) {
      if (language === 'en-US') return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.body._id}.`);
      else return responseError(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.body._id}. Nome do documento: {${Model.modelName}}.`);
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
    const [, addToBlacklistError] = await handlePromises(request, response, addToBlacklist(token));
    if (addToBlacklistError) return;

    return responseSuccess(response, {}, StatusCode.SuccessOK);
  }
}

export default new AuthController();
