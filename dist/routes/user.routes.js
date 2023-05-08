"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _auth = _interopRequireDefault(require("../middlewares/auth.middleware"));
var _user = _interopRequireDefault(require("../controllers/user.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const routes = (0, _express.Router)();

// GET ALL
routes.get('/api/users', _auth.default, _user.default.findAll);

// GET BY ID
routes.get('/api/users/:_id', _auth.default, _user.default.findOne);

// GET BY EMAIL
routes.get('/api/users/email/:email', _user.default.findOneByEmail);
var _default = routes;
exports.default = _default;