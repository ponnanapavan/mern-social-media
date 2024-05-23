import { Avatar, AvatarBadge, Flex, Image, Stack, Text, WrapItem, useColorModeValue, useColorMode, Box } from '@chakra-ui/react'

import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All, BsFillImageFill } from 'react-icons/bs';
import { selectConversation } from '../atoms/chatAtom';

const Conversation = ({ isOnline,conversation}) => {
   const user=conversation.participants[0];
   const currentUser=useRecoilValue(userAtom)
   const lastMessage=conversation.lastMessage;
   const [selectconversation,setSelectConversation]=useRecoilState(selectConversation)
    const colorMode=useColorMode();
   
  return (
    <Flex gap={4} alignItems={"center"} p={"1"} _hover={{cursor:"pointer", bg:useColorModeValue("gray.600","gray.dark"), color:"white"} } borderRadius={"md"}
     onClick={()=>setSelectConversation({
      _id:conversation._id,
      userId:user._id,
       username:user.username,
       userProfilePic:user.profilePic,
       mock:conversation.mock
     })}
     bg={selectconversation?._id === conversation._id? (colorMode === "light" ?"gray.600": "gray.dark" ): ""}
     >
     <WrapItem>
        <Avatar size={{base:"xs", sm:"sm", ms:"md" ,lg:"md"}} src={user.profilePic}>
       {isOnline ?  <AvatarBadge boxSize={"1em"} bg={"green.500"}>
     </AvatarBadge>: ""}
        </Avatar>
     </WrapItem>
     
     <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={700} display={"flex"} alignItems={'center'}>
            {user.username} <Image src="/verified.png" w={4} h={4} ml={1}></Image>
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
         {currentUser._id === lastMessage.sender ? (
          <Box color={lastMessage.seen? "blue.400": ""}>
          <BsCheck2All size={16}/>
          </Box>
         ) : ""}
           {lastMessage.text.length> 18 ? lastMessage.text.substring(0,18)+ "..." : lastMessage.text || <BsFillImageFill size={20}/>}
        </Text>

     </Stack >
     
    </Flex>
  )
}

export default Conversation
