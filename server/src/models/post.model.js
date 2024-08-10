import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
