import { Request, Response } from 'express';
import { StatusCode } from 'status-code-enum';

import { handlePromises, responseSuccess } from '@api/utils/http.handler';
import { User as Model } from '@models/user.model';

class UserController {
    public async findOneByEmail (request: Request, response: Response): Promise<Response | undefined> {
        const [data, error] = await handlePromises(request, response, Model.findOne({ email: request.params.email }));
        if (error) return;
        if (!data) return responseSuccess(response, {}, StatusCode.SuccessOK, 0);

        return responseSuccess(response, { alreadyRegistered: true }, StatusCode.SuccessOK);
    }
}

export default new UserController();
