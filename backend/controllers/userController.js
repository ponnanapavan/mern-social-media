import mongoose from "mongoose";
import generatetoken from "../helper/generatetoken.js";
import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'
const signupUser=async(req,res)=>{
try{
      const {name,email,username,password}=req.body;
       const user=await User.findOne({$or:[{email},{username}]});
       if(user){
        return res.status(400).json({error:"user already exists"})
       }
       const salt=await bcrypt.genSalt(10);
       const hashPassword=await bcrypt.hash(password,salt);
       const newUser=new User({
        name,
        email,
        username,
        password:hashPassword
       })
       await newUser.save();
       if(newUser){
        generatetoken(newUser._id, res);
        res.status(201).json({
            _id:newUser._id,
            name:newUser.name,
            email:newUser.email,
            username:newUser.username,
            bio:newUser.bio,
            profilePic:newUser.profilePic
        })
       }else{
          res.status(400).json({error:"invalid user data"});
       }
}catch(err){
    res.status(500).json({error:err.message})
    console.log(err.message);
}
}


const loginUser=async(req,res)=>{
    try{
          
            const {username, password}=req.body; 
           
            const user=await User.findOne({username});
            const userpassword=await bcrypt.compare(password,user?.password || "");
            if(!user || !userpassword){
               return  res.status(400).json({error:"validate your details"})
            }
               if(user.isFrozen){
                user.isFrozen=false;
                await user.save();
               }
           
              generatetoken(user._id,res);  
              res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                username:user.username,
                bio:user.bio,
                profilePic:user.profilePic
            })
    }catch(err){
       return  res.status(500).json({error:"login failed"});
        console.log(err);
    }

}
const logoutUser=async(req,res)=>{
     try{
             res.cookie("jwttoken" ,'', {maxAge:1})
             res.status(200).json({message:"User logged out suucessfuly"})
     }catch(err){
        res.status(500).json({error:err.message});
     }
}


const followUnFollowUser=async(req,res)=>{
     try{
            const {id}=req.params;// this id  is  of particular user
            const userModify=await User.findById(id);
            const currentUser=await User.findById(req.user._id);// it will check whteher curent user is logged in 

            if(id=== req.user._id.toString()) return res.status(400).json({message:"you cannot follow or unfollow yoursekf"});
            if(!userModify || !currentUser)
            return res.status(400).json({error:"user not found"});
            
            const isFollow=currentUser.following.includes(id);// here i am checking that whether i following that user
            if(isFollow){
                   
                     await User.findByIdAndUpdate(id, {$pull: {followers:req.user._id}});// removind  current user name in follwers list in other people
                     await User.findByIdAndUpdate(req.user._id, {$pull: {following:id}});//This function is removing the specified id from the following array of the user document whose ID matches req.user._id.
                     res.status(200).json({message:"user unfollowed succesfully"})
            }else{
                await User.findByIdAndUpdate(id, {$push: {followers:req.user._id}});// removind  current user name in follwers list in other people   
                await User.findByIdAndUpdate(req.user._id, {$push: {following:id}});//This function is removing the specified id from the following array of the user document whose ID matches req.user._id.
              
                res.status(200).json({message:"user followed succesfully"})      
            }

     }catch(err){
        res.status(500).json({error:err.message})
     }
}

// this route is used to update the  user profile
const updateUser=async(req,res)=>{
   
    const {name,email,username,password,bio}=req.body;
 
    let {profilePic}=req.body;
    const userId=req.user._id;
   try{
          let user=await User.findById(userId);
          if(!user)
          return res.status(400).json({message:"user not found"});
        if(req.params.id !== userId.toString()) return res.status(400).json({message:"you can't update other user profiles"})
          if(password){
            const salt= await bcrypt.genSalt(10);
            const hashpassword=await bcrypt.hash(password,salt);
            user.password=hashpassword
          }
          //again i updating user previous data
          if(profilePic){
                if(user.profilePic){
                    await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0])// delete the old picture from cloudinary
                }
                const uploadImage=await cloudinary.uploader.upload(profilePic);// uploading in cloudinary

                profilePic=uploadImage.secure_url;
          }
          user.name=name||user.name;
          user.email=email||user.email;
          user.username=username||user.username;
          user.profilePic=profilePic||user.profilePic;
          user.bio=bio||user.bio;
          user=await user.save();
          
          await Post.updateMany(//This is a method used to update multiple documents in a MongoDB collection that match a certain criteria.
            {"replies.userId":userId},//selecting which document to update based up on userId
            {
              $set:{
                "replies.$[reply].username":user.username,
                "replies.$[reply].userProfilePic":user.profilePic
              }
            },
            {arrayFilters:[{"reply.userId":userId}]}// This is an option used with the update operation to specify conditions for updating nested arrays. Here, it's saying that we only want to update elements in the "replies" array where the "userId" field of the nested object matches a specific value (userId).
          )

          user.password=null;
          res.status(200).json(user);
       

   }catch(err){
    res.status(500).json({error:err.message})
   }
}


const userGetProfile=async(req,res)=>{
    const {query}=req.params;
    try{
              let user;
              if(mongoose.Types.ObjectId.isValid(query)){// it will check whether id is valid or not
                user=await User.findOne({_id:query}).select("-password")
              }else{
                user=await User.findOne({username:query}).select("-password").select("-updatedAt")
              }
            if(!user)   return res.status(400).json({message:"user not found"});
            res.status(200).json(user);
    }catch(err){
        res.status(500).json({error:err.message})
    }
}
const getData=async(req,res)=>{
	try {
		const userId = req.user._id;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
  }


  async function getUserSuggestion(req,res){
    try{
          const userId=req.user._id;
          const userFollowing=await User.findById(userId).select("following")// selecting following array of user
          const users=await User.aggregate([
            {
              $match:{
                _id:{$ne:userId},
              },
            },
            {
              $sample:{size:10}
            }
          ])
         const filterUsers=users.filter(user=> !userFollowing.following.includes(user._id));
         const suggestedUsers=filterUsers.slice(0,4);
         suggestedUsers.forEach(user=>user.password = null);
         res.status(200).json(suggestedUsers);
          
    }catch(err){
      res.status(500).json({ error: err.message });
    }

  }

  async function FreezeAccount(req,res){
    try{
           const user=await User.findById(req.user._id);
           if(!user){
            return res.status(404).json({ error: "User not found" });
           }
              user.isFrozen=true;
              await user.save();
              res.status(200).json({success:true})


    }catch(err){
      res.status(500).json({ error: err.message });

    }

  }
export {signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, userGetProfile, getData, getUserSuggestion, FreezeAccount}