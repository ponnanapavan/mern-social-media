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
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import showToast from '../customtoasthook/showToast'
import userAtom from '../atoms/userAtom'

  export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const setAuthState=useSetRecoilState(authScreenAtom);//useSetRecoilState is a hook provided by Recoil that allows you to set the value of a Recoil atom
    const [logindata,setLoginData]=useState({
      username:"",
      password:""
    });
    const setData=useSetRecoilState(userAtom);
    const [loading,setLoading]=useState(false);
    async function handlelogin(){
      setLoading(true)
      try{

              const response=await fetch("/api/users/login",{
                method:"POST",
                headers:{
                  'Content-Type':'application/json'
                },
                body:JSON.stringify(logindata)
              })
              const data=await response.json();
            console.log(data);
            if(data.error){
              showToast('Error', data.error, 'error');
              return;
            }
           localStorage.setItem("user-data",JSON.stringify(data));
           setData(data);
      }catch(err){
        showToast('Error', err, 'error');
      }finally{
        setLoading(false);
      }
    }
    return (
      <Flex
      
        align={'center'}
        justify={'center'}
     >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Login
            </Heading>
           
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}
            w={{
                base:"full",
                sm:"400px",  
            }}
            >
            <Stack spacing={4}>
              <FormControl  isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text"  value={logindata.username}  onChange={(e)=>setLoginData({...logindata,username:e.target.value})}/>
              </FormControl>
              <FormControl  isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'}  value={logindata.password} onChange={(e)=>setLoginData({...logindata,password:e.target.value})} />
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
                  }} 
                  onClick={handlelogin}
                  isLoading={loading}
                  >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                 Don't have a account <Link color={'blue.400'} onClick={()=>setAuthState("signup")}>Sign Up</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }