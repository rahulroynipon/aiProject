import crypto from 'crypto'
import nodemailer from 'nodemailer'

const generateOTP = () => {
    const otp = crypto.randomBytes(3).toString('hex')
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000)
    return [otp, otpExpires]
}

const sendOTP = (email, otp, purpose) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    let subject, text

    if (purpose === 'registration') {
        subject = 'Your Registration OTP Code'
        text = `Dear User,

Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):

Your OTP code: ${otp}

This code is valid for 2 minutes. Please do not share this code with anyone.

If you did not request this code, please ignore this email.

Best regards,
Competitive Programming Camp City University,
(CPCCU)`
    } else if (purpose === 'reset') {
        subject = 'Your Password Reset OTP Code'
        text = `Dear User,

We received a request to reset your password. To proceed with the password reset, please use the following One-Time Password (OTP):

Your OTP code: ${otp}

This code is valid for 2 minutes. Please do not share this code with anyone.

If you did not request a password reset, please ignore this email.

Best regards,
Competitive Programming Camp City University,
(CPCCU)`
    } else {
        throw new Error('Invalid purpose specified for OTP email.')
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

export { generateOTP, sendOTP }
