const Model = require('../models/user.model');
const httpHandler = require('../utils/http-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistHandler = require('../redis/blacklist-handler');
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

exports.findOne = async (request, response) => {
    const language = request.headers.language;

    try {
        const document = await Model.findOne({ _id: request.params._id });
        if (!document)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);

        httpHandler.success(response, document, StatusCode.SuccessOK);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.findOneByEmail = async (request, response) => {
    const language = request.headers.language;

    try {
        const document = await Model.findOne({ email: request.params.email });
        if (!document)
            if (language == 'en-US') return httpHandler.success(response, document, StatusCode.SuccessNoContent);
            else return httpHandler.success(response, document, StatusCode.SuccessNoContent);

        httpHandler.success(response, { userExists: true }, StatusCode.SuccessOK);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.update = async (request, response) => {
    const language = request.headers.language;

    try {
        const document = await Model.findOne({ _id: request.body._id });
        if (!document)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);

        const result = await Model.updateOne({ _id: request.body._id }, request.body, { new: true });
        if (!result || result.n === 0)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.params._id}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.params._id}. Nome do documento: {${Model.modelName}}.`);

        httpHandler.success(response, result, StatusCode.SuccessNoContent);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.register = async (request, response) => {
    const language = request.headers.language;

    try {
        const salt = await bcrypt.genSalt(+process.env.SALT_RONDS);
        const hashPash = await bcrypt.hash(request.body.password, salt);

        const newUser = new Model({
            email: request.body.email,
            role: request.body.role,
            password: hashPash,
        });

        const document = await Model.findOne({ email: request.body.email });
        if (document)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorConflict, `User already exists with email ${request.params.email}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorConflict, `Usuário de nome ${request.params.email} já existe.`);

        const result = await newUser.save();
        if (!result || result.n === 0) {
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error creating document. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao criar documento. Nome do documento: {${Model.modelName}}.`);
        }

        httpHandler.success(response, result, StatusCode.SuccessCreated);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.authenticate = async (request, response) => {
    const language = request.headers.language;

    try {
        const document = await Model.findOne({ email: request.body.email });
        if (!document)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Missmatch credential: Invalid email.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Erro de credencial: Usuário inválido.`);

        const validated = await bcrypt.compare(request.body.password, document.password);
        if (!validated)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Missmatch credential: Invalid password.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Erro de credencial: Senha inválida.`);

        const token = jwt.sign({ email: document.email, userId: document._id, role: document.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        const jwtPayload = {
            token: token,
            expiresIn: 60 * 60,
            userId: document._id,
        };

        httpHandler.success(response, jwtPayload, StatusCode.SuccessOK);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.logout = async (request, response) => {
    const language = request.headers.language;

    try {
        const token = request.body.token;
        await blacklistHandler.add(token);
        httpHandler.success(response, {}, StatusCode.SuccessOK);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};

exports.changePassword = async (request, response) => {
    const language = request.headers.language;

    try {
        const salt = await bcrypt.genSalt(+process.env.SALT_RONDS);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const newBody = { ...request.body, password: hashedPassword };

        const document = await Model.findOne({ _id: request.body._id });
        if (!document)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Document not found with id ${request.params._id}. Document name: {${Model.modelName}}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Documento de id ${request.params._id} não encontrada. Nome do documento: {${Model.modelName}}.`);

        const result = await Model.updateOne({ _id: request.body._id }, newBody, { new: true });
        if (!result || result.n === 0)
            if (language == 'en-US') return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Error updating document with id ${request.params._id}.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorBadRequest, `Erro ao atualizar documento de id ${request.params._id}. Nome do documento: {${Model.modelName}}.`);

        httpHandler.success(response, result, StatusCode.SuccessNoContent);
    } catch (error) {
        if (language == 'en-US') httpHandler.error(response, error, StatusCode.ServerErrorInternal);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal);
    }
};
