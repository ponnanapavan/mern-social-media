import React from 'react'
import Signup from './Signup'
import Login from './Login'
import {  useRecoilValue} from 'recoil'
import authScreenAtom from '../atoms/authAtom'

const AuthPage = () => {
    const authScreenState=useRecoilValue(authScreenAtom);
  return (
   <>
   {authScreenState === "login" ? <Login/>: <Signup/>}
   </>
  )
}

export default AuthPage
