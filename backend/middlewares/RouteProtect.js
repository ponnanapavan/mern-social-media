import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js';
const protectRoute=async(req,res,next)=>{
    try{
          const token=req.cookies.jwttoken;// in this we reteriving cookies from request
          if(!token)
          return res.status(401).json({message:"unauthorized user"});
         const decodejwt=jwt.verify(token,process.env.JWT_SECRET);// it will give payload
        const user=await User.findById(decodejwt.userId).select("-password")// it will return remove password
        console.log(user)
        req.user=user;
        next();
    }catch(err){
        res.status(500).json({message:err.mesaage});
    }
}
export default protectRoute