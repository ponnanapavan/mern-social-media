import React, { useRef, useState } from 'react'
import {CloseButton,Image,Flex,Input, Button,Textarea,Text, FormControl, useColorModeValue, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalFooter, ModalBody} from '@chakra-ui/react'
import {AddIcon} from '@chakra-ui/icons'
import previewImg from '../customtoasthook/previewImg'
import { BsFillImageFill } from 'react-icons/bs'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import showToast from '../customtoasthook/showToast'
import postAtom from '../atoms/postAtom'
import { useParams } from 'react-router-dom'
const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [post, setPost]=useState(null);
    const fileRef=useRef(null);
    const { handleImage, imageurl, setImageUrl } = previewImg();
    const [reamaningChar,setReamaningChar]=useState(1000);
    const MAX_CHAR=1000;
    const currentUser=useRecoilValue(userAtom);// it will give the current user data
    const toast=showToast();  
    const [uploading,setUploading]=useState(false);
    const [posts, setPosts]=useRecoilState(postAtom);
    const {username}=useParams()
    function handlepost(e)
    {
        const data=e.target.value;
        if(data.length>MAX_CHAR)
        {
            const reduce=data.slice(0,MAX_CHAR);
            setPost(reduce);
            setReamaningChar(0);
        }else 
        {
                setPost(data);
                  setReamaningChar(MAX_CHAR-data.length)
        }
    }
    async function hanedleCreatePost(){
        setUploading(true);
       try{
        const response=await fetch("/api/posts/create",{
            method:'POST',
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify({postedBy:currentUser._id, text:post,  img:imageurl })
        })
           const data=await response.json();
           if(data.error){
                 toast('Error', data.error, 'error')
                 return;
           }
              toast("Success", "Post created successfully", "success");
              if(username === currentUser.username){
                setPosts([data, ...posts]);
              }
              onClose();
              setImageUrl('');
              setPost('');

       }catch(err){
        toast('Error', err, 'error');

       }finally{
        setUploading(false);
       }
    }
  return (
   <>
       <Button position={'fixed'} bottom={10} right={10} leftIcon={<AddIcon/>}
       bg={useColorModeValue('gray.300', "gray.dark")}
        onClick={onOpen}
        size={{base: "sm", sm:"lg"}}
       >
             Post 
       </Button>
       <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <FormControl>
             <Textarea placeholder='Post content here' onChange={handlepost} value={post}/>
             <Text fontSize={"xs"} fontWeight={'bold'} textAlign={'right'} m={"1"} color={'gray.800'}>
                   {reamaningChar}/1000
             </Text>
             <Input type='file' hidden ref={fileRef} onChange={handleImage}/>
             <BsFillImageFill style={{marginLeft:"5px", cursor:"pointer"}}  size={16} onClick={()=>fileRef.current.click()} />
          </FormControl>
           {imageurl && (
            <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imageurl}/>
                <CloseButton onClick={()=>setImageUrl(null)} bg="gray.800" position={"absolute"} top={2} right={2}/>
            </Flex>
           )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={hanedleCreatePost} isLoading={uploading}>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default CreatePost
