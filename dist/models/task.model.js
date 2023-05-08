"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Task = void 0;
var _mongoose = require("mongoose");
const SchemaModel = new _mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 300
  },
  date: {
    type: Date
  },
  status: {
    type: String,
    enum: ['toDo', 'inProgress', 'done'],
    default: 'toDo',
    required: true
  },
  category: {
    type: String
  },
  userId: {
    type: _mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});
const Task = (0, _mongoose.model)('Task', SchemaModel);
exports.Task = Task;