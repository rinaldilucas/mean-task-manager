const verifyAuthToken = require('../middleware/check-auth');

module.exports = function (app) {
    const users = require('../controllers/user.controller');

    // GET ALL
    app.get('/api/users', verifyAuthToken.bearer, users.findAll);

    // GET BY ID
    app.get('/api/users/:_id', verifyAuthToken.bearer, users.findOne);

    // GET BY USERNAME
    app.get('/api/users/username/:username', users.findOneByUsername);

    // UPDATE
    app.put('/api/users', verifyAuthToken.bearer, users.update);

    // DELETE
    app.delete('/api/users/:_id', verifyAuthToken.bearer, users.delete);

    // REGISTER
    app.post('/api/users/register', users.register);

    // AUTHENTICATE
    app.post('/api/users/authenticate', users.authenticate);

    // LOGOUT
    app.post('/api/users/logout', users.logout);
};
