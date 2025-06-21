import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
const uploadOnCloudinary=async (filePath)=>{
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
    })
    try{
        const uploadResult=await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath);
        return uploadResult.secure_url;
    }catch(e){
        fs.unlinkSync(filePath);
        console.log("Cloudinary Error",e);
    }
}
export default uploadOnCloudinary;