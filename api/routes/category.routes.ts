import { Router } from 'express';
import { check } from 'express-validator';
import { applyBearerStrategy } from '../middleware/passport.middleware';
import { verifyValidations } from '../middleware/validator.middleware';

import Controller from '../controllers/category.controller';

const routes = Router();

// GET ALL
routes.get('/api/categories', applyBearerStrategy, Controller.findAll);

// CREATE
routes.post(
    '/api/categories',
    check('title', 'Must be at least 2 and lesser than 50 chars long') //
        .isLength({ min: 2 })
        .isLength({ max: 50 })
        .not()
        .isEmpty()
        .trim(),
    verifyValidations,
    applyBearerStrategy,
    Controller.create
);

// DELETE
routes.delete('/api/categories/:_id', applyBearerStrategy, Controller.remove);

export default routes;
