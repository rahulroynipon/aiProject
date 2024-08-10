import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OTP_TIME, RESET_TIME } from '../constants.js';

const generateOTP = (time) => {
    const code = crypto.randomBytes(3).toString('hex');
    const expires = new Date(Date.now() + time * 60 * 1000);
    const otp = {
        code: code,
        expires: expires,
    };
    return [otp, code];
};

const sendOTP = (email, otp, purpose, data = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let subject, text;

    if (purpose === 'registration') {
        subject = 'Your Registration OTP Code';
        text = `Dear ${data.fullname},

Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):

Your OTP code: ${otp}

Dears code is valid for ${OTP_TIME} minutes. Please do not share this code with anyone.

If you did not request this code, please ignore this email.

Best regards,
Competitive Programming Camp City University,
(CPCCU)
`;
    } else if (purpose === 'reset') {
        subject = 'Your Password Reset OTP Code';
        text = `Dear ${data.fullname},

We received a request to reset your password. To proceed, please click the link below to set a new password for your account:

link: ${data.code}/${data.token}

This link will direct you to a secure page where you can enter and confirm your new password. The link is valid for ${RESET_TIME} minutes, so please use it as soon as possible.

Best regards,
Competitive Programming Camp City University,
(CPCCU)`;
    } else {
        throw new Error('Invalid purpose specified for OTP email.');
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export { generateOTP, sendOTP };
