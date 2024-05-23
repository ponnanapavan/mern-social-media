import React, { useState } from 'react'
import showToast from './showToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const UseFollowHook = (user) => {
    const currentUser=useRecoilValue(userAtom)
    const [following,setFollowing]=useState(user.followers.includes(currentUser._id));
    const [updating, setUpdating]=useState(false);
    const toast=showToast();

    const handleFollowing = async () => {
    
        if(!currentUser){
          toast('Error', "please login to follow", "error");
          return ;
        }
      
        try {
          const response = await fetch(`/api/users/follow/${user._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          if (data.error) {
            toast({
              title: 'Error',
              description: data.error,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          if (following) {
            user.followers = user.followers.filter(id => id !== currentUser?._id);
          } else {
            user.followers.push(currentUser?._id);
          }
          setFollowing(!following);
        } catch (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setUpdating(false);
        }
      };
  return {handleFollowing, updating, following }
}

export default UseFollowHook
