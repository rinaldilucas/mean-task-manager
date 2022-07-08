const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, miLength: 5 },
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
