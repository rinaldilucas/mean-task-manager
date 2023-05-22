"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _user = _interopRequireDefault(require("../controllers/user.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const routes = (0, _express.Router)();

// GET BY EMAIL
routes.get('/api/users/email/:email', _user.default.findOneByEmail);
var _default = routes;
exports.default = _default;