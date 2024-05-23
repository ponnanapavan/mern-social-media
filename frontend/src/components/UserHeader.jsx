import React, { useState } from 'react';
import { VStack, Box, Flex, Text, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useToast } from "@chakra-ui/toast";
import { Menu, MenuButton, MenuList, MenuItem, Portal } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as LinkRouter } from 'react-router-dom';
import UseFollowHook from '../customtoasthook/UseFollowHook';

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const toast = useToast();
  const {handleFollowing, updating, following }=UseFollowHook(user)
 

  const handleCopy = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: 'Link is copied.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  // const handleFollowing = async () => {

  //   if(!currentUser){
  //     toast('Error', "please login to follow", "error");
  //     return ;
  //   }
  //   setUpdate(true);
  //   try {
  //     const response = await fetch(`/api/users/follow/${user._id}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     const data = await response.json();
  //     if (data.error) {
  //       toast({
  //         title: 'Error',
  //         description: data.error,
  //         status: 'error',
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //       return;
  //     }
  //     if (following) {
  //       user.followers = user.followers.filter(id => id !== currentUser?._id);
  //     } else {
  //       user.followers.push(currentUser?._id);
  //     }
  //     setFollowing(!following);
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: error.message,
  //       status: 'error',
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     setUpdate(false);
  //   }
  // };

  return (
    <VStack gap={4} alignItems="start">
      <Flex justifyContent="space-between" w="full">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">{user.name}</Text>
          <Flex gap={2} alignItems="center">
            <Text fontSize="sm">{user.username}</Text>
            <Text fontSize={{ base: "xs", md: "sm", lg: "md" }} bg="gray.dark" color="gray.light" p={1} borderRadius="full">Threads.net</Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar name={user.name} src={user.profilePic} size={{ base: "md", md: "xl" }} />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser?._id === user._id && (
        <LinkRouter to='/updateprofile'>
          <Button size="sm">Update Profile</Button>
        </LinkRouter>
      )}
      {currentUser?._id !== user._id && (
        <Button size="sm"  onClick={handleFollowing} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
      )}
      <Flex w="full" justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Text color="gray.light">{user.followers.length} followers</Text>
          <Box w="1" h="1" bg="gray.light" borderRadius="full"></Box>
          <Text color="gray.light">instagram.com</Text>
        </Flex>
        <Flex>
          <Box className='icon-container'>
            <BsInstagram size={24} cursor="pointer" />
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton><CgMoreO size={24} cursor="pointer" /></MenuButton>
              <Portal>
                <MenuList bg="gray.dark">
                  <MenuItem bg="gray.dark" onClick={handleCopy}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w="full" justifyContent="space-between">
        <Flex flex={1} borderBottom="1.5px solid white" justifyContent="center" cursor="pointer" pb="3"><Text fontWeight="bold">Threads</Text></Flex>
        <Flex flex={1} borderBottom="1px solid gray" justifyContent="center" cursor="pointer" pb="3" color="gray.light"><Text fontWeight="bold">Replies</Text></Flex>
      </Flex>
    </VStack>
  );
}

export default UserHeader;
