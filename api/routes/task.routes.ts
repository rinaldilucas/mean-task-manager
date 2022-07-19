import { Router } from 'express';
import { applyBearerStrategy } from '../middleware/passport.middleware';
import { verifyValidations } from '../middleware/validator.middleware';
import { check } from 'express-validator';

import Controller from '../controllers/task.controller';

const routes = Router();

// GET ALL TASKS BY USER
routes.get('/api/tasks/user/:userId', applyBearerStrategy, Controller.findAllByUser);

// GET BY ID
routes.get('/api/tasks/:_id', applyBearerStrategy, Controller.findOne);

// CREATE
routes.post(
    '/api/tasks',
    check('title', 'Must be at least 2 and lesser than 100 chars long.').isLength({ min: 2 }).isLength({ max: 100 }).not().isEmpty().trim(),
    check('description', 'Must be lesser than 300 chars long').isLength({ max: 300 }).trim(),
    verifyValidations,
    applyBearerStrategy,
    Controller.create
);

// UPDATE
routes.put('/api/tasks', applyBearerStrategy, Controller.update);

// DELETE
routes.delete('/api/tasks/:_id', applyBearerStrategy, Controller.remove);

export default routes;
