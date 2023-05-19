"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _expressValidator = require("express-validator");
var _auth = _interopRequireDefault(require("../middlewares/auth.middleware"));
var _validator = require("../middlewares/validator.middleware");
var _task = _interopRequireDefault(require("../controllers/task.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const routes = (0, _express.Router)();

// GET ALL TASKS BY USER
routes.get('/api/tasks/user/:userId', _auth.default, _task.default.findAllByUser);

// GET BY ID
routes.get('/api/tasks/:_id', _auth.default, _task.default.findOne);

// CREATE
routes.post('/api/tasks', (0, _expressValidator.check)('title', 'Must be at least 2 and lesser than 100 chars long.').isLength({
  min: 2
}).isLength({
  max: 100
}).not().isEmpty().trim(), (0, _expressValidator.check)('description', 'Must be lesser than 300 chars long').isLength({
  max: 300
}).trim(), _validator.verifyValidations, _auth.default, _task.default.create);

// UPDATE
routes.put('/api/tasks', _auth.default, _task.default.update);

// DELETE
routes.delete('/api/tasks/:_id', _auth.default, _task.default.remove);

// GET TASKS BY INTERVAL
routes.get('/api/tasks/by-interval/:userId', _auth.default, _task.default.getTasksByInterval);
var _default = routes;
exports.default = _default;