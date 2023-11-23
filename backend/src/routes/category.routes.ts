import { Router } from 'express';
import { check } from 'express-validator';

import Controller from '@api/controllers/category.controller';
import authMiddleware from '@api/middlewares/auth.middleware';
import { verifyValidations } from '@api/middlewares/validator.middleware';

const routes = Router();

// get all
routes.get('/api/categories', authMiddleware, Controller.getAll);

// create
routes.post(
  '/api/categories',
  check('title', 'Must lesser than 50 chars long') //
    .isLength({ max: 50 })
    .not()
    .isEmpty()
    .trim(),
  verifyValidations,
  authMiddleware,
  Controller.create,
);

// delete
routes.delete('/api/categories/:_id', authMiddleware, Controller.remove);

export default routes;
