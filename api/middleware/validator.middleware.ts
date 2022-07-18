const httpHandler = require('../utils/http-handler');
const { StatusCode } = require('status-code-enum');
const { validationResult } = require('express-validator');

module.exports = {
    verifyValidations: (request, response, next) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) return httpHandler.error(response, errors.array(), StatusCode.ClientErrorBadRequest);
        else next();
    },
};
