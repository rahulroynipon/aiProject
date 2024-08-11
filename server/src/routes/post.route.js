import { Router } from 'express';
import { verifyToken } from '../middlewares/Auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createPostHandler } from '../controllers/post.controller.js';

const router = Router();

router
    .route('/create')
    .post(verifyToken, upload.array('media', 20), createPostHandler);

export default router;
