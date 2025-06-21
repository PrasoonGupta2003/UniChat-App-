import React, { useRef, useState, useEffect } from 'react';
import dp from "../assets/dp.webp";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

function Profile() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const image = useRef();

  const [name, setName] = useState("");
  const [frontendImage, setFrontendImage] = useState(dp);
  const [backendImage, setBackendImage] = useState(null);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setFrontendImage(userData.image || dp);
    }
  }, [userData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (e) {
      console.log("Error updating form", e);
    }
  };

  if (!userData) return <div className="text-center mt-20">Loading Profile...</div>;

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]'>
      <div className='cursor-pointer fixed top-[20px] left-[20px]' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack className="w-[50px] h-[50px] text-gray-600" />
      </div>

      <div className='bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-lg relative' onClick={() => image.current.click()}>
        <div className='w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center'>
          <img src={frontendImage} alt="Profile" className='h-[100%]' />
        </div>
        <div className='absolute bottom-4 text-gray-700 right-4 w-[35px] h-[35px] rounded-full bg-[#20c7ff] flex justify-center items-center'>
          <IoCameraOutline className='text-gray-700 w-[30px] h-[30px]' />
        </div>
      </div>

      <form className='w-95% max-w-[500px] flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>
        <input type="file" hidden accept='image/*' ref={image} onChange={handleImage} />

        <input
          type="text"
          placeholder='Enter your Name'
          className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-5 py-2 bg-white rounded-lg shadow-md text-[16px]"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="text"
          readOnly
          className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-5 py-2 bg-white rounded-lg shadow-md text-[16px] text-gray-400"
          value={userData?.userName || ""}
        />

        <input
          type="email"
          readOnly
          className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-5 py-2 bg-white rounded-lg shadow-md text-[16px] text-gray-400"
          value={userData?.email || ""}
        />

        <button className="w-[90%] py-3 bg-[#20c7ff] rounded-2xl shadow-md text-[18px] font-semibold text-white hover:shadow-inner transition-all disabled:opacity-50">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;

