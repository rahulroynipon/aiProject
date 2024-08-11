import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        postID: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
