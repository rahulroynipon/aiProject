import { Post } from '../models/post.model.js';
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    uploadOnCloudinary,
} from './../utils/utility.js';

const createPostHandler = asyncHandler(async (req, res) => {
    const { caption } = req.body;
    const mediaFiles = req.files;

    const media = await Promise.all(
        mediaFiles.map(async (file) => {
            const uploadedMedia = await uploadOnCloudinary(file.path);

            if (!uploadedMedia) {
                throw new ApiError(500, 'error while uploading media');
            }

            return {
                url: uploadedMedia.secure_url,
                type:
                    uploadedMedia.resource_type === 'video' ? 'video' : 'image',
            };
        })
    );

    const post = await Post.create({
        owner: req.user._id,
        caption,
        media,
    });

    if (!post) {
        throw new ApiError(500, 'server site error while creating the post');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, post, 'Post created successfully'));
});

export { createPostHandler };
