module.exports = function (app) {
    const passportMiddleware = require('../middleware/passport.middleware');
    const validatorMiddleware = require('../middleware/validator.middleware');
    const { check } = require('express-validator');

    const tasks = require('../controllers/task.controller');

    // GET ALL TASKS BY USER
    app.get('/api/tasks/user/:userId', passportMiddleware.applyBearerStrategy, tasks.findAllByUser);

    // GET BY ID
    app.get('/api/tasks/:_id', passportMiddleware.applyBearerStrategy, tasks.findOne);

    // CREATE
    app.post(
        '/api/tasks',
        check('title', 'Must be at least 2 and lesser than 100 chars long.').isLength({ min: 2 }).isLength({ max: 100 }).not().isEmpty().trim(),
        check('description', 'Must be lesser than 300 chars long').isLength({ max: 300 }).trim(),
        validatorMiddleware.verifyValidations,
        passportMiddleware.applyBearerStrategy,
        tasks.create,
    );

    // UPDATE
    app.put('/api/tasks', passportMiddleware.applyBearerStrategy, tasks.update);

    // DELETE
    app.delete('/api/tasks/:_id', passportMiddleware.applyBearerStrategy, tasks.delete);
};
