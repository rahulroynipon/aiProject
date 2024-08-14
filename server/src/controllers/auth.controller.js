// auth.controller.js
import passport from 'passport';
import { ApiError, ApiResponse } from '../utils/utility.js';

const googleLoginHandler = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

const googleCallbackHandler = (req, res) => {
    passport.authenticate('google', (err, user) => {
        if (err || !user) {
            return res
                .status(401)
                .json(new ApiError(401, 'Authentication failed'));
        }

        // Generate JWT tokens here and send them in response
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        res.status(200)
            .cookie('accessToken', accessToken, COOKIE_OPTIONS)
            .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken },
                    'Login successful'
                )
            );
    })(req, res);
};

export { googleLoginHandler, googleCallbackHandler };
