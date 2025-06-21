import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dp from "../assets/dp.webp";

function SenderMessage({ image, message, time }) {
  const scroll = useRef();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  return (
    <div className="flex items-start gap-[10px]">
      <div ref={scroll} className='w-fit max-w-[500px] px-[20px] py-[10px] 
        bg-[rgb(23,151,194)] text-white text-[19px] 
        rounded-tr-none rounded-2xl relative right-0 ml-auto 
        shadow-gray-400 shadow-lg gap-[10px] flex flex-col'>
        {image && <img src={image} alt="" className='w-[150px] rounded-lg' />}
        {message && <span>{message}</span>}
        <span className="text-[12px] text-gray-100 text-right">
          {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-md'>
        <img src={userData.image || dp} alt="" className='h-[100%]' />
      </div>
    </div>
  );
}

export default SenderMessage;
