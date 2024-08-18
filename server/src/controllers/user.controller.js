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

const getUserInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select(PUBLIC_ITEM);

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'User data get successfully'));
});

//reset user password
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
        throw new ApiError(404, 'User is not found');
    }

    const token = user.generatePasswordToken();

    const [otp, code] = generateOTP(RESET_TIME);
    const data = {
        fullname: user.fullname,
        token: token,
        code: code,
    };

    sendOTP(email.trim(), code, 'reset', data);

    user.resetOTP = otp;
    await user.save();
    return res
        .status(200)
        .json(new ApiResponse(200, null, ' Reset link sent successfully!'));
});

const resetPasswordHandler = asyncHandler(async (req, res) => {
    const { code, token, password } = req.body;

    const decodedToken = jwt.verify(token, process.env.PASSWORD_TOKEN_SECRET);

    if (!decodedToken) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (!user.isresetOTPcorrect(code)) {
        throw new ApiError(401, 'invaild OTP');
    }

    if (user.isresetOTPExpired()) {
        throw new ApiError(401, 'expired OTP');
    }

    user.password = password;
    user.resetOTP = {};
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Password successfully reset'));
});

//update user information
const updateUserInfo = asyncHandler(async (req, res) => {
    const { fullname, batch, uniID, socialLinks } = req.body;

    if (
        [fullname, batch, uniID].some((field) => !field || field.trim() === '')
    ) {
        throw new ApiError(400, 'All fields are required');
    }

    // Update user information
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { fullname, batch, uniID, socialLinks },
        { new: true }
    ).select(PUBLIC_ITEM);

    if (!user) {
        throw new ApiError(500, 'Server error while updating the user info');
    }

    // Return success response
    return res
        .status(200)
        .json(new ApiResponse(200, user, 'User info is updated successfully'));
});

//upload or update avatar and coverImage
const uploadORchangeIMG = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, 'Image file is missing');
    }

    const Image = await uploadOnCloudinary(imageLocalPath);

    if (!Image.url) {
        throw new ApiError(400, 'Error while uploading on coverImage');
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                [key]: Image.url,
            },
        },
        {
            new: true,
        }
    ).select(PUBLIC_ITEM);

    if (!user) {
        throw new ApiError(500, `server site error while uploading the ${key}`);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, `${key} is uploaded successfully`));
});

export {
    getUserInfo,
    forgottenPasswordHandler,
    resetPasswordHandler,
    updateUserInfo,
    uploadORchangeIMG,
};
