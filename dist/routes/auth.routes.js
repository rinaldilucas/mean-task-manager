"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _expressValidator = require("express-validator");
var _refresh = _interopRequireDefault(require("../middlewares/refresh.middleware"));
var _validator = require("../middlewares/validator.middleware");
var _auth = _interopRequireDefault(require("../controllers/auth.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const routes = (0, _express.Router)();

// AUTHENTICATE
routes.post('/api/auth/authenticate', (0, _expressValidator.check)('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({
  min: 5
}).isLength({
  max: 150
}).not().isEmpty().normalizeEmail().trim(), (0, _expressValidator.check)('password', 'Must be at least 8 and lesser than 150 chars long').isLength({
  min: 8
}).isLength({
  max: 150
}).not().isEmpty().trim(), _validator.verifyValidations, _auth.default.authenticate);

// REGISTER
routes.post('/api/auth/register',
//
(0, _expressValidator.check)('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({
  min: 5
}).isLength({
  max: 150
}).not().isEmpty().normalizeEmail().trim(), (0, _expressValidator.check)('password', 'Must be at least 8 and lesser than 150 chars long').isLength({
  min: 8
}).isLength({
  max: 150
}).not().isEmpty().trim(), _validator.verifyValidations, _auth.default.register);

// CHANGE PASSWORD
routes.put('/api/auth/changePassword',
//
(0, _expressValidator.check)('password', 'Must be at least 8 and lesser than 150 chars long').isLength({
  min: 8
}).isLength({
  max: 150
}).not().isEmpty().trim(), _validator.verifyValidations, _auth.default.changePassword);

// REFRESH TOKEN
routes.post('/api/auth/refresh', _refresh.default, _auth.default.refreshToken);

// LOGOUT
routes.post('/api/auth/logout', _auth.default.logout);
var _default = routes;
exports.default = _default;