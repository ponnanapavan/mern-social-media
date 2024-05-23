import React, { useState } from 'react'
import showToast from './showToast';

const previewImg = () => {
    const [imageurl,setImageUrl]=useState(null);
    const handleImage=(e)=>
    {
       
        const file = e.target.files[0];
         if(file && file.type.startsWith("image/"))
         {
           
            const reader=new FileReader();
            reader.onloadend=()=>{
                setImageUrl(reader.result);
            }
                reader.readAsDataURL(file);
         }
    } 
        return {handleImage, imageurl, setImageUrl};
}

export default previewImg
