import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { chatAtom, selectConversation } from '../atoms/chatAtom'
import userAtom from '../atoms/userAtom'
import { BsCheck2All } from 'react-icons/bs'

const Message = ({message , ownMessage }) => {
  const selectconversation=useRecoilValue(selectConversation);
  const user=useRecoilValue(userAtom);
  const [imgloaded,setImgLoaded]=useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text &&  (// if the message is their
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
            <Text color={"white"}>{message.text} </Text>
            <Box alignSelf={"flex-end"} ml={1} color={message.seen? "blue.500": ""} fontWeight={"bold"}>
              <BsCheck2All size={16}/>
            </Box>
            </Flex>
          )}
          {
             message.img && !imgloaded &&  (
              <Flex mt={5} w={"200px"}>
                <Image src={message.img} hidden onLoad={()=>setImgLoaded(true)} borderRadius={4}></Image>
                <Skeleton w={"200px"} h={"200px"}/>
              </Flex>
             )
          }
          {
              message.img && imgloaded && (
                <Flex mt={5} w={"200px"}>
                <Image src={message.img}  borderRadius={4}></Image>
                <Box alignSelf={"flex-end"} ml={1} color={message.seen? "blue.500": ""} fontWeight={"bold"}>
              <BsCheck2All size={16}/>
            </Box>
              </Flex> 
              )
          }
          <Avatar src={user.profilePic} size={'sm'} w={7} h={7}/>
        </Flex>
      ) : (// if the message is from other user
        <Flex gap={2}>
          <Avatar src={selectconversation.userProfilePic} size={'sm'} w={7} h={7}/>
        {message.text && (
            <Text
            maxW={"340px"}
            p={2}
            borderRadius={"lg"}
            bg={"gray.400"}
            color={"black"}
            boxShadow={"0px 1px 2px 0px rgba(0, 0, 0, 0.1)"}
          >
            {message.text}
          </Text>
        )}
        {
             message.img && (
              <Flex mt={5} w={"200px"}>
                <Image src={message.img} borderRadius={4}></Image>
              </Flex>
             )
          }
        
        </Flex>
      )}
    </>
  )
}

export default Message
