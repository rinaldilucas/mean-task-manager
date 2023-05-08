"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class DatabaseConfig {
  url = 'mongodb://127.0.0.1:27017/meantemplatedb';
  urlProd = 'mongodb://host:password@schema:port/collection';
}
var _default = new DatabaseConfig();
exports.default = _default;