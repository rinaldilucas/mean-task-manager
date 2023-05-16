
import { CategoryInterface as Interface } from '@api/models/interfaces/Category.interface';
import { Model, Schema, SchemaTypes, model } from 'mongoose';

const SchemaModel = new Schema({
    title: { type: String, required: true, minLength: 2 },
    userId: { type: SchemaTypes.ObjectId, ref: 'User', required: true }
},
{ timestamps: true }
);

export const Category: Model<Interface> = model<Interface>('Category', SchemaModel);
