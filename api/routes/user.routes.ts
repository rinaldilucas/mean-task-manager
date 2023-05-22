import { Router } from 'express';

import Controller from '@controllers/user.controller';

const routes = Router();

// GET BY EMAIL
routes.get('/api/users/email/:email', Controller.findOneByEmail);

export default routes;
