const User = require('../models/user.model');
const httpHandler = require('../utils/http-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistHandler = require('../redis/blacklist-handler');
const { StatusCode } = require('status-code-enum');

exports.findAll = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.find()
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding users. Error: ${error.message}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar usuários. Erro: ${error.message}.`);
        });
};

exports.findOne = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findOne({ _id: request.params._id })
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Usuário de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error retrieving user with id ${request.params._id}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar usuário com id ${request.params._id}.`);
        });
};

exports.findOneByUsername = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findOne({ username: request.params.username })
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User not found with username ${request.params.username}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Usuário de nome ${request.params.username} não encontrado.`);
            }
            httpHandler.success(response, { userExists: true }, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error retrieving user with username ${request.params.username}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar usuário com nome ${request.params.username}.`);
        });
};

exports.update = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findByIdAndUpdate(request.body._id, request.body, { new: true })
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Usuário de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error updating user with id ${request.params._id}. Error: ${error}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao atualizar ususário de id ${request.params._id}. Erro: ${error}.`);
        });
};

exports.delete = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findByIdAndRemove(request.params._id)
        .then((result) => {
            if (!result) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Usuário de id ${request.params._id} não encontrada.`);
            }
            httpHandler.success(response, result, StatusCode.SuccessAccepted);
        })
        .catch((error) => {
            if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error removing user with id ${request.params._id}. Error: ${error}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao remover usuário de id ${request.params._id}. Erro: ${error}.`);
        });
};

exports.register = async (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    try {
        const salt = await bcrypt.genSalt(+process.env.SALT_RONDS);
        const hashPash = await bcrypt.hash(request.body.password, salt);

        const newUser = new User({
            username: request.body.username,
            role: request.body.role,
            password: hashPash,
        });

        User.findOne({ username: request.body.username }).then((user) => {
            if (user) {
                if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorConflict, `User already exists with id ${request.params._id}.`);
                else return httpHandler.error(response, {}, StatusCode.ClientErrorConflict, `Usuário de id ${request.params._id} já existe.`);
            }
            newUser.save().then((result) => httpHandler.success(response, result, StatusCode.SuccessCreated));
        });
    } catch (error) {
        if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error creating user. Error: ${error.message}.`);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao criar usuário. Erro: ${error.message}.`);
    }
};

exports.authenticate = async (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    try {
        const user = await User.findOne({ username: request.body.username });
        if (!user) {
            if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Missmatch credential: Invalid username.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Erro de credencial: Usuário inválido.`);
        }

        const validated = await bcrypt.compare(request.body.password, user.password);
        if (!validated) {
            if (language == 'en') return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Missmatch credential: Invalid password.`);
            else return httpHandler.error(response, {}, StatusCode.ClientErrorUnauthorized, `Erro de credencial: Senha inválida.`);
        }

        const token = jwt.sign({ username: user.username, userId: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        const jwtPayload = {
            token: token,
            expiresIn: 60 * 60,
            userId: user._id,
        };

        httpHandler.success(response, jwtPayload, StatusCode.SuccessOK);
    } catch (error) {
        if (language == 'en') httpHandler.error(response, {}, StatusCode.ServerErrorInternal, `Error authorizing token. Error: ${error.message}.`);
        else httpHandler.error(response, {}, StatusCode.ServerErrorInternal, `Erro autorizando token. Erro: ${error.message}.`);
    }
};

exports.logout = async (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    try {
        const token = request.body.token;
        await blacklistHandler.add(token);
        httpHandler.success(response, {}, StatusCode.SuccessOK);
    } catch (error) {
        if (language == 'en') httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error logging out. Error: ${error.message}.`);
        else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao deslogar. Erro: ${error.message}.`);
    }
};
