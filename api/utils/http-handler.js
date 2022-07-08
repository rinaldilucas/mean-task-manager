const { StatusCode } = require('status-code-enum');

const responseSuccess = (response, data, statusCode = StatusCode.SuccessOK) => {
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
    });
};

const responseError = (response, error, statusCode = StatusCode.ServerErrorInternal, message) => {
    response.status(error.httpCode || statusCode);

    if (message) {
        console.log(message);
    } else {
        console.log(error);
    }

    return response.json({
        success: false,
        status: statusCode,
        message: message || error.message || error.toString(),
    });
};

module.exports = {
    success: responseSuccess,
    error: responseError,
};
