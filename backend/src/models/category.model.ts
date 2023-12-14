import { Model, Schema, SchemaTypes, model } from 'mongoose';

import { CategoryInterface as Interface } from '@api/shared/interfaces/category.interface';

const SchemaModel = new Schema(
  {
    title: { type: String, required: true },
    userId: { type: SchemaTypes.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Category: Model<Interface> = model<Interface>('Category', SchemaModel);
