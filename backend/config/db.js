import mongoose from "mongoose";

const connectDb=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected!");
    }
    catch(e){
        console.log("DB connection error");
        console.log(e);
    }
}
export default connectDb;