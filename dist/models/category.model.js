"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Category = void 0;
var _mongoose = require("mongoose");
const SchemaModel = new _mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minLength: 2
  }
}, {
  timestamps: true
});
const Category = (0, _mongoose.model)('Category', SchemaModel);
exports.Category = Category;