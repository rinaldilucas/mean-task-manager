import { Router } from 'express';
import { check } from 'express-validator';

import Controller from '@api/controllers/category.controller';
import authMiddleware from '@api/middlewares/auth.middleware';
import { verifyValidations } from '@api/middlewares/validator.middleware';

const routes = Router();

// find all
routes.get('/api/categories', authMiddleware, Controller.findAll);

// create
routes.post(
  '/api/categories',
  check('title', 'Must be at least 2 and lesser than 50 chars long') //
    .isLength({ min: 2 })
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
