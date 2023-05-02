import { Router } from 'express';
import { check } from 'express-validator';
import { verifyValidations } from '../middlewares/validator.middleware';
import refreshMiddleware from '../middlewares/refresh.middleware';
import authMiddleware from '../middlewares/auth.middleware';

import Controller from '../controllers/user.controller';

const routes = Router();

// GET ALL
routes.get('/api/users', authMiddleware, Controller.findAll);

// GET BY ID
routes.get('/api/users/:_id', authMiddleware, Controller.findOne);

// GET BY EMAIL
routes.get('/api/users/email/:email', Controller.findOneByEmail);

// UPDATE
routes.put('/api/users', authMiddleware, Controller.update);

// REGISTER
routes.post(
    '/api/users/register', //
    check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
    check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
    verifyValidations,
    Controller.register
);

// AUTHENTICATE
routes.post(
    '/api/users/authenticate',
    check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
    check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
    verifyValidations,
    Controller.authenticate
);

// CHANGE PASSWORD
routes.put(
    '/api/users/changePassword', //
    check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
    verifyValidations,
    Controller.changePassword
);

// LOGOUT
routes.post('/api/users/logout', Controller.logout);

// REFRESH
routes.post('/api/users/refresh', refreshMiddleware, Controller.refreshToken);

export default routes;
