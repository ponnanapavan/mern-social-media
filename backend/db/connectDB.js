import mongoose from 'mongoose'

async function connectDb(){
    try{
            const conn=await mongoose.connect(process.env.MONGO_URI).then(()=>console.log("database is connected"))
           
    }catch(err){
        console.error(err); 
        process.exit(1);

    }   

}   
export default connectDb   