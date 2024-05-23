import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Conversation from '../components/Conversation'
import {GiConversation} from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer'
import showToast from '../customtoasthook/showToast'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { chatAtom, selectConversation } from '../atoms/chatAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/socketContext'
const ChatPage = () => {
  const toast=showToast();
  const [loading, setLoading]=useState(true)
  const [conversations,setConversations]=useRecoilState(chatAtom)
  const [selectconversation,setSelectConversation]=useRecoilState(selectConversation)
  const [searchuser,setSearchUser]=useState("");
  const [searchloading,setSearchLoading]=useState(false);
  const currentUser=useRecoilValue(userAtom);
  const {socket,onlineusers}=useSocket()
  useEffect(()=>{
    async function getConversations(){
      try{
        const response=await fetch('/api/messages/conversations');
        const data=await response.json();
        if(data.error){
          toast('Error', data.error, 'error');
          return;

        }
            setConversations(data);//storing an conversations  in setConversations
      }catch(err){
        toast('Error', err.message, 'error')
      }finally{
        setLoading(false);
      }

    }
       getConversations();

  },[toast, setConversations])
  async function handleConversationSearch(e){
    e.preventDefault();
    setSearchLoading(true);
    try{
      const resposne=await fetch(`https://socialmedia-mern-backend-c1xh.onrender.com/api/users/profile/${searchuser}`);
      const data=await resposne.json();
     
      if(data.error){
        toast('Error', data.error, 'error')
      }

        if(data._id === currentUser._id){
          toast('Error', 'you cannot message yourself', 'error');
          return ;
        }

        if(conversations.find(conversation=>conversation.participants[0]._id === data._id)){// if already conversation is their
          setSelectConversation(
            {
            _id:conversations.find(conversation=>conversation.participants[0]._id === data._id)._id,
            userId:data._id,
            username:data.username,
            userProfilePic:data.profilePic,
          }
        )
            return;
        }
        
       const fakeconversation={// if the conversation is not their then also we trying to fetch data about user
        mock:true,
        lastMessage:{
          text:"",
          sender:""
        },
        _id:Date.now(),
        participants:[
          {
              _id:data._id,
              username:data.username,
              profilePic:data.profilePic
          }
        ]
       }
           setConversations((prevConvs)=>[...prevConvs, fakeconversation]) 

    }catch(err){
      toast('Error', err.message, 'error')
    }finally{
      setSearchLoading(false)
    }
  }
  return (
    <Box position={'absolute'} left={"50%"} transform={"translateX(-50%)"}  w={{lg:"750px", md:"80%", base:"100%"}} p={4}>
       <Flex gap={4} flexDirection={{base:'column', md:'row'}} maxW={{
        sm:"400px",
        md:"full"
       }} mx={"auto"}>
        <Flex flex={30} gap={2} flexDirection={'column'} maxW={{sm:"250px", md:"full"}}>
            <Text fontWeight={700} color={useColorModeValue("gray.600","gray.400")}></Text>
            <form onsubmit={handleConversationSearch}>
              <Flex alignItems={'center'} gap={2}>
                <Input placeholder={"search a user"} onChange={(e)=>setSearchUser(e.target.value)}/>
                <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchloading}><SearchIcon/></Button>
              </Flex>
            </form>
            {loading && (
                [0,1,2,3,4].map((_,i)=>(
                    <Flex key={i} gap={4} alignItems={"centre"} p={"1"} borderRadius={"md"}>
                      <Box>
                        <SkeletonCircle size={"10"}/>
                      </Box>
                      <Flex w={"full"} flexDirection={'column'} gap={3}>
                        <Skeleton h={"10px"} w={"80px"}/>
                         <Skeleton h={"8px"} w={"90%"}/>
                      </Flex>
                    </Flex>
                ))
            )}
{!loading && conversations ? (
  conversations.map((items) => (
    <Conversation
      key={items._id}
      isOnline={onlineusers.includes(items.participants[0]._id)}
      conversation={items}
    />
  ))
) : (
  <p>Loading conversations...</p>
)}
           
        </Flex>
        {!selectconversation._id  && (
        <Flex flex={70} borderRadius={"md"} p={2} flexDir={'column'} alignItems={'center'} justifyContent={'center'} height={'400px'}>
        <GiConversation size={100}/>
        <Text fontSize={20}>Start a conversation</Text>
        </Flex>
        )}
        {selectconversation._id &&    <MessageContainer/>
         }
          
        </Flex>
    </Box>
  )
}

export default ChatPage
