import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

import connectDb from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import  userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import { app, server } from './socket/socket.js';
import job from './corn/cron.js';

dotenv.config();

connectDb();
job.start();


app.use(cors());

const __dirname=path.resolve();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(express.json({limit:"60mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url);
    console.log('Cookies:', req.cookies);
    next();
});


app.use('/api/users', userRoutes)
app.use('/api/posts',postRoutes )
app.use('/api/messages',messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*",(req,res)=>
    {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })

}


server.listen(5000, () => console.log("Server running on port", 5000)); 