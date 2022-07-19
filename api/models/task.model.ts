import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
    {
        title: { type: String, required: true, minLength: 2, maxLength: 100 },
        description: { type: String, maxLength: 300 },
        date: { type: Date },
        status: {
            type: String,
            enum: ['toDo', 'inProgress', 'done'],
            default: 'toDo',
            required: true
        },
        category: { type: String },
        userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
