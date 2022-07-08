const Category = require('../models/category.model');
const { StatusCode } = require('status-code-enum');
const httpHandler = require('../utils/http-handler');

exports.findAll = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Category.find()
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error finding categories. Error: ${error.message}.`);
        });
};

exports.findOne = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Category.findById(request.params._id)
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Category doesn't exists.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessOK);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `Category not found with id ${request.params._id}.`);
            }
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Could not delete category with id ${request.params._id}. Error: ${error}.`);
        });
};

exports.create = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';
    const category = new Category(request.body);

    category
        .save()
        .then((result) => {
            httpHandler.success(response, result, StatusCode.SuccessCreated);
        })
        .catch((error) => {
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Error creating category. Error: ${error.message}.`);
        });
};

exports.delete = (request, response) => {
    const language = request.query.language === 'en' ? 'en' : 'pt';

    Category.findByIdAndRemove(request.params._id)
        .then((result) => {
            if (!result) {
                return httpHandler.error(response, {}, StatusCode.ClientErrorNotFound, `Category not found with id ${request.params._id}.`);
            }

            httpHandler.success(response, result, StatusCode.SuccessAccepted);
        })
        .catch((error) => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                httpHandler.error(response, error, StatusCode.ClientErrorNotFound, `Category not found with id ${request.params._id}.`);
            }
            httpHandler.error(response, error, StatusCode.ServerErrorInternal, `Could not delete category with id ${request.params._id}. Error: ${error}.`);
        });
};
