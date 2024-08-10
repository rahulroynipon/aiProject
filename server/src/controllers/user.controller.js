import { User } from '../models/user.model.js';
import {
    COOKIE_OPTIONS,
    MAINTENANCE_DAY,
    OTP_TIME,
    RESET_TIME,
} from './../constants.js';
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

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isValid) {
        throw new ApiError(409, 'User with this email already exists');
    }

    const [otp, code] = generateOTP(OTP_TIME);

    const newUser = {
        email,
        fullname,
        batch,
        password,
        uniID,
        otp,
        isValid: false,
    };

    const createdUser = existingUser
        ? await User.findByIdAndUpdate(existingUser._id, newUser, {
              new: true,
          })
        : await User.create(newUser);

    sendOTP(email, code, 'registration', newUser);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdUser,
                'User created. Verify the OTP sent to your email.'
            )
        );
});

const verifyOTPHandler = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, 'Email and OTP are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Check OTP validity and expiration
    if (!user.verifyOTP(otp)) {
        throw new ApiError(401, 'Invalid OTP');
    }

    if (user.isOTPExpired()) {
        throw new ApiError(419, 'OTP has expired');
    }

    // Update user to set OTP as verified
    user.isValid = true;
    user.otp = {}; // Clear OTP field
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, null, 'OTP verified successfully'));

    // try {

    // } catch (error) {
    //     console.error('Error during OTP verification:', error);
    //     throw new ApiError(500, 'Server error during OTP verification');
    // }
});

//when user login account manually
const loginHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === '' || !field)) {
        throw new ApiError(400, 'All fields are required');
    }

    const user = await User.findOne({ email });

    if (!user || !user.isValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
});

const refreshAccessToken = asyncHandler(async (req, res) => {
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
});

//secure handler
//when user logout
const logoutHandler = asyncHandler(async (req, res) => {
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
});

const getUserInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select(
        'fullname email avatar coverImage batch uniID socialLinks roles'
    );

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'User data get successfully'));
});

//update user information
const forgottenPasswordHandler = asyncHandler(async (req, res) => {
    const { email } = req.params;
    console.log(email);

    if (!email || email.trim() === '') {
        throw new ApiError(400, 'Email is required');
    }

    const user = await User.findOne({
        email,
        isValid: true,
    });

    if (!user) {
        throw new ApiError(401, 'User is not found');
    }

    const token = user.generatePasswordToken();

    const [otp, code] = generateOTP(RESET_TIME);
    const data = {
        fullname: user.fullname,
        token: token,
        code: code,
    };

    sendOTP(email.trim(), code, 'reset', data);

    user.otp = otp;
    await user.save();
    return res
        .status(200)
        .json(
            new ApiResponse(200, code, ' Verify the OTP sent to your email.')
        );
});

export {
    registrationHandler,
    verifyOTPHandler,
    loginHandler,
    logoutHandler,
    refreshAccessToken,
    getUserInfo,
    forgottenPasswordHandler,
};
