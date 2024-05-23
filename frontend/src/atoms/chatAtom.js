import { atom } from "recoil";

export const chatAtom=atom({
    key:'chatAtom',
    default:[],
})

export const selectConversation=atom({
    key:'selectconversation',
    default:
   {
        _id:"",
        userId:"",
        username:"",
        userProfilePic:"",
    },
})