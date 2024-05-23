import React from 'react'
import {Flex, Image, useColorMode, Button} from '@chakra-ui/react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import {AiFillHome} from 'react-icons/ai'
import {RxAvatar} from 'react-icons/rx'
import { Link } from 'react-router-dom';
import useLogoutHook from '../customtoasthook/useLogoutHook';
import authScreenAtom from '../atoms/authAtom';
import { BsFillChatFill, BsFillChatQuoteFill } from 'react-icons/bs';
import {MdOutlineSettings} from 'react-icons/md'
const Header = () => {
    const {colorMode, toggleColorMode}=useColorMode();
    const user=useRecoilValue(userAtom);
    const logout=useLogoutHook();
    const  setAuthAcreen=useSetRecoilState(authScreenAtom)
  return (
    <Flex justifyContent={"space-between"}  mt={6} mb="12" >
      {user && (
        <Link to={"/"}>
        <AiFillHome size={24}/>
        </Link>
      )}
       {!user && (
        <Link to={'/auth'} onClick={()=>setAuthAcreen('login')}>
        Login
        </Link>
      )}
    <Image cursor={"pointer"} alt='logo'
        src={colorMode==="dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
        w={6}
    >
    </Image>
    
    {user && (
      <Flex  alignItems={'center'} gap={4}>
        <Link to={`/${user.username}`}>
        <RxAvatar size={24}/>
        </Link>
        <Link to={'/chat'}>
        <BsFillChatQuoteFill size={24}/>
        </Link>
         <Link to={'/settings'}>
         <MdOutlineSettings size={24}/>
         </Link>
        <Button  size={"xs"} onClick={logout} >
            Logout
        </Button>
        </Flex>
      )}
       {!user && (
        <Link  to={'/auth'} onClick={()=>setAuthAcreen('signup')}>
        signup
        </Link>
      )}

    </Flex>
  )
}

export default Header
