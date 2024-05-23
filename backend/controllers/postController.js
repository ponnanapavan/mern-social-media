import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import {v2 as cloudinary} from 'cloudinary'
const createPost=async(req,res)=>{
  
     try{
           const {postedBy,text}=req.body;
           let {img}=req.body;
           if(!postedBy ||!text)
           return res.status(400).json({error:"please fill all the fields"});
          const user=await User.findById(postedBy);
          if(!user)
          return res.status(400).json({error:"user not found"});

        if(user._id.toString()!==req.user._id.toString()){
            return res.status(400).json({error:"you not unauthorized"});
        }
           const maxpostLength=1000;
           if(text.lenght>maxpostLength){
            return res.status(400).json({error:"text must less than or equal to 1000 characters"})
           }

           if(img){
            const uploadImage=await cloudinary.uploader.upload(img);// uploading in cloudinary

            img=uploadImage.secure_url;
           }
             const newPost=new Post({
                postedBy,
                text,
                img
             })
                await newPost.save();
                res.status(200).json( newPost)
     }catch(err){
        res.status(500).json({error:err.message})
     }
}

const getPost=async(req,res)=>{// this route is used to return particular post depending up on id
     try{
            const post=await Post.findById(req.params.postId)

            if(!post){
                res.status(400).json({message:"post not found"})
            }
                 res.status(200).json(post);
     }catch(err){
        res.status(500).json({message:err.message})
     }
}

const deletePost=async(req,res)=>{
    try{
           const {id}=req.params;
           const userpost=await Post.findById(id);
         if(!userpost)
         return res.status(400).json({message:"post not found"})
         if(userpost.postedBy.toString()!==req.user._id.toString())
         return res.status(400).json({message:"unauthorized to delete post"});
       if(userpost.img){
         const imgID=userpost.img.split("/").pop().split(".")[0];
         await cloudinary.uploader.destroy(imgID)
       }
        await Post.findByIdAndDelete(id);
        res.status(200).json({message:"message delete sucessfully"});
    }catch(err){

        res.status(500).json({error:err.message})
    }
}

const postLikedUnliked=async(req,res)=>{
  try{
       const {id:postId}=req.params;
       const userId=req.user._id;

       const post=await Post.findById(postId);
       if(!post){
        return res.status(400).json({message:"post is not found"})
       }
       if(userId.toString() === post.postedBy.toString()){
        return res.status(400).json({error:"we not able like out ownPost"})
       }

       const likedPost=post.likes.includes(userId);
       if(likedPost){
          await Post.updateOne({_id:postId}, {$pull:{likes:userId}});
          res.status(200).json({message:"post unliked"})
       }else{
           post.likes.push(userId);
           await post.save();
           res.status(200).json({message:"post liked"})
       }

  }catch(err){
    res.status(500).json({message:err.message})
  }
}


const replyToPost=async(req,res)=>{
   try{
           
            const {text}=req.body;
          
            const postId=req.params.id;
            const userId=req.user._id;
            const  userProfilePic=req.user.profilePic;
        
            const username=req.user.username;
            if(!text)
            return res.status(400).json({message:"text is not be empty"})
           const post=await Post.findById(postId);// this is used to find the post
           if(!post)
           return res.status(400).json({message:"post is not empty"})
        const reply={userId,text,userProfilePic,username};// here userIdis  used to track which user give reply  and also it is objectId of usermodel 
        post.replies.push(reply);
        await post.save();
      
       
       res.status(200).json(reply);

   }catch(err){
        res.status(500).json({error:err.message});
   }


}


const getFeedPosts = async (req, res) => {
  console.log("jbvfvfeh")
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
};

const getUserPosts=async(req,res)=>{
   const {username}=req.params;

     try{
         const user=await User.findOne({username});
         if(!user){
           return  res.status(500).json({error:err.message}); ;
         }
         const posts=await Post.find({postedBy:user._id}).sort({createdAt:-1});
         res.status(200).json(posts)

     }catch(err){
      res.status(500).json({error:'user not found'});
     }
     

}
 
export {createPost, getPost, deletePost, postLikedUnliked, replyToPost, getFeedPosts,getUserPosts}