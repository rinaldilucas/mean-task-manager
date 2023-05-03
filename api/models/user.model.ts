import { Model, Schema, model } from 'mongoose';
import { UserInterface as Interface } from '../interfaces/User.interface';

const validateEmail = (email: string): boolean => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const SchemaModel = new Schema({
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
    password: { type: String, required: true, minLength: 8, maxLength: 150 },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    }
},
{ timestamps: true }
);

export const User: Model<Interface> = model<Interface>('User', SchemaModel);
