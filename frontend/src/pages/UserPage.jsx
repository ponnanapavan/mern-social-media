import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router-dom';
import showToast from '../customtoasthook/showToast';
import {Flex, Spinner} from '@chakra-ui/react'
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postAtom from '../atoms/postAtom';
import GetUserProfile from '../customtoasthook/GetUserProfile';

const UserPage = () => {
  const {user, loading}=GetUserProfile();
  const { username } = useParams();
  const toast = showToast();
  const [posts,setPosts]=useRecoilState(postAtom)// it will state and setter function
  const [ftechloading,setFetchLoading]=useState(true)

  useEffect(() => {
    // async function getData() {
    //   try {
    //     const response = await fetch(`/api/users/profile/${username}`);// here i am tring to get  a particular user data;
    //     const data = await response.json();
    //     if (data.error) {
    //       toast("Error", data.error, "error");
    //       return ;
    //     } else {
    //       setUser(data);
    //     }
    //   } catch (err) {
    //     toast("Error", err, "error");
    //   }finally{
    //     setLoading(false);
    //   }
    // }

      async function getUser(){
        if(!user){
         return;
        }
        setFetchLoading(true)
        try{
          const response=await fetch(`/api/posts/users/${username}`);
          const data=await response.json();
          setPosts(data);
        }catch(err){
          toast('Error', err.message ,'error');
          setPosts([]);
        }finally{
          setFetchLoading(false);
        }

      }
    // getData();
    getUser();
  }, [username, toast, setPosts,user ]);
  
  if(!user && loading){
    return (
     <Flex justifyContent={"center"}>
      <Spinner size={"xl"}/>
     </Flex>
    )
  }
  if(!user && !loading){
    return <h1>User not found</h1>
  }

  return (
    <>
      {user ? (
        <UserHeader user={user} />
      ) : (
        <div>Loading...</div>
      )}
      {!ftechloading && posts.length===0 && <h1>Till now you not posted any posts </h1>}
      {ftechloading &&(
        <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"}/>
        </Flex>
      )}
           
           {posts?.map((items)=>(
		<Post key={items._id} post={items} userId={items.postedBy}/>
	  ))}
	 
    </>
  );
};

export default UserPage;

