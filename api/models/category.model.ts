
import { Model, Schema, model } from 'mongoose';
import { CategoryInterface as Interface } from '@api/interfaces/Category.interface';

const SchemaModel = new Schema({
    title: { type: String, required: true, unique: true, minLength: 2 }
},
{ timestamps: true }
);

export const Category: Model<Interface> = model<Interface>('Category', SchemaModel);
