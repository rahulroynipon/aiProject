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
    verifyOTPHandler,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/Auth.middleware.js';

const router = Router();

//manually register and login
router.route('/register').post(registrationHandler);
router.route('/verify-registration').post(verifyOTPHandler);
router.route('/login').post(loginHandler);
router.route('/refresh-token').get(refreshAccessToken);
router.route('/reset-link/:email').get(forgottenPasswordHandler);
router.route('/reset-password').patch(resetPasswordHandler);

//secure route
router.route('/logout').get(verifyToken, logoutHandler);
router.route('/user').get(verifyToken, getUserInfo);
router.route('/userInfo-update').patch(verifyToken, updateUserInfo);

export default router;
