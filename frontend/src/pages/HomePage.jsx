import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import showToast from '../customtoasthook/showToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import Post from '../components/Post';
import postAtom from '../atoms/postAtom';
import SuggesstedUsers from '../components/SuggesstedUsers';

const HomePage = () => {
  const showtoast = showToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postAtom);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch('/api/users/getuser');
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={'flex-start'}>
     <Box flex={70}>
     {!loading && posts.length === 0 && (
        <h1>Follow some users to see their posts</h1>
      )}
      {loading && (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      )}
      {Array.isArray(posts) &&
        posts.map((item) => (
          <Post key={item._id} post={item} userId={item.postedBy} />
        ))}
     </Box>
     <Box flex={30} display={{
        base:'none',
        md:"block"

     }}>
     <SuggesstedUsers/>
     </Box>
    </Flex>
  );
};

export default HomePage;
