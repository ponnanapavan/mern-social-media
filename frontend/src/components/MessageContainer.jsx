import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import showToast from '../customtoasthook/showToast'
import { chatAtom, selectConversation } from '../atoms/chatAtom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/socketContext'
import messageSound from '../assets/sounds/frontend_src_assets_sounds_message.mp3'
const MessageContainer = () => {
  const toast = showToast();
  const [selectconversation, setSelectConversation] = useRecoilState(selectConversation);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const messagesEndRef = useRef(null);
  const {socket}=useSocket();
  const setConversations=useSetRecoilState(chatAtom)

   useEffect(()=>{// this useeffect is for getting  messages by using socket server
   socket?.on("newMessage", (message)=>{
    if(selectconversation._id === message.conversationId)
    setMessages((prevMessages)=>[...prevMessages, message]);

    if(!document.hasFocus()){
      const sound=new Audio(messageSound)// this is for to generate sound
      sound.play();

    }
   

    setConversations((prevConversations)=>{
      const updatedConversations= prevConversations?.map(conversation=>{
     
          if(conversation._id === selectconversation._id){
            return {
              ...conversation,
              lastMessage:{
                text:message.text,
                sender:message.sender
              }
            }
          }
               return conversation;
      })
            return updatedConversations;
    })
   });
           return ()=>socket.off("newMessage")
   },[socket]);
  
   
   useEffect(()=>{// this useEffect is used for seen and unseen messages
    const lastMessageFromOtherUser=messages.length && messages[messages.length-1]?.sender !== currentUser._id;
    if(lastMessageFromOtherUser){
         socket.emit("markMessagesAsSeen", {
          conversationId:selectconversation._id,
          userId:selectconversation.userId,
         })
    }
        socket.on("messageSeen", ({conversationId})=>{
          if(selectconversation._id === conversationId){
               setMessages(prev => {
                const updatedMessages=prev.map(message=>{
                  if(!message.seen){
                    return{
                      ...message,
                       seen:true
                    }
                  }
                      return message
                })
                     return updatedMessages;
               })
          }
        })

   },[socket,currentUser._id, messages, selectconversation])

   
  const scrollToBottom = () => {
    if (messagesEndRef.current) 
      {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function getMessages() {
      try {
        if(selectconversation.mock)
        return ;
        const response = await fetch(`/api/messages/${selectconversation.userId}`);
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        toast('Error', err.message);
      } finally {
        setLoading(false);
      }
    }
    getMessages();
  }, [toast, selectconversation.userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Flex flex={70} bg={useColorModeValue("gray.400", "gray.dark")} borderRadius={"md"} flexDirection={'column'} p={1}>
      <Flex w={"full"} h={12} alignItems={'center'} gap={2}>
        <Avatar src={selectconversation.userProfilePic} size={'sm'} />
        <Text display={"flex"} alignItems={"center"}>{selectconversation.username}<Image src='/verified.png' w={4} h={4} ml={1}></Image></Text>
      </Flex>
      <Divider />

      <Flex flexDirection={"column"} gap={4} my={4} p={2} maxH={"400px"} overflowY={"scroll"}>
        {loading && (
          [...Array(5)].map((_, i) => (
            <Flex key={i} gap={2} alignItems={'center'} p={1} borderRadius={"md"} alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}>
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"9px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />

              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))
        )}
        {!loading && Array.isArray(messages) && (
          messages.map((message) => (
            <Message key={message._id} message={message} ownMessage={currentUser._id === message.sender} />
          ))
        )}
        {/* This empty div serves as a marker to scroll to */}
        <div ref={messagesEndRef} />
      </Flex>
      <MessageInput setMessages={setMessages} />  
    </Flex>
  );
};

export default MessageContainer;
