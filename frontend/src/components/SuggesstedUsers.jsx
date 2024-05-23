import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SuggestedUser from './SuggestedUser';
import showToast from '../customtoasthook/showToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const SuggesstedUsers = () => {
    const [loading, setLoading] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([]); // Renamed state variable
    const toast = showToast();
    const currentUser=useRecoilValue(userAtom);
    useEffect(() => {
        const getSuggestUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users/suggested");
                const data = await res.json();
                if (data.error) {
                    toast('Error', data.error, "error");
                    return;
                }
                    console.log(data);
                setSuggestedUsers(data);
            } catch (err) {
                toast('Error', err.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getSuggestUsers();
    }, [showToast]);

    return (
        <>
            <Text mb={4} fontWeight={'bold'}>Suggested Users</Text>
            <Flex direction={'column'} gap={4}>
            {!loading && Array.isArray(suggestedUsers) ? (
    suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)
) : (
    <Text>No suggested users available</Text> // Display a message if suggestedUsers is not an array
)}

{loading && [0, 1, 2, 3, 4].map((_, idx) => (
    <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
        <Box>
            <SkeletonCircle size={"10"} />
        </Box>
        <Flex w={"full"} flexDirection={"column"} gap={2}>
            <Skeleton h={"8px"} w={"80px"} />
            <Skeleton h={"8px"} w={"90px"} />
        </Flex>
        <Flex>
            <Skeleton h={"20px"} w={"60px"} />
        </Flex>
    </Flex>
))}
            </Flex>
        </>
    );
};

export default SuggesstedUsers;
