import { Router } from 'express';

import {
    forgottenPasswordHandler,
    getUserInfo,
    resetPasswordHandler,
    updateUserInfo,
    uploadORchangeIMG,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/Auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.route('/reset-link/:email').get(forgottenPasswordHandler);
router.route('/reset-password').patch(resetPasswordHandler);
//secure route
router.route('/user').get(verifyToken, getUserInfo);
router.route('/userInfo-update').patch(verifyToken, updateUserInfo);
router
    .route('/user/upload-image/:key')
    .patch(verifyToken, upload.single('image'), uploadORchangeIMG);

export default router;
