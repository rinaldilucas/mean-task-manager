
import { Schema, Model, model } from 'mongoose';
import { CategoryInterface as Interface } from '../interfaces/category';

const SchemaModel = new Schema({
    title: { type: String, required: true, unique: true, minLength: 2 }
},
{ timestamps: true }
);

export const Category: Model<Interface> = model<Interface>('Category', SchemaModel);
