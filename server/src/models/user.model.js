import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MAINTENANCE_DAY } from '../constants.js';

const roleSchema = new Schema(
    {
        role: {
            type: String,
            enum: ['admin', 'moderator', 'mentor', 'member'],
            required: true,
        },
        position: {
            type: Number,
            required: true,
        },
        positionName: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const refreshTokenSchema = new Schema({
    token: {
        type: String,
        unique: true,
    },
    expires: Date,
});

const userSchema = new Schema(
    {
        googleID: {
            type: String,
            unique: true,
            sparse: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        avatar: {
            type: String,
        },
        coverImage: {
            type: String,
        },
        batch: {
            type: String,
            validate: {
                validator: function () {
                    return !this.googleID;
                },
                message: 'Batch is required for non-Google users',
            },
        },
        uniID: {
            type: String,
            validate: {
                validator: function () {
                    return !this.googleID;
                },
                message: 'University ID is required for non-Google users',
            },
        },
        password: {
            type: String,
            required: function () {
                return !this.googleID;
            },
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        socialLinks: {
            type: [String],
            default: [],
        },
        roles: {
            type: roleSchema,
            default: { role: 'member', position: 0, positionName: 'member' },
        },
        otp: {
            code: String,
            expires: Date,
        },
        isValid: {
            type: Boolean,
            default: false,
        },
        refreshTokens: {
            type: [refreshTokenSchema],
            default: [],
        },
    },
    { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('refreshTokens')) return next();
    this.refreshTokens = await this.refreshTokens.filter(
        (token) => token.expires > Date.now()
    );
    next();
});

// Method to check password correctness
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// verify otp
userSchema.methods.verifyOTP = function (inputOTP) {
    if (this.otp && this.otp.code === inputOTP) {
        return true;
    }
    return false;
};

// otp validatetion time
userSchema.methods.isOTPExpired = function () {
    if (!this.otp || !this.otp.expires || this.otp.expires <= Date.now()) {
        return true;
    }
    return false;
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET, // Use a different secret for refresh token
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
};

userSchema.methods.generatePasswordToken = function () {
    return jwt.sign({ _id: this._id }, process.env.PASSWORD_TOKEN_SECRET, {
        expiresIn: process.env.PASSWORD_TOKEN_EXPIRE,
    });
};

// Expire users who haven't validated their accounts after one month
userSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: MAINTENANCE_DAY * 24 * 60 * 60,
        partialFilterExpression: { isValid: false },
    }
);

export const User = mongoose.model('User', userSchema);
