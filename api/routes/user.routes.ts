import { applyBearerStrategy } from '../middleware/passport.middleware';
import { verifyValidations } from '../middleware/validator.middleware';
import { check } from 'express-validator';

import { findAll, findOne, findOneByEmail, update, register, changePassword, authenticate, logout } from '../controllers/user.controller';

export default (app) => {
    // GET ALL
    app.get('/api/users', applyBearerStrategy, findAll);

    // GET BY ID
    app.get('/api/users/:_id', applyBearerStrategy, findOne);

    // GET BY EMAIL
    app.get('/api/users/email/:email', findOneByEmail);

    // UPDATE
    app.put('/api/users', applyBearerStrategy, update);

    // REGISTER
    app.post(
        '/api/users/register', //
        check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
        check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
        verifyValidations,
        register
    );

    // AUTHENTICATE
    app.post(
        '/api/users/authenticate',
        check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
        check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
        verifyValidations,
        authenticate
    );

    // CHANGE PASSWORD
    app.put(
        '/api/users/changePassword', //
        check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
        verifyValidations,
        changePassword
    );

    // LOGOUT
    app.post('/api/users/logout', logout);
};
