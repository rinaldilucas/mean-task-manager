const Model = require('../models/user.model');
const httpHandler = require('../utils/http-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistHandler = require('../redis/blacklist-handler');
const { StatusCode } = require('status-code-enum');

exports.findAll = async (request, response) => {
    const [data, error] = await httpHandler.handlePromises(request, response, Model.find());
    if (!!error) return;
    if (data?.length === 0) return httpHandler.success(response, data, StatusCode.SuccessOK);

    httpHandler.success(response, data, StatusCode.SuccessOK);
};

exports.findOne = async (request, response) => {
    const language = request.headers.language;

    const [data, error] = await httpHandler.handlePromises(request, response, Model.findOne({ _id: request.params._id }));
    if (!!error) return;
    if (!data)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);

    httpHandler.success(response, data, StatusCode.SuccessOK);
};

exports.findOneByEmail = async (request, response) => {
    const [data, error] = await httpHandler.handlePromises(request, response, Model.findOne({ email: request.params.email }));
    if (!!error) return;
    if (!data) return httpHandler.success(response, {}, StatusCode.SuccessOk);

    httpHandler.success(response, { userExists: true }, StatusCode.SuccessOK);
};

exports.update = async (request, response) => {
    const language = request.headers.language;

    const [document, documentError] = await httpHandler.handlePromises(request, response, Model.findOne({ _id: request.body._id }));
    if (!!documentError) return;
    if (!document)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.body._id}. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.body._id} não encontrada. Nome do documento: {${Model.modelName}}.`);

    const [data, error] = await httpHandler.handlePromises(request, response, Model.updateOne({ _id: request.body._id }, request.body, { new: true }));
    if (!!error) return;
    if (!data || data.n === 0)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.body._id}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.body._id}. Nome do documento: {${Model.modelName}}.`);

    httpHandler.success(response, data, StatusCode.SuccessOk);
};

exports.register = async (request, response) => {
    const language = request.headers.language;

    const [salt] = await httpHandler.handlePromises(request, response, bcrypt.genSalt(+process.env.SALT_RONDS));
    const [hashPass] = await httpHandler.handlePromises(request, response, bcrypt.hash(request.body.password, salt));

    const newUser = new Model({
        email: request.body.email,
        role: request.body.role,
        password: hashPass,
    });

    const [document, documentError] = await httpHandler.handlePromises(request, response, Model.findOne({ email: request.body.email }));
    if (!!documentError) return;
    if (document)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorConflict, `User already exists with email ${request.params.email}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorConflict, `Usuário de nome ${request.params.email} já existe.`);

    const [data, error] = await httpHandler.handlePromises(request, response, newUser.save());
    if (!!error) return;
    if (!data)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${Model.modelName}}.`);

    httpHandler.success(response, result, StatusCode.SuccessCreated);
};

exports.authenticate = async (request, response) => {
    const language = request.headers.language;

    const [document, documentError] = await httpHandler.handlePromises(request, response, Model.findOne({ email: request.body.email }));
    if (!!documentError) return;
    if (!document)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Missmatch credential: Invalid email.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Erro de credencial: Usuário inválido.`);

    const [validation, validationError] = await httpHandler.handlePromises(request, response, bcrypt.compare(request.body.password, document.password));
    if (!!validationError) return;
    if (!validation)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Missmatch credential: Invalid password.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Erro de credencial: Senha inválida.`);

    const token = jwt.sign({ email: document.email, userId: document._id, role: document.role }, process.env.JWT_KEY, { expiresIn: '1h' });
    const jwtPayload = {
        token: token,
        expiresIn: 60 * 60,
        userId: document._id,
    };

    httpHandler.success(response, jwtPayload, StatusCode.SuccessOK);
};

exports.logout = async (request, response) => {
    const token = request.body.token;
    const [, addToBlacklistError] = await httpHandler.handlePromises(request, response, blacklistHandler.add(token));
    if (!!addToBlacklistError) return;

    httpHandler.success(response, {}, StatusCode.SuccessOK);
};

exports.changePassword = async (request, response) => {
    const language = request.headers.language;

    const [salt] = await httpHandler.handlePromises(request, response, bcrypt.genSalt(+process.env.SALT_RONDS));
    const [hashPass] = await httpHandler.handlePromises(request, response, bcrypt.hash(request.body.password, salt));
    const newBody = { ...request.body, password: hashPass };

    const [document, documentError] = await httpHandler.handlePromises(request, response, Model.findOne({ _id: request.body._id }));
    if (!!documentError) return;
    if (!document)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.body._id}. Document name: {${Model.modelName}}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.body._id} não encontrada. Nome do documento: {${Model.modelName}}.`);

    const [data, error] = await httpHandler.handlePromises(request, response, Model.updateOne({ _id: request.body._id }, newBody, { new: true }));
    if (!!error) return;
    if (!data || data.n === 0)
        if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.body._id}.`);
        else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.body._id}. Nome do documento: {${Model.modelName}}.`);

    httpHandler.success(response, data, StatusCode.SuccessOk);
};
