import { Request, Response } from 'express';
import { StatusCode } from 'status-code-enum';

export const responseSuccess = (
  response: Response,
  data: any,
  statusCode = StatusCode.SuccessOK,
  totalCount = 1,
): Response<any, Record<string, any>> => {
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
    totalCount,
  });
};

export const responseError = (
  response: Response,
  error: any,
  statusCode = StatusCode.ServerErrorInternal,
  message?: string | Array<any>,
): Response<any, Record<string, any>> => {
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
    validationErrors: Array.isArray(error) ? error : [],
  });
};

export const handlePromises = async (request: Request, response: Response, promise: any): Promise<any> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    if (request.headers.language === 'en-US') responseError(response, error, StatusCode.ServerErrorInternal);
    else responseError(response, error, StatusCode.ServerErrorInternal);
    return [null, error];
  }
};
