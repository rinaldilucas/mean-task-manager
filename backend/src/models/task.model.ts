import { Model, Schema, SchemaTypes, model } from 'mongoose';

import { TaskInterface as Interface } from '@api/shared/interfaces/task.interface';

const SchemaModel = new Schema(
  {
    title: { type: String, required: true, minLength: 2, maxLength: 100 },
    description: { type: String, maxLength: 300 },
    date: { type: Date },
    status: {
      type: String,
      enum: ['toDo', 'inProgress', 'done'],
      default: 'toDo',
      required: true,
    },
    category: { type: SchemaTypes.String, ref: 'Category' },
    userId: { type: SchemaTypes.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Task: Model<Interface> = model<Interface>('Task', SchemaModel);
