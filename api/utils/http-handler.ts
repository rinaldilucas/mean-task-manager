import { StatusCode } from 'status-code-enum';

export const responseSuccess = (response, data, statusCode = StatusCode.SuccessOK, totalCount = 1) => {
    response.status(statusCode);
    let result;

    if (data && data.length === undefined) {
        result = data;
        data = [];
        data.push(result);
    }

    return response.json({
        success: true,
        status: statusCode,
        data,
        totalCount
    });
};

export const responseError = (response, error, statusCode = StatusCode.ServerErrorInternal, message) => {
    response.status(error.httpCode || statusCode);

    if (message) {
        console.log(`[API]: ${message}`);
    } else if (Array.isArray(error)) {
        console.log('[API]: Validation errors:');
        console.table(error);
    } else if (typeof error === 'string' || error instanceof String) {
        console.log(`[API]: ${error}`);
    } else if (error?.message) {
        console.log(`[API]: ${error.message}`);
    }

    const responseMessage = message || error.message || error.toString();

    return response.json({
        success: false,
        status: statusCode,
        message: !Array.isArray(error) ? responseMessage : null,
        validationErrors: Array.isArray(error) ? error : []
    });
};

export const handlePromises = async (request, response, promise) => {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        if (request.headers.language === 'en-US') responseError(response, error, StatusCode.ServerErrorInternal);
        else responseError(response, error, StatusCode.ServerErrorInternal);
        return [null, error];
    }
};
