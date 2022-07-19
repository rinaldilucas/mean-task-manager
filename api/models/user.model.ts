import mongoose from 'mongoose';

const validateEmail = function (email) {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const userSchema = mongoose.Schema(
    {
        email: {
            type: String, //
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 5,
            maxLength: 150,
            validate: [validateEmail, 'Must be a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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

module.exports = mongoose.model('User', userSchema);
