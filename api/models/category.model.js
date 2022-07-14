const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        title: { type: String, required: true, unique: true, minLength: 2 },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Category', categorySchema);
