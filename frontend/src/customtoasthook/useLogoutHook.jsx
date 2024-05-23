import React from 'react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import showToast from './showToast';

const useLogoutHook = () => {
    const setUser=useSetRecoilState(userAtom);
    const toast=showToast();
    async function handleLogout() 
    {
        try {
            const response = await fetch("/api/users/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (data.error) {
                toast("Error", data.error, "error");
            } else {
                localStorage.removeItem("user-data");
                
                setUser(null);
            }
        } catch (err) {
            console.error(err);
        }
    }
          return handleLogout;
       
}

export default useLogoutHook
