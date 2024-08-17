import { Router } from 'express';

import {
    loginHandler,
    logoutHandler,
    refreshAccessToken,
    registrationHandler,
    verifyOTPHandler,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/Auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

//manually register and login
router.route('/register').post(registrationHandler);
router.route('/verify-registration').post(verifyOTPHandler);
router.route('/login').post(upload.none(), loginHandler);
router.route('/refresh-token').get(refreshAccessToken);
router.route('/logout').get(verifyToken, logoutHandler);

export default router;
