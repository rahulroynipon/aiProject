import { User } from '../models/user.model.js';
import { ApiError, ApiResponse } from '../utils/utility.js';

const googleSignInHandler = async (req, res) => {
    try {
        const googleUser = req.googleUser;
        let user = await User.findOne({ googleID: googleUser.googleID });

        if (!user) {
            return res
                .status(404)
                .json(
                    new ApiError(404, 'User not found. Please sign up first.')
                );
        }

        // Generate JWT tokens and send them in the response
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        res.status(200)
            .cookie('accessToken', accessToken, COOKIE_OPTIONS)
            .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken },
                    'Sign in successful'
                )
            );
    } catch (err) {
        res.status(500).json(new ApiError(500, 'Internal Server Error'));
    }
};

const googleSignUpHandler = async (req, res) => {
    try {
        const googleUser = req.googleUser;
        let user = await User.findOne({ googleID: googleUser.googleID });

        if (user) {
            return res
                .status(409)
                .json(
                    new ApiError(409, 'User already exists. Please sign in.')
                );
        }

        user = new User({
            googleID: googleUser.googleID,
            fullname: googleUser.fullname,
            email: googleUser.email,
            avatar: googleUser.avatar,
        });

        await user.save();

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        res.status(201)
            .cookie('accessToken', accessToken, COOKIE_OPTIONS)
            .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    201,
                    { user, accessToken, refreshToken },
                    'Sign up successful'
                )
            );
    } catch (err) {
        res.status(500).json(new ApiError(500, 'Internal Server Error'));
    }
};

export { googleSignInHandler, googleSignUpHandler };
