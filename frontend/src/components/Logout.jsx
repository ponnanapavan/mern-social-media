import React from 'react';
import { Button } from '@chakra-ui/button';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import showToast from '../customtoasthook/showToast';

const Logout = () => {
    const setUser = useSetRecoilState(userAtom);
    const usershowToast = showToast();

    async function handleLogout() {
        try {
            const response = await fetch("/api/users/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (data.error) {
                usershowToast("Error", data.error, "error");
            } else {
                localStorage.removeItem("user-data");
                setUser(null);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default Logout;
