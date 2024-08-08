import { User } from '../models/user.model.js';
import { COOKIE_OPTIONS, MAINTENANCE_DAY } from './../constants.js';
import jwt from 'jsonwebtoken';
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    sendOTP,
    generateOTP,
} from '../utils/utility.js';

// when user registers account manually
const registrationHandler = asyncHandler(async (req, res) => {
    const { email, fullname, batch, password, uniID } = req.body;

    if (
        [email, fullname, batch, password, uniID].some(
            (field) => field?.trim() === '' || !field
        )
    ) {
        throw new ApiError(400, 'All fields are required');
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isValid) {
            throw new ApiError(409, 'User with this email already exists');
        }

        const [otp, otpExpires] = generateOTP();

        const newUser = {
            email,
            fullname,
            batch,
            password,
            uniID,
            otp,
            otpExpires,
            isValid: false,
        };

        const createdUser = existingUser
            ? await User.findByIdAndUpdate(existingUser._id, newUser, {
                  new: true,
              })
            : await User.create(newUser);

        sendOTP(email, otp, 'registration');

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    createdUser,
                    'User created. Verify the OTP sent to your email.'
                )
            );
    } catch (error) {
        console.error('Error during user registration:', error);
        throw new ApiError(500, 'Server error while creating a user');
    }
});
const verifyOTPHandler = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, 'Email and OTP are required');
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (user.otp !== otp) {
            throw new ApiError(400, 'Invalid OTP');
        }

        if (user.otpExpires < Date.now()) {
            throw new ApiError(400, 'OTP has expired');
        }

        user.isValid = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new ApiResponse(200, null, 'OTP verified successfully'));
    } catch (error) {
        console.error('Error during OTP verification:', error);
        throw new ApiError(500, 'Server error during OTP verification');
    }
});

//when user login account manually
const loginHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === '' || !field)) {
        throw new ApiError(400, 'All fields are required');
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        if (!user.isValid) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const expires = new Date();
        expires.setDate(expires.getDate() + MAINTENANCE_DAY);

        user.refreshTokens.push({
            token: refreshToken,
            expires,
        });
        await user.save({ validateBeforeSave: false });

        const loggedInUser = await User.findOne({ email }).select(
            '-password -refreshTokens'
        );

        return res
            .status(200)
            .cookie('accessToken', accessToken, COOKIE_OPTIONS)
            .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            .json(new ApiResponse(200, loggedInUser, 'Login successful'));
    } catch (error) {
        console.error('Error during login:', error);
        throw new ApiError(500, 'Server error during login');
    }
});

//secure handler
//when user logout
const logoutHandler = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new ApiError(400, 'Refresh token not provided');
        }

        user.refreshTokens = user.refreshTokens.filter(
            (item) => item.Token !== refreshToken
        );
        await user.save({ validateBeforeSave: false });

        res.status(200)
            .clearCookie('accessToken', COOKIE_OPTIONS)
            .clearCookie('refreshToken', COOKIE_OPTIONS)
            .json(new ApiResponse(200, {}, 'User logged out successfully'));
    } catch (error) {
        throw new ApiError(
            500,
            error.message || 'Server site error while user logout'
        );
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, 'Unauthorized request');
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SCRECT
        );

        const user = await User.findById(decodedToken._id).select('-password');

        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const renewToken = user.generateAccessToken();

        res.status(200)
            .cookie('accessToken', renewToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    { accessToken: renewToken },
                    'Access token renewed successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Error renewing access token'
        );
    }
});

export {
    registrationHandler,
    verifyOTPHandler,
    loginHandler,
    logoutHandler,
    refreshAccessToken,
};
