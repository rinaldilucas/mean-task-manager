import { applyBearerStrategy } from '../middleware/passport.middleware';
import { verifyValidations } from '../middleware/validator.middleware';
import { check } from 'express-validator';

import { findAll, create, remove } from '../controllers/category.controller';

export default (app) => {
    // GET ALL
    app.get('/api/categories', applyBearerStrategy, findAll);

    // CREATE
    app.post(
        '/api/categories',
        check('title', 'Must be at least 2 and lesser than 50 chars long') //
            .isLength({ min: 2 })
            .isLength({ max: 50 })
            .not()
            .isEmpty()
            .trim(),
        verifyValidations,
        applyBearerStrategy,
        create
    );

    // DELETE
    app.delete('/api/categories/:_id', applyBearerStrategy, remove);
};
