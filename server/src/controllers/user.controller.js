import { User } from '../models/user.model.js';
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

export { registrationHandler, verifyOTPHandler };
