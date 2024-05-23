import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import authScreenAtom from '../atoms/authAtom';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthState = useSetRecoilState(authScreenAtom);
  const setData=useSetRecoilState(userAtom);

  const toast = useToast();
  const [userdata, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  async function handlesignup() {
    try {
    

      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userdata)
      })
      const data = await response.json();

      if (data.error) 
      {
        toast({
          title: "Signup Error",
          description: "There was an error during signup. Please try again later.",
          status: "error",
          duration: 5000
        });
        return;
      }
      toast({
        title: "Signup Success",
        description: "Your signup was successful!",
        status: "success",
        duration: 3000
      });
      localStorage.setItem("user-data", JSON.stringify(data));
      setData(data);
     
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" onChange={(e) => setUserData({ ...userdata, name: e.target.value })}
                    value={userdata.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" onChange={(e) => setUserData({ ...userdata, username: e.target.value })}
                    value={userdata.username} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setUserData({ ...userdata, email: e.target.value })}
                value={userdata.email} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setUserData({ ...userdata, password: e.target.value })}
                  value={userdata.password} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800")
                }} onClick={handlesignup}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} onClick={() => setAuthState("login")}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
