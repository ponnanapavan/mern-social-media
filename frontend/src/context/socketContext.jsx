import {createContext, useContext, useEffect, useState} from 'react'
import { useRecoilValue } from 'recoil';
import io from 'socket.io-client'
import userAtom from '../atoms/userAtom';
const socketContext=createContext();

export const useSocket=()=>{
  return useContext(socketContext);
}
 const SocketContextProvider=({children})=>{
  const [socket,setSocket]=useState(null);
  const user=useRecoilValue(userAtom);
  const [onlineusers, setOnlineUsers]=useState([])
  useEffect(()=>{
       const socket=io("/",{//establish a websocket connection
        query:{
          userId:user?._id
        }
       })
        setSocket(socket);
        socket.on("getOnlineUsers", (users)=>{
          setOnlineUsers(users);
        })
        return ()=>socket && socket.close();// it close the socket components
  },[user?._id])
      return (
        <socketContext.Provider value={{socket, onlineusers}}>
            {children}
        </socketContext.Provider>
      )
}
export default SocketContextProvider;