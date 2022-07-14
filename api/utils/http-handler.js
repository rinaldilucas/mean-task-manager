const { StatusCode } = require('status-code-enum');

const responseSuccess = (response, data, statusCode = StatusCode.SuccessOK, totalCount) => {
    response.status(statusCode);

    if (data && data.length == undefined) {
        result = data;
        data = [];
        data.push(result);
    }

    return response.json({
        success: true,
        status: statusCode,
        data: data,
        count: totalCount ? totalCount : 1,
    });
};

const responseError = (response, error, statusCode = StatusCode.ServerErrorInternal, message) => {
    response.status(error.httpCode || statusCode);

    if (message) {
        console.log(message);
    } else if (Array.isArray(error)) {
        console.log('Validation errors:');
        console.table(error);
    } else if (typeof error === 'string' || error instanceof String) {
        console.log(error);
    }

    let responseMessage = message || error.message || error.toString();

    return response.json({
        success: false,
        status: statusCode,
        message: !Array.isArray(error) ? responseMessage : null,
        validationErrors: Array.isArray(error) ? error : [],
    });
};

module.exports = {
    success: responseSuccess,
    error: responseError,
};
