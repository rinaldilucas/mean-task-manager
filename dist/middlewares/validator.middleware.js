"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyValidations = void 0;
var _expressValidator = require("express-validator");
var _statusCodeEnum = require("status-code-enum");
var _http = require("../utils/http.handler");
const verifyValidations = (request, response, next) => {
  const errors = (0, _expressValidator.validationResult)(request);
  if (!errors.isEmpty()) return (0, _http.responseError)(response, errors.array(), _statusCodeEnum.StatusCode.ClientErrorBadRequest);else next();
};
exports.verifyValidations = verifyValidations;