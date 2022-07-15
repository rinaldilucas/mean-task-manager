module.exports = function (app) {
    const passportMiddleware = require('../middleware/passport.middleware');
    const validatorMiddleware = require('../middleware/validator.middleware');
    const { check } = require('express-validator');

    const users = require('../controllers/user.controller');

    // GET ALL
    app.get('/api/users', passportMiddleware.applyBearerStrategy, users.findAll);

    // GET BY ID
    app.get('/api/users/:_id', passportMiddleware.applyBearerStrategy, users.findOne);

    // GET BY EMAIL
    app.get('/api/users/email/:email', users.findOneByEmail);

    // UPDATE
    app.put('/api/users', passportMiddleware.applyBearerStrategy, users.update);

    // REGISTER
    app.post(
        '/api/users/register', //
        check('email', 'Must be at least 5 and lesser than 150 chars long') //
            .isEmail()
            .withMessage('Must be a valid email address')
            .isLength({ min: 5 })
            .withMessage('Must be at least 5 chars long')
            .isLength({ max: 150 })
            .withMessage('Must be lesser than 150 chars long')
            .not()
            .isEmpty()
            .normalizeEmail()
            .trim(),
        check('password', 'Must be at least 8 and lesser than 150 chars long') //
            .isLength({ min: 8 })
            .withMessage('Must be at least 8 chars long')
            .isLength({ max: 150 })
            .withMessage('Must be lesser than 150 chars long')
            .not()
            .isEmpty()
            .trim(),
        validatorMiddleware.verifyValidations,
        users.register,
    );

    // AUTHENTICATE
    app.post(
        '/api/users/authenticate', //
        check('email', 'Must be at least 5 and lesser than 150 chars long') //
            .isEmail()
            .withMessage('Must be a valid email address')
            .isLength({ min: 5 })
            .withMessage('Must be at least 5 chars long')
            .isLength({ max: 150 })
            .withMessage('Must be lesser than 150 chars long')
            .not()
            .isEmpty()
            .normalizeEmail()
            .trim(),
        check('password', 'Must be at least 8 and lesser than 150 chars long') //
            .isLength({ min: 8 })
            .withMessage('Must be at least 8 chars long')
            .isLength({ max: 150 })
            .withMessage('Must be lesser than 150 chars long')
            .not()
            .isEmpty()
            .trim(),
        validatorMiddleware.verifyValidations,
        users.authenticate,
    );

    // CHANGE PASSWORD
    app.post(
        '/api/users/changePassword', //
        check('password', 'Must be at least 8 and lesser than 150 chars long') //
            .isLength({ min: 8 })
            .withMessage('Must be at least 8 chars long')
            .isLength({ max: 150 })
            .withMessage('Must be lesser than 150 chars long')
            .not()
            .isEmpty()
            .trim(),
        validatorMiddleware.verifyValidations,
        users.changePassword,
    );

    // LOGOUT
    app.post('/api/users/logout', users.logout);
};
