module.exports = function (app) {
    const passportMiddleware = require('../middleware/passport.middleware');
    const validatorMiddleware = require('../middleware/validator.middleware');
    const { body } = require('express-validator');

    const categories = require('../controllers/category.controller');

    // GET ALL
    app.get('/api/categories', passportMiddleware.applyBearerStrategy, categories.findAll);

    // GET BY ID
    app.get('/api/categories/:_id', passportMiddleware.applyBearerStrategy, categories.findOne);

    // CREATE
    app.post(
        '/api/categories', //
        body('title').isLength({ min: 2 }).not().isEmpty().trim(),
        validatorMiddleware.verifyValidations,
        passportMiddleware.applyBearerStrategy,
        categories.create,
    );

    // DELETE
    app.delete('/api/categories/:_id', passportMiddleware.applyBearerStrategy, categories.delete);
};
