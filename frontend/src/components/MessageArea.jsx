import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaRegImages } from "react-icons/fa6";
import { BsFillSendFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import useMessages from '../customHooks/useMessages';
import { addMessage, setMessages } from '../redux/messageSlice';
import Swal from 'sweetalert2';
import notificationSound from '../assets/Notifications.mp3'; // 🔊

function MessageArea() {
  useMessages();
  const { selectedUser, userData, socket } = useSelector(state => state.user);
  const { messages } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const imageRef = useRef();
  const bottomRef = useRef();
  const inputRef = useRef();
  const notificationRef = useRef(new Audio(notificationSound)); // 🔊

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id || (!input.trim() && !backendImage)) return;

    try {
      const formData = new FormData();
      if (input.trim()) formData.append("message", input.trim());
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      socket.emit("sendMessage", result.data);
      dispatch(addMessage(result.data));
      notificationRef.current.play(); // 🔊 play sound after send

      setInput("");
      setBackendImage(null);
      setFrontendImage(null);
    } catch (e) {
      console.error("❌ Error sending message:", e?.response?.data || e);
    }
  };

  const handleDeleteMessages = async () => {
    if (!selectedUser?._id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete all messages with this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${serverUrl}/api/message/delete/${selectedUser._id}`, {
        withCredentials: true
      });

      dispatch(setMessages([]));
      Swal.fire("Deleted!", "All messages have been deleted.", "success");
    } catch (err) {
      console.error("Error deleting messages", err?.response?.data || err);
      Swal.fire("Error!", "Failed to delete messages.", "error");
    }
  };

  // 🔊 Listen to socket messages
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      if (msg.sender === selectedUser?._id || msg.receiver === selectedUser?._id) {
        dispatch(addMessage(msg));
        notificationRef.current.play(); // 🔊 play on receive
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser, dispatch]);

  // ✅ Scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Scroll on message area open
  useEffect(() => {
    if (selectedUser) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // ensures DOM is rendered
    }
  }, [selectedUser]);

  // ✅ Focus input on open
  useEffect(() => {
    if (selectedUser) inputRef.current?.focus();
  }, [selectedUser]);

  return (
    <div className={`lg:w-[70%] ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300 relative flex-col`}>
      {selectedUser ? (
        <>
          <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px] gap-[20px]'>
            <div className='cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack className='w-[40px] h-[40px] text-white' />
            </div>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg'>
              <img src={selectedUser?.image || dp} alt="User" className='h-full w-full object-cover' />
            </div>
            <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.userName}</h1>
            <div className='ml-auto cursor-pointer' onClick={handleDeleteMessages}>
              <MdDelete className='w-[30px] h-[30px] text-white hover:text-red-500 transition' />
            </div>
          </div>

          {showPicker && (
            <div className="absolute bottom-[100px] left-1/4 transform -translate-x-1/2 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <div className='w-full h-[550px] flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px]'>
            {messages && messages.map((mess) =>
              mess.sender === userData._id
                ? <SenderMessage key={mess._id} image={mess.image} message={mess.message} time={mess.createdAt} />
                : <ReceiverMessage key={mess._id} image={mess.image} message={mess.message} time={mess.createdAt} />
            )}
            <div ref={bottomRef} />
          </div>

          <div className='absolute bottom-[60px] left-1/2 transform -translate-x-1/2 w-[95%] max-w-[800px] flex items-center justify-center'>
            {frontendImage && (
              <img src={frontendImage} alt="Preview" className='w-[80px] absolute bottom-[70px] right-[10%] rounded-lg shadow-gray-400 shadow-lg' />
            )}
            <form
              className='w-full h-[60px] bg-[#1797c2] rounded-full shadow-gray-400 shadow-lg flex items-center gap-[20px] px-[20px]'
              onSubmit={handleSendMessage}
            >
              <div onClick={() => setShowPicker(!showPicker)}>
                <RiEmojiStickerLine className='cursor-pointer w-[25px] h-[25px] text-white z-[1000]' />
              </div>
              <input type="file" accept='image/*' ref={imageRef} hidden onChange={handleImage} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className='w-full h-full px-[10px] outline-none border-0 text-[20px] text-white bg-transparent placeholder-white'
              />
              <div onClick={() => imageRef.current.click()}>
                <FaRegImages className='cursor-pointer w-[25px] h-[25px] text-white' />
              </div>
              {(input.length > 0 || backendImage) && (
                <button type="submit">
                  <BsFillSendFill className='cursor-pointer w-[25px] h-[25px] text-white' />
                </button>
              )}
            </form>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <img src="/logo.png" alt="UniChat Logo" className="w-[80px] h-[80px] object-contain" />
          <h1 className="text-[#1797c2] font-extrabold text-[38px]">UniChat</h1>
          <span className="text-gray-600 text-[16px] font-medium tracking-wide italic">
            Connect freely, chat globally.
          </span>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
