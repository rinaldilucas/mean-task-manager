import { Router } from 'express';
import { check } from 'express-validator';
import { applyBearerStrategy } from '../middleware/passport.middleware';
import { verifyValidations } from '../middleware/validator.middleware';

import Controller from '../controllers/user.controller';

const routes = Router();

// GET ALL
routes.get('/api/users', applyBearerStrategy, Controller.findAll);

// GET BY ID
routes.get('/api/users/:_id', applyBearerStrategy, Controller.findOne);

// GET BY EMAIL
routes.get('/api/users/email/:email', Controller.findOneByEmail);

// UPDATE
routes.put('/api/users', applyBearerStrategy, Controller.update);

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

export default routes;
