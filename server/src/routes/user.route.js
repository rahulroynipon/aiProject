import { Router } from 'express';

import {
    forgottenPasswordHandler,
    getUserInfo,
    loginHandler,
    logoutHandler,
    refreshAccessToken,
    registrationHandler,
    resetPasswordHandler,
    updateUserInfo,
    uploadORchangeIMG,
    verifyOTPHandler,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/Auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
    googleCallbackHandler,
    googleLoginHandler,
} from '../controllers/auth.controller.js';

const router = Router();

//manually register and login
router.route('/register').post(registrationHandler);
router.route('/verify-registration').post(verifyOTPHandler);
router.route('/login').post(upload.none(), loginHandler);
router.route('/refresh-token').get(refreshAccessToken);
router.route('/reset-link/:email').get(forgottenPasswordHandler);
router.route('/reset-password').patch(resetPasswordHandler);

//secure route
router.route('/logout').get(verifyToken, logoutHandler);
router.route('/user').get(verifyToken, getUserInfo);
router.route('/userInfo-update').patch(verifyToken, updateUserInfo);
router
    .route('/user/upload-image/:key')
    .patch(verifyToken, upload.single('image'), uploadORchangeIMG);

//user with goggle
router.route('/auth/google').post(googleLoginHandler);
router.route('/auth/google/callback').post(googleCallbackHandler);

export default router;
