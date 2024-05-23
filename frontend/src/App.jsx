import {Button } from "@chakra-ui/button"
import { Box, Container } from '@chakra-ui/react'
import {Routes, Route, Navigate, useLocation} from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"

import { useEffect, useState } from 'react';
import Logout from "./components/Logout"
import UpdateProfile from "./pages/UpdateProfile"
import CreatePost from "./components/createPost"
import ChatPage from "./pages/ChatPage"
import SettingsPage from "./pages/SettingsPage"

function App() {
  const user = useRecoilValue(userAtom);
 const {pathname}= useLocation();
  return (
    <Box position={'relative'} w={"full"}>
    <Container maxW={pathname === "/" ? {base:"620px",md:"900px"}:"620px"}>
      <Header />
      <Routes>
        <Route path='/' element={user ? <HomePage/> : <Navigate to="/auth" />} />
        <Route path='/auth' element={!user ? <AuthPage/> : <Navigate to='/' />} />
        <Route path='/updateprofile' element={user ? <UpdateProfile/> : <Navigate to='/auth' />} />
        <Route path="/:username" element={user?
          (<> <UserPage/> <CreatePost/>  </>)   : <Navigate to="/auth" />}/>
        <Route path="/:username/post/:pid" element={<PostPage/>} />
        <Route path="/chat" element={user ?<ChatPage/>: <Navigate to={'/auth'}/>} />
        <Route path="/settings" element={user ?<SettingsPage/>: <Navigate to={'/auth'}/>} />
      </Routes>
     
    </Container>
    </Box>
  );
}

export default App;


