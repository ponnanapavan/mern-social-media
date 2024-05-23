import Conversation from "../models/Conversation.js";
import Message from "../models/MessageModel.js";
import { getRecipientsSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import {v2 as cloudinary} from 'cloudinary'
async function sendMessage(req,res){
    
    try{
          
          const {recipientId, message }=req.body;
          let {img}=req.body;
         
          const senderId=req.user._id;
          let conversation=await Conversation.findOne({
            participants:{$all:[senderId,recipientId]},
          })

              if(!conversation)// if the new conversation is start 
              {
                conversation=new Conversation({
                    participants:[senderId,recipientId],
                    lastMessage:{// it shows to user with latest message
                        text:message,
                        sender:senderId
                    }
                })
                     await conversation.save();
              }
                  
              if(img){
                const uploadImage=await cloudinary.uploader.upload(img);// uploading in cloudinary
    
                img=uploadImage.secure_url;
               }
                       
              const newMessage=new Message({
                conversationId:conversation._id,
                sender:senderId,
                text:message,
                img:img|| ""
              });

              await Promise.all([
               await  newMessage.save(),
                conversation.updateOne({// here i updating latest  message
                    lastMessage:{
                        text:message,
                        sender:senderId
                    }
                })
              ]);
              const recipientSocketId=getRecipientsSocketId(recipientId)
             
              if(recipientSocketId){//io.to(recipientSocketId).emit("newMessage", newMessage): If the recipient's socket ID exists, this line emits a "newMessage" event to that specific client identified by 
                io.to(recipientSocketId).emit("newMessage", newMessage)
              }
                  res.status(201).json(newMessage);          

    }catch(err){
        res.status(500).json({error:err.message})
    }

}



async function getMessages(req,res)
{
    
        const {otherUserId}=req.params;
        const UserId=req.user._id;
        try{
            const conversation=await Conversation.findOne({
                participants:{$all:[UserId,otherUserId]}
            })// first find the conversation between the two users

             if(!conversation){
                return res.status(400).json({error:"conversation is not found"})
             }

            const messages=await Message.find({
                conversationId:conversation._id
            }).sort({createdAt:1});// here we find the messages based up on the conversation Id
            res.status(201).json(messages);//  it is returing in array of objects
    }
    catch(err){
        res.status(500).json({error:err.message})
    }

}
async function getconversations(req,res){
    const userId=req.user._id;

    try{
           const conversation=await Conversation.find({participants:userId}).populate({path:"participants", select:"username profilePic"} )
            if(!conversation){
                return 
            }
           conversation.forEach(conversation=>{
            conversation.participants=conversation.participants.filter(participant=>participant._id.toString() !== userId.toString())// here i filtering  i,e i am removing current logged uer data 
           })
            res.status(201).json(conversation);
    }catch(err){
        res.status(500).json({error:err.message})

    }

}
export {sendMessage, getMessages, getconversations}