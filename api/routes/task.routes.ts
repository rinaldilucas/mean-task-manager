import passportMiddleware from '../middleware/passport.middleware';
import validatorMiddleware from '../middleware/validator.middleware';
import { check } from 'express-validator';

import { findAllByUser, findOne, create, update, remove } from '../controllers/task.controller';

export default (app) => {
    // GET ALL TASKS BY USER
    app.get('/api/tasks/user/:userId', passportMiddleware.applyBearerStrategy, findAllByUser);

    // GET BY ID
    app.get('/api/tasks/:_id', passportMiddleware.applyBearerStrategy, findOne);

    // CREATE
    app.post(
        '/api/tasks',
        check('title', 'Must be at least 2 and lesser than 100 chars long.').isLength({ min: 2 }).isLength({ max: 100 }).not().isEmpty().trim(),
        check('description', 'Must be lesser than 300 chars long').isLength({ max: 300 }).trim(),
        validatorMiddleware.verifyValidations,
        passportMiddleware.applyBearerStrategy,
        create
    );

    // UPDATE
    app.put('/api/tasks', passportMiddleware.applyBearerStrategy, update);

    // DELETE
    app.delete('/api/tasks/:_id', passportMiddleware.applyBearerStrategy, remove);
};
