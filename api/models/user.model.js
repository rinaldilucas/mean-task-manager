const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, minLength: 5, maxLength: 150 },
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

module.exports = mongoose.model('User', userSchema);
