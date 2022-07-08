const verifyAuthToken = require('../middleware/check-auth');

module.exports = function (app) {
    const categories = require('../controllers/category.controller');

    // GET ALL
    app.get('/api/categories', verifyAuthToken.bearer, categories.findAll);

    // GET BY ID
    app.get('/api/categories/:_id', verifyAuthToken.bearer, categories.findOne);

    // CREATE
    app.post('/api/categories', verifyAuthToken.bearer, categories.create);

    // DELETE
    app.delete('/api/categories/:_id', verifyAuthToken.bearer, categories.delete);
};
