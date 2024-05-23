import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Flex, Box, Text} from '@chakra-ui/layout'
import { Avatar } from '@chakra-ui/avatar'
import { Image } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
import { useState } from 'react'
import showToast from '../customtoasthook/showToast'
import { formatDistanceToNow } from "date-fns"
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import postAtom from '../atoms/postAtom'
const Post = ({post,userId}) => {
   
    const toast=showToast();
    const [posteddata,setPostedData]=useState();
    const navigate=useNavigate();
    const currentuser=useRecoilValue(userAtom);
    const [posts, setPosts]=useRecoilState(postAtom)
    useEffect(()=>{
        async function getuser(){
            try{
                const response=await fetch('/api/users/profile/' + userId);
                const data=await response.json();
                if(data.error){
                    toast('Error', data.error, 'error');
                    return;
                }
                    setPostedData(data);

            }catch(err){
                 toast('Error', err.message, 'error');
                 setPostedData({})
            }

        }
           getuser();
    },[userId, toast])
    if(!posteddata)
    return null;

    async function handledelete(e) {
        try {
          e.preventDefault();
          if (!window.confirm("Are you sure to delete your post")) return;
          if (!posteddata || !currentuser) {
            return;
          }
          const res = await fetch(`/api/posts/${post._id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.error) {
            return toast('Error', data.error, 'error');
          }
          toast('Success', "Your post deleted sucessfully", 'success');
          setPosts(posts.filter((p)=>p._id !== post._id))
         
        } catch (err) {
          console.log(err)
          toast('Error', err.message, 'error');
        }
      }
      

  return (
    <Link to={`/${posteddata?.username}/post/${post?._id}`}>
        <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar size={"md"} name='ponnana pavan' src={posteddata.profilePic}
            
            onClick={(e)=>{
                e.preventDefault();
                navigate(`/${posteddata.username}`)
            }}
            ></Avatar>
            <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
            <Box position={"relative"} w={"full"}>
                {post?.replies.length === 0 && <Text textAlign={"center"}>😒</Text>}
                {post?.replies[0] && (
                        <Avatar 
                        size={"xs"} 
                        name='ponnana pavan' 
                        src={post.replies[0].userProfilePic}
                        position={"absolute"} 
                        top={"0px"}
                        left={"15px"} 
                    
                        padding={"2px"}>
                     </Avatar>
                )}
              {post?.replies[1] &&(
                   <Avatar
                   size={"xs"}
                    name='ponnana pavan' 
                    src={post.replies[1].userProfilePic}
                    position={"absolute"} 
                    right={"-5px"} 
                    bottom={"0px"} 
                    padding={"2px"}/>
              )}
                
               {post?.replies[2] && (
                     <Avatar 
                     size={"xs"} 
                     name='ponnana pavan'
                     src={post.replies[2].userProfilePic}
                      position={"absolute"} 
                       left={"4px"}
                       bottom={"0px"} 
                        padding={"2px"}/>
               )}
            </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex  justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}  
            onClick={(e)=>{
                e.preventDefault();
                navigate(`/${posteddata?.username}`)
            }}>{posteddata?.username}</Text>
                <Image src='/verified.png' w={4} h={4} ml={1}></Image>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              
               <Text fontStyle={"sm"} color={"gray.light"} width={36} textAlign={"right"}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
           {currentuser?._id=== posteddata._id  && (
            <DeleteIcon size={20} onClick={handledelete}/>
           )}
            </Flex>
        </Flex>
        <Text fontSize={"sm"}>{post.text}</Text>
            <Box
               borderRadius={6}
               overflow={"hidden"}
               border={"1px solid white"}
               borderColor={"gray.light"}
            >
               <Image src={post.img} w={"full"} ></Image>
            </Box>
            <Flex gap={3} my={1}>
                <Actions post={post} />
            </Flex>

        </Flex>
        </Flex>
    </Link>
  )
}

export default Post



