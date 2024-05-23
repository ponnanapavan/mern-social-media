import React, { useEffect, useState } from 'react'
import {Flex, Avatar, Text, Image, Box, Divider, Button, Spinner} from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import GetUserProfile from '../customtoasthook/GetUserProfile'
import showToast from '../customtoasthook/showToast'
import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon } from '@chakra-ui/icons'
import { formatDistanceToNow } from "date-fns"
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postAtom from '../atoms/postAtom'
const PostPage = () => {
  const {loading,user}=GetUserProfile();// it will return user profile 
  const [posts,setPosts]=useRecoilState(postAtom)
  const toast=showToast();
  const {pid}=useParams();// it is used to return the data of the post
  const currentuser=useRecoilValue(userAtom);
  const navigate=useNavigate();
  const currentPost=posts[0];


  useEffect(()=>{
    const userPost=async()=>{
       try{
              const response=await fetch(`/api/posts/${pid}`);
              const data=await response.json();
              if(data.error){
                toast('Error', data.error, 'error')

              }
                setPosts([data]);//because my atom is in array from 
       }catch(err){
        toast('Error', err.message, 'error')
       }
    }
         userPost();
  },[toast, pid, setPosts])
  async function handledelete() {
    try {
      if (!window.confirm("Are you sure to delete your post")) return;
      if (!user || !currentuser) {
        return;
      }
      const res = await fetch(`https://socialmedia-mern-backend-c1xh.onrender.com/api/posts/${currentPost._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.error) {
        return toast('Error', data.error, 'error');
      }
      toast('Success', "Your post deleted sucessfully", 'success');
      navigate(`/${user.username}`)
    } catch (err) {
      toast('Error', err.message, 'error');
    }
  }

  if(!user && loading)
  {
      return (
        <Flex justifyContent={'center'}>
          <Spinner size={"xl"}/>
        </Flex>
      )
  }
    if(!currentPost){
      return null; // if the post is not there then we immediately return null
    }


  return (
   <>
   <Flex>
   <Flex w={"full"} alignItems={"center"} gap={3}>
   <Avatar src={user.profilePic} size={"md"} name='pavan'/>
   <Flex>
    <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
    <Image src='/verified.png' w={'4'} h={'4'} ml={4}/>
   </Flex>
   </Flex>
   <Flex gap={4} alignItems={"center"}>
              
               <Text fontStyle={"sm"} color={"gray.light"} width={36} textAlign={"right"}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>
           {currentuser?._id === user._id  && (
            <DeleteIcon size={20} onClick={handledelete}/>
           )}
            </Flex>
   </Flex>
   <Text my={3}>{currentPost.text}</Text>
   
   {currentPost.img && (
    <Box
    borderRadius={6}
    overflow={"hidden"}
    border={"1px solid white"}
    borderColor={"gray.light"}
 >
    <Image src={currentPost.img} w={"full"} h={500} ></Image>
</Box>
   )}
    <Flex gap={3} my={3} >
    <Actions post={currentPost}/>
    </Flex>
    <Divider my={4}/>

    <Flex justifyContent={"space-between"}>
      <Flex gap={2} alignItems={"center"}>
      <Text fontSize={"2xl"}>👋</Text>
      <Text color={"gray.light"}>Get the app to like, reply and post</Text>
      </Flex>
      <Button>
        Get
      </Button>

    </Flex>
    <Divider my={4}/>
    {currentPost.replies.map((items)=>
    (
          <Comment key={items._id} reply={items}/>
    )
    )}
   </>
  )
}

export default PostPage
