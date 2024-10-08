import { ApiError, asyncHandler } from '../utils/utility.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { COOKIE_OPTIONS } from '../constants.js';

const verifyToken = asyncHandler(async (req, res, next) => {
    const accessToken =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
        throw new ApiError(401, 'Unauthorized request');
    }

    try {
<<<<<<< HEAD
        // Verify the access token
        const verifiedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
=======
        const Token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');
>>>>>>> 7a6c11d8aa51212c43914995b5451fcdc55dc0d4

        // Fetch the user associated with the token
        const existedUser = await User.findById(verifiedToken._id).select(
            '-password -refreshTokens'
        );

        if (!existedUser || !existedUser.isValid) {
            throw new ApiError(401, 'Unauthorized request');
        }

        req.user = existedUser;
        return next();
    } catch (error) {
        // Log the error for debugging
        console.error('Token verification error:', error);

        // Handle token expiration
        if (error.name === 'TokenExpiredError') {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new ApiError(401, 'Unauthorized request');
            }

            try {
                // Verify the refresh token
                const verifiedRefreshToken = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                );

                // Find the user and check the refresh token
                const user = await User.findById(
                    verifiedRefreshToken._id
                ).select('-password');

                if (
                    !user ||
                    !user.refreshTokens.some(
                        (rt) =>
                            rt.token === refreshToken && rt.expire > Date.now()
                    )
                ) {
                    throw new ApiError(401, 'Invalid refresh token');
                }

                // Generate a new access token
                const newAccessToken = user.generateAccessToken();

                // Set the new access token in the cookie
                res.cookie('accessToken', newAccessToken, COOKIE_OPTIONS);
                req.user = user;
                return next();
            } catch (refreshTokenError) {
                console.error(
                    'Error verifying refresh token:',
                    refreshTokenError.message
                );
                throw new ApiError(401, 'Invalid refresh token');
            }
        }

        // For other errors, throw a generic unauthorized error
        throw new ApiError(401, error.message || 'Unauthorized request');
    }
});

export { verifyToken };
