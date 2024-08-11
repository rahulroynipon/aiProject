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
        reaction: {
            type: String,
            enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
            required: true,
        },
    },
    { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
