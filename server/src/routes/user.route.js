import { Router } from 'express';

import {
    registrationHandler,
    verifyOTPHandler,
} from './../controllers/user.controller.js';

const router = Router();

router.route('/register').post(registrationHandler);
router.route('/verify_registration').post(verifyOTPHandler);

export default router;
