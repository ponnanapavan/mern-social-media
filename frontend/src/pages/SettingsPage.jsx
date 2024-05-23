import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import showToast from '../customtoasthook/showToast'
import useLogoutHook from '../customtoasthook/useLogoutHook';

const SettingsPage = () => {
    const toast=showToast();
    const logout=useLogoutHook();
    async function freezeAccount(){
        try{
               if(!window.confirm("Are you want to freeze your account"))
                return ;
               const response=await fetch('/api/users/freeze',{
                method:'PUT',
                headers:{"Content-Type":'application/json'}
               })
                   const data=await response.json();
                   if(data.error){
                    toast('Error', data.error, 'error');
                    return ;
                   }
                       if(data.success){
                        await logout();
                        toast('Success', "your account has been freezed", 'success');
                       }

        }catch(err){
            toast('Error', err.message, 'error');
          
        }
    }
  return (
   <>
   <Text my={1} fontWeight={"bold"}>
    Freeze Your Account
   </Text>
   <Text>You can unfreeze your account anytime by logging in </Text>
   <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>Freeze</Button>
   </>
  )
}

export default SettingsPage
