import { Router } from 'express';
import { check } from 'express-validator';

import refreshMiddleware from '@middlewares/refresh.middleware';
import { bruteforce } from '@middlewares/security.middleware';
import { verifyValidations } from '@middlewares/validator.middleware';

import Controller from '@controllers/auth.controller';

const routes = Router();

// AUTHENTICATE
routes.post(
    '/api/auth/authenticate',
    check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
    check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
    bruteforce.prevent,
    verifyValidations,
    Controller.authenticate
);

// REGISTER
routes.post(
    '/api/auth/register', //
    check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
    check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
    verifyValidations,
    Controller.register
);

// GET BY EMAIL
routes.get('/api/auth/email-exists/:email', Controller.checkIfEmailExists);

// CHANGE PASSWORD
routes.put(
    '/api/auth/changePassword', //
    check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
    verifyValidations,
    Controller.changePassword
);

// REFRESH TOKEN
routes.post('/api/auth/refresh', refreshMiddleware, Controller.refreshToken);

// LOGOUT
routes.post('/api/auth/logout', Controller.logout);

export default routes;
