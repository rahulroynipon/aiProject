import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
    {
        caption: {
            type: String,
        },
        media: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
