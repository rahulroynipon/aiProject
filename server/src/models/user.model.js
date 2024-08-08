import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
            required: [
                function () {
                    return !this.googleID;
                },
                'university id is required',
            ],
        },
        uniID: {
            type: String,
            required: [
                function () {
                    return !this.googleID;
                },
                'university id is required',
            ],
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
            type: String,
            required: function () {
                return !this.googleID;
            },
        },
        otpExpires: {
            type: Date,
            required: function () {
                return !this.googleID;
            },
        },
        isValid: {
            type: Boolean,
            default: false,
        },
        refreshTokens: {
            type: [
                {
                    Token: String,
                    expires: Date,
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SCRECT,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
    );
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SCRECT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    );
};

export const User = mongoose.model('User', userSchema);
