const User = require('../models/user.model');
const { StatusCode } = require('status-code-enum');
const httpHandler = require('../utils/http-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistHandler = require('../redis/blacklist-handler');

exports.findAll = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.find()
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (language) httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Erro ao buscar usuários. Erro: ${error.message}.`);
            else httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding users. Error: ${error.message}.`);
        });
};

exports.findOne = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findOne({ _id: request.params._id })
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User doesn't exists.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
            }

            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error retrieving User with id ${request.params._id}.`);
        });
};

exports.findByUsername = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findOne({ username: request.params._id })
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User doesn't exists.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
            }

            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error retrieving User with id ${request.params._id}.`);
        });
};

exports.update = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findByIdAndUpdate(request.body._id, request.body, { new: true })
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
            }

            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error updating user with id ${request.params._id}.`);
        });
};

exports.delete = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    User.findByIdAndRemove(request.params._id)
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessAccepted);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `User not found with id ${request.params._id}.`);
            }

            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Could not delete user with id ${request.params._id}. Error: ${error}.`);
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

        User.findOne({ username: request.body.username })
            .then((user) => {
                if (user) {
                    httpHandler.error(response, {}, StatusCode.ClientErrorConflict, `User already exists.`);
                }

                newUser.save().then((result) => {
                    httpHandler.success(response, result, StatusCode.SuccessCreated);
                });
            })
            .catch((error) => {
                httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error creating user. Error: ${error.message}.`);
            });
    } catch (error) {
        httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error creating user. Error: ${error.message}.`);
    }
};

exports.authenticate = async (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    try {
        const user = await User.findOne({ username: request.body.username });
        if (!user) return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `You have entered an invalid username.`);

        const validated = await bcrypt.compare(request.body.password, user.password);
        if (!validated) return httpHandler.error(response, {}, StatusCode.ClientErrorForbidden, `You have entered an invalid password.`);

        const token = jwt.sign({ username: user.username, userId: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' });

        const jwtToken = {
            token: token,
            expiresIn: 3600,
            userId: user._id,
        };

        httpHandler.success(response, jwtToken, StatusCode.SuccessOK);
    } catch (error) {
        httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error authorizing. Error: ${error.message}.`);
    }
};

exports.logout = async (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    try {
        const token = request.body.token;
        await blacklistHandler.add(token);
        httpHandler.success(response, {}, StatusCode.SuccessOK);
    } catch (error) {
        httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error logging out. Error: ${error.message}.`);
    }
};
