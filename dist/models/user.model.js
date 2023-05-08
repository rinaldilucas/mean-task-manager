"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = void 0;
var _mongoose = require("mongoose");
const validateEmail = email => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const SchemaModel = new _mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 5,
    maxLength: 150,
    validate: [validateEmail, 'Must be a valid email address'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 150
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  }
}, {
  timestamps: true
});
const User = (0, _mongoose.model)('User', SchemaModel);
exports.User = User;