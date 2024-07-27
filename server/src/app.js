import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { LIMIT } from './constants.js'
import { generateOTP, sendOTP } from './utils/sentOtp.util.js'

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        optionsSuccessStatus: 200,
    })
)
app.use(express.json({ limit: LIMIT }))
app.use(express.urlencoded({ extended: true, limit: LIMIT }))
app.use(express.static('public'))
app.use(cookieParser())

app.get('/otp', (req, res) => {
    const otp = generateOTP()
    sendOTP('mdsiaofficial@gmail.com', otp, 'reset')
    res.status(200).send('ok')
})

export { app }
