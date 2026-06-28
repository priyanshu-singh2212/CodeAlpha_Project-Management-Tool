// models/comment.model.js

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
{
    content: {
        type: String,
        required: true,
        trim: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("Comment", commentSchema);