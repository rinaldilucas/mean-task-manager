import { Router } from 'express';
import refreshMiddleware from '../middlewares/refresh.middleware';

import Controller from '../controllers/auth.controller';

const routes = Router();

// LOGIN
routes.post(
    '/api/auth/login',
    Controller.login
);

// REFRESH
routes.post(
    '/api/auth/refresh',
    refreshMiddleware, Controller.refreshToken
);

export default routes;
