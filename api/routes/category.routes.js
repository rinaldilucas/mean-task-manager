module.exports = function (app) {
    const passportMiddleware = require('../middleware/passport.middleware');
    const validatorMiddleware = require('../middleware/validator.middleware');
    const { check } = require('express-validator');

    const categories = require('../controllers/category.controller');

    // GET ALL
    app.get('/api/categories', passportMiddleware.applyBearerStrategy, categories.findAll);

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
        categories.create,
    );

    // DELETE
    app.delete('/api/categories/:_id', passportMiddleware.applyBearerStrategy, categories.delete);
};
