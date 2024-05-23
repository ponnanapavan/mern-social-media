import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import showToast from './showToast';
import { useState } from 'react';
const GetUserProfile = () => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const {username}=useParams();
    const toast=showToast();
    useEffect(()=>{
        async function getData() {
            try 
            {
              const response = await fetch(`/api/users/profile/${username}`);// here i am tring to get  a particular user data;
              const data = await response.json();
              if (data.error) {
                toast("Error", data.error, "error");
                return;
              } 
                  if(data.isFrozen){
                    setUser(null)
                    return ;
                  }
                setUser(data);
            } 
            catch (err) {
              toast("Error", err, "error");
            }finally{
              setLoading(false);
            }
          }
                getData();
    },[username, toast])
  return {loading,user };
}

export default GetUserProfile
