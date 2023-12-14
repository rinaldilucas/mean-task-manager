import { Model, Schema, model } from 'mongoose';

import { UserInterface as Interface } from '@api/shared/interfaces/user.interface';

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

const SchemaModel = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 5,
      maxLength: 150,
      validate: [validateEmail, 'Must be a valid email address'],
      match: [emailRegex, 'Please fill a valid email address'],
    },
    password: { type: String, required: true, minLength: 8, maxLength: 150 },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
  },
  { timestamps: true },
);

export const User: Model<Interface> = model<Interface>('User', SchemaModel);
