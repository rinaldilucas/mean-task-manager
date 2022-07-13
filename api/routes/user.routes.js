module.exports = function (app) {
    const passportMiddleware = require('../middleware/passport.middleware');
    const validatorMiddleware = require('../middleware/validator.middleware');
    const { body } = require('express-validator');

    const users = require('../controllers/user.controller');

    // GET ALL
    app.get('/api/users', passportMiddleware.applyBearerStrategy, users.findAll);

    // GET BY ID
    app.get('/api/users/:_id', passportMiddleware.applyBearerStrategy, users.findOne);

    // GET BY USERNAME
    app.get('/api/users/username/:username', users.findOneByUsername);

    // UPDATE
    app.put('/api/users', passportMiddleware.applyBearerStrategy, users.update);

    // DELETE
    app.delete('/api/users/:_id', passportMiddleware.applyBearerStrategy, users.delete);

    // REGISTER
    app.post(
        '/api/users/register', //
        body('username').isLength({ min: 5, max: 150 }).not().isEmpty().trim(),
        body('password').isLength({ min: 8, max: 150 }).not().isEmpty().trim(),
        validatorMiddleware.verifyValidations,
        users.register,
    );

    // AUTHENTICATE
    app.post(
        '/api/users/authenticate', //
        body('username').isLength({ min: 5, max: 150 }).not().isEmpty().trim(),
        body('password').isLength({ min: 8, max: 150 }).not().isEmpty().trim(),
        validatorMiddleware.verifyValidations,
        users.authenticate,
    );

    // LOGOUT
    app.post('/api/users/logout', users.logout);

    // CHANGE PASSWORD
    app.post(
        '/api/users/changePassword', //
        body('password').isLength({ min: 8, max: 150 }).not().isEmpty().trim(),
        validatorMiddleware.verifyValidations,
        users.changePassword,
    );
};
