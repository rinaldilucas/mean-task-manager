module.exports = function (app) {
    const passportMiddleware = require('../middleware/passport.middleware');
    const validatorMiddleware = require('../middleware/validator.middleware');
    const { body } = require('express-validator');

    const tasks = require('../controllers/task.controller');

    // GET ALL TASKS BY USER
    app.get('/api/tasks/user/:userId', passportMiddleware.applyBearerStrategy, tasks.findAllByUser);

    // GET BY ID
    app.get('/api/tasks/:_id', passportMiddleware.applyBearerStrategy, tasks.findOne);

    // CREATE
    app.post(
        '/api/tasks', //
        body('title').isLength({ min: 2 }).not().isEmpty().trim(),
        validatorMiddleware.verifyValidations,
        passportMiddleware.applyBearerStrategy,
        tasks.create,
    );

    // UPDATE
    app.put('/api/tasks', passportMiddleware.applyBearerStrategy, tasks.update);

    // DELETE
    app.delete('/api/tasks/:_id', passportMiddleware.applyBearerStrategy, tasks.delete);
};
