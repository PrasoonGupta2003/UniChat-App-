import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage=async(req,res) => {
    try{
        let sender=req.userId;
        let {receiver}=req.params;
        let message = req.body.message;
        console.log("Incoming message:", message);

        if (!message && !req.file) {
            return res.status(400).json({ message: "Message text or image is required." });
        }
        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path);
        }
        let conversation =await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        });

        let newMessage=await Message.create({
            sender,receiver,message,image

        });
        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender,receiver],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage);
            await conversation.save();
        }

        const receiverSocketId=getReceiverSocketId(receiver);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        return res.status(201).json(newMessage);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({message:"Message can't be send error"});
    }
}

export const getMessages=async(req,res) => {
    try{
        let sender=req.userId;
        let {receiver}=req.params;
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages");
        if(!conversation){
            return res.status(400).json({message:"Message not found"})
        }

        return res.status(200).json(conversation?.messages);
    }
    catch(e){
        console.log(e);
    }
}
export const deleteMessages = async (req, res) => {
  const { receiver } = req.params;
  const sender = req.userId; // ✅ Use req.userId set by middleware

  try {
    await Message.deleteMany({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    await Conversation.findOneAndDelete({
      participants: { $all: [sender, receiver] },
    });

    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete messages", error: err.message });
  }
};
