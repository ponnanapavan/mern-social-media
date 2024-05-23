import React from 'react'
import { Link } from 'react-router-dom'
import {Flex, Box, Text} from '@chakra-ui/layout'
import { Avatar } from '@chakra-ui/avatar'
import { Image } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
import { useState } from 'react'
const UserPost = () => {
    const [like,setLike]=useState(false);
  return (
    <Link to={'/ponnanapavan/post/1'}>
        <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar size={"md"} name='ponnana pavan' src='/pavanprofile.jpg'></Avatar>
            <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
            <Box position={"relative"} w={"full"}>
                <Avatar 
                size={"xs"} 
                name='ponnana pavan' 
                src='https://bit.ly/dan-abramov'
                position={"absolute"} 
                top={"0px"}
                left={"15px"} 
            
                padding={"2px"}>
             </Avatar>
                <Avatar
                 size={"xs"}
                  name='ponnana pavan' 
                  src='https://bit.ly/code-beast' 
                  position={"absolute"} 
                  right={"-5px"} 
                  bottom={"0px"} 
                  padding={"2px"}/>
                <Avatar 
                size={"xs"} 
                name='ponnana pavan'
                src='https://bit.ly/sage-adebayo'
                 position={"absolute"} 
                  left={"4px"}
                  bottom={"0px"} 
                   padding={"2px"}/>
            </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex  justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
                <Text>Ponnana Pavan</Text>
                <Image src='/verified.png' w={4} h={4} ml={1}></Image>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
                <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                <BsThreeDots/>
            </Flex>
        </Flex>
        <Text fontSize={"sm"}>This is my first post</Text>
            <Box
               borderRadius={6}
               overflow={"hidden"}
               border={"1px solid white"}
               borderColor={"gray.light"}
            >
               <Image src='/pavanprofile.jpg' w={"full"} ></Image>
            </Box>
            <Flex gap={3} my={1}>
                <Actions liked={like} setLiked={setLike}/>
            </Flex>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize={"sml"}>102 replies</Text>
                <Box w={0.5} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
                <Text color={"gray.light"} fontSize={"sml"}>200 likes</Text>
            </Flex>
        </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost
