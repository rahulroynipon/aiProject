import { Router } from 'express';

import {
    loginHandler,
    registrationHandler,
    verifyOTPHandler,
} from './../controllers/user.controller.js';

const router = Router();

//manually register and login
router.route('/register').post(registrationHandler);
router.route('/verify_registration').post(verifyOTPHandler);
router.route('/login').post(loginHandler);

export default router;
