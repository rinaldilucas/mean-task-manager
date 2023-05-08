"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _expressValidator = require("express-validator");
var _auth = _interopRequireDefault(require("../middlewares/auth.middleware"));
var _validator = require("../middlewares/validator.middleware");
var _category = _interopRequireDefault(require("../controllers/category.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const routes = (0, _express.Router)();

// GET ALL
routes.get('/api/categories', _auth.default, _category.default.findAll);

// CREATE
routes.post('/api/categories', (0, _expressValidator.check)('title', 'Must be at least 2 and lesser than 50 chars long') //
.isLength({
  min: 2
}).isLength({
  max: 50
}).not().isEmpty().trim(), _validator.verifyValidations, _auth.default, _category.default.create);

// DELETE
routes.delete('/api/categories/:_id', _auth.default, _category.default.remove);
var _default = routes;
exports.default = _default;