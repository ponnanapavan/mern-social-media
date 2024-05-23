import React, { useState } from 'react'
import {Flex, Avatar, Text, Divider} from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';
const Comment = ({reply}) => {
    const [like,setLike]=useState(false);
    console.log(reply)
  return (
    <>
    <Flex gap={4} py={"2"} my={"2"} w={"full"}>
    <Avatar src={reply.userProfilePic} size={"sm"}/>
    <Flex gap={1} w={"full"} flexDirection={"column"}>
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"sm"}>{reply.username}</Text>
          
        </Flex>
        <Text>{reply.text}</Text>
    </Flex>
    </Flex>
    <Divider/>
  
    </>
  )
}

export default Comment
