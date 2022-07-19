import passportMiddleware from '../middleware/passport.middleware';
import validatorMiddleware from '../middleware/validator.middleware';
import { check } from 'express-validator';

import { findAll, create, remove } from '../controllers/category.controller';

export default (app) => {
    // GET ALL
    app.get('/api/categories', passportMiddleware.applyBearerStrategy, findAll);

    // CREATE
    app.post(
        '/api/categories',
        check('title', 'Must be at least 2 and lesser than 50 chars long') //
            .isLength({ min: 2 })
            .isLength({ max: 50 })
            .not()
            .isEmpty()
            .trim(),
        validatorMiddleware.verifyValidations,
        passportMiddleware.applyBearerStrategy,
        create
    );

    // DELETE
    app.delete('/api/categories/:_id', passportMiddleware.applyBearerStrategy, remove);
};
