const verifyAuthToken = require('../middleware/check-auth');

module.exports = function (app) {
    const tasks = require('../controllers/task.controller');

    // GET ALL TASKS BY USER
    app.get('/api/tasks/user/:userId', verifyAuthToken.bearer, tasks.findAllByUser);

    // GET BY ID
    app.get('/api/tasks/:_id', verifyAuthToken.bearer, tasks.findOne);

    // CREATE
    app.post('/api/tasks', verifyAuthToken.bearer, tasks.create);

    // UPDATE
    app.put('/api/tasks', verifyAuthToken.bearer, tasks.update);

    // DELETE
    app.delete('/api/tasks/:_id', verifyAuthToken.bearer, tasks.delete);
};
