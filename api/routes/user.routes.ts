import { Router } from 'express';

import authMiddleware from '../middlewares/auth.middleware';

import Controller from '../controllers/user.controller';

const routes = Router();

// GET ALL
routes.get('/api/users', authMiddleware, Controller.findAll);

// GET BY ID
routes.get('/api/users/:_id', authMiddleware, Controller.findOne);

// GET BY EMAIL
routes.get('/api/users/email/:email', Controller.findOneByEmail);

export default routes;
