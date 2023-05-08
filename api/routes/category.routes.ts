import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '@middlewares/auth.middleware';
import { verifyValidations } from '@middlewares/validator.middleware';

import Controller from '@controllers/category.controller';

const routes = Router();

// GET ALL
routes.get('/api/categories', authMiddleware, Controller.findAll);

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
    authMiddleware,
    Controller.create
);

// DELETE
routes.delete('/api/categories/:_id', authMiddleware, Controller.remove);

export default routes;
