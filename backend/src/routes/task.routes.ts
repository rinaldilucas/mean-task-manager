import { Router } from 'express';
import { check } from 'express-validator';

import Controller from '@api/controllers/task.controller';
import authMiddleware from '@api/middlewares/auth.middleware';
import { verifyValidations } from '@api/middlewares/validator.middleware';

const routes = Router();

// get all
routes.get('/api/tasks', authMiddleware, Controller.getAll);

// get by id
routes.get('/api/tasks/:_id', authMiddleware, Controller.getOne);

// create
routes.post(
  '/api/tasks',
  check('title', 'Must be at least 2 and lesser than 100 chars long.')
    .isLength({ min: 2 })
    .isLength({ max: 100 })
    .not()
    .isEmpty()
    .trim(),
  check('description', 'Must be lesser than 300 chars long').isLength({ max: 300 }).trim(),
  verifyValidations,
  authMiddleware,
  Controller.create,
);

// update
routes.put('/api/tasks/:_id', authMiddleware, Controller.update);

// delete
routes.delete('/api/tasks/:_id', authMiddleware, Controller.remove);

export default routes;
