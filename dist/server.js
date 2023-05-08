"use strict";

var _httpErrors = _interopRequireDefault(require("http-errors"));
var _app = _interopRequireDefault(require("./app"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Creates server
_app.default.listen(process.env.SERVER_PORT, () => {
  const host = process.env.SERVER_HOST;
  const port = process.env.SERVER_PORT;
  console.log('App listening at http://%s:%s.', host, port);
});

// 404 Handler
_app.default.use((_request, _response, next) => next((0, _httpErrors.default)(404, "This route don't exist.", {
  expose: false
})));

// Error handler
_app.default.use((error, _request, response) => {
  console.error(error.message);
  if (!error.statusCode) error.statusCode = 500;
  response.status(error.statusCode).send(error.message);
});