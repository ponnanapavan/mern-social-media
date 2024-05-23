import React, { useCallback } from 'react'
import {useToast} from '@chakra-ui/toast'
const showToast = () => {
   const toast=useToast();
  const showToast=useCallback(
    (title,description,status)=> {
    toast
    ({
        title: title,
        description: description,
        status:status,
        duration: 5000,
        isClosable:true,
    })
     
  },[toast])
      return showToast
}

export default showToast
