import {Server} from 'socket.io'
import express from 'express'
import http from 'http'
import Message from '../models/MessageModel.js';
const app=express();

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:["GET","POST"]
    }
});

export const getRecipientsSocketId=(recipientId)=>{
    return userSocketMap[recipientId];
}
const userSocketMap={};// empty hashmap
io.on('connection', (socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId != 'undefined'){
        userSocketMap[userId]=socket.id;
    }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));//io.emit is used to send the messages to all the clients
      socket.on("markMessagesAsSeen", async({conversationId,userId})=>{// it will listen the requests from clients
        try{
            await Message.updateMany({conversationId:conversationId, seen:false}, {$set:{seen:true}});
          
            io.to(userSocketMap[userId]).emit("messageSeen",{conversationId})// here io.to identifies a particular room based on the socketid and for that user we send the message 
        }catch(err){
            console.log(err);
        }
      })
    socket.on("disconnect", ()=>{//if the connection is disconnected
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


export {io, server, app};//io.on('connection', (socket) => { ... }): This line sets up an event listener for the 'connection' event. Whenever a client establishes a connection with the Socket.IO server, this callback function will be executed. The socket parameter represents the individual socket/connection that has been established with the client.