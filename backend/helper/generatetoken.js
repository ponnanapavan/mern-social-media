import jwt from 'jsonwebtoken'
const generatetoken=(userId,res)=>{
  const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:'15d'
  })
     res.cookie("jwttoken",token,{
        httpOnly:true,
        maxAge:15 *24 *60 *60 * 100,// this seams to this cookie expires in 15 days
        sameSite:"strict"
     })
          return token;
}
export default generatetoken;