import { User } from '../models/user.model.js';
import {
    COOKIE_OPTIONS,
    OTP_TIME,
    PUBLIC_ITEM,
    RESET_TIME,
    TOKEN_TIME,
} from './../constants.js';
import jwt from 'jsonwebtoken';
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    sendOTP,
    generateOTP,
    uploadOnCloudinary,
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

    existingUser
        ? await User.findByIdAndUpdate(existingUser._id, newUser, {
              new: true,
          })
        : await User.create(newUser);

    sendOTP(email, code, 'registration', newUser);

    delete newUser.otp;
    delete newUser.password;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newUser,
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
    if (!user.isOTPcorrect(otp)) {
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
        .status(201)
        .json(new ApiResponse(201, null, 'OTP verified successfully'));
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

    const expire = new Date(Date.now() + TOKEN_TIME * 24 * 60 * 60 * 1000);

    user.refreshTokens.push({
        token: refreshToken,
        expire,
    });
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findOne({ email }).select(PUBLIC_ITEM);

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
        process.env.REFRESH_TOKEN_SECRET
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
        (item) => item.token !== refreshToken
    );
    await user.save({ validateBeforeSave: false });

    res.status(200)
        .clearCookie('accessToken', COOKIE_OPTIONS)
        .clearCookie('refreshToken', COOKIE_OPTIONS)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export {
    registrationHandler,
    verifyOTPHandler,
    loginHandler,
    refreshAccessToken,
    logoutHandler,
};
