import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { LIMIT } from './constants.js';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        optionsSuccessStatus: 200,
    })
);
app.use(express.json({ limit: LIMIT }));
app.use(express.urlencoded({ extended: true, limit: LIMIT }));
app.use(express.static('public'));
app.use(cookieParser());

//routes
import userRouter from './routes/user.route.js';

app.use('/api/v1/users', userRouter);

export { app };
