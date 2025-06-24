import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { FaGlobe, FaVideo } from "react-icons/fa"; // 🌐 ChatBox + 📹 UniMeet icons
import { BsHeartFill } from "react-icons/bs"; // ❤️ LifeLink Icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import dp from "../assets/dp.webp";
import { serverUrl } from '../main';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout from UniChat?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#20c7ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      background: '#f8faff',
    });

    if (result.isConfirmed) {
      try {
        await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
        dispatch(setUserData(null));
        dispatch(setOtherUsers([]));
        navigate("/login");

        Swal.fire({
          title: 'Logged Out',
          text: 'You have been logged out successfully.',
          icon: 'success',
          confirmButtonColor: '#20c7ff',
        });
      } catch (err) {
        Swal.fire({
          title: 'Oops!',
          text: 'Something went wrong. Try again.',
          icon: 'error',
          confirmButtonColor: '#20c7ff',
        });
      }
    }
  };

  const handleSearch = async () => {
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }
    try {
      const res = await axios.get(`${serverUrl}/api/user/search?query=${encodeURIComponent(input)}`, {
        withCredentials: true,
      });
      dispatch(setSearchData(res.data));
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    if (input) handleSearch();
  }, [input]);

  return (
    <div className={`relative lg:w-[30%] w-full h-full lg:block bg-slate-200 ${!selectedUser ? "block" : "hidden"} overflow-hidden`}>

      {/* 🔵 HEADER */}
      <div className='w-full bg-[#20c7ff] rounded-b-[15%] shadow-gray-400 shadow-lg px-[20px] pt-5 pb-4 flex flex-col gap-4'>
        {/* Title and greeting */}
        <div>
          <h1 className='text-white font-bold text-[25px]'>UniChat</h1>
          <div className='w-full flex justify-between items-center mt-1'>
            <h1 className='text-gray-800 font-bold text-[22px] truncate'>Hii ,{userData?.userName}</h1>
            <div
              className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-md cursor-pointer'
              onClick={() => navigate("/profile")}
            >
              <img src={userData.image || dp} alt="" className='h-full w-full object-cover' />
            </div>
          </div>
        </div>

        {/* Search & ChatBox + LifeLink Icons */}
        <div className='relative z-20 w-full flex items-center gap-4'>
          {search ? (
            <div className='relative w-full'>
              <form className='w-full h-[50px] bg-white shadow-md flex items-center gap-3 rounded-full px-4'>
                <IoIosSearch className='w-[22px] h-[22px]' />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full h-full text-[16px] outline-none border-0 bg-transparent"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <RxCross2
                  className="w-[22px] h-[22px] cursor-pointer"
                  onClick={() => {
                    setSearch(false);
                    setInput("");
                    dispatch(setSearchData([]));
                  }}
                />
              </form>

              {/* 🔽 Search Result Dropdown */}
              {input.length > 0 && searchData?.length > 0 && (
                <div className='absolute top-[60px] left-0 w-full max-h-[250px] overflow-y-auto bg-white rounded-xl shadow-2xl z-50 flex flex-col gap-2 p-2'>
                  {searchData.map((user) => (
                    <div
                      key={user._id}
                      className='flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-blue-100 border shadow-sm'
                      onClick={() => dispatch(setSelectedUser(user))}
                    >
                      <div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
                        <img src={user.image || dp} alt="user" className='w-full h-full object-cover' />
                      </div>
                      <div>
                        <h1 className='text-gray-900 font-semibold'>{user.name || user.userName}</h1>
                        <p className='text-sm text-gray-500'>@{user.userName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              {/* 🔍 Search Icon */}
              <div
                className='w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer'
                onClick={() => setSearch(true)}
              >
                <IoIosSearch className='w-[22px] h-[22px]' />
              </div>

              {/* 🌐 ChatBox */}
              <div
                className='w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer'
                title="Go to ChatBox"
                onClick={() => window.location.href = "https://chatbox-mongodb-expressjs-dz1y.onrender.com"}
              >
                <FaGlobe className='w-[22px] h-[22px] text-blue-500' />
              </div>

              {/* 📹 UniMeet */}
              <div
                className='w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer'
                title="Go to UniMeet"
                onClick={() => window.location.href = "https://unimeet-vwm9.onrender.com"}
              >
                <FaVideo className='w-[22px] h-[22px] text-indigo-500' />
              </div>

              {/* ❤️ LifeLink */}
              <div
                className='w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer'
                title="Go to LifeLink"
                onClick={() => window.location.href = "https://lifelink-1-kip8.onrender.com"}
              >
                <BsHeartFill className='w-[20px] h-[20px] text-pink-500' />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🟢 Online Users */}
      <div className='w-full flex items-center gap-3 overflow-x-auto px-[20px] py-3'>
        {!search && Array.isArray(otherUsers) && otherUsers.map(user => (
          onlineUsers?.includes(user._id) && (
            <div key={user._id} className='relative cursor-pointer' onClick={() => dispatch(setSelectedUser(user))}>
              <div className='w-[45px] h-[45px] rounded-full overflow-hidden shadow-md'>
                <img src={user.image || dp} alt="" className='h-full w-full object-cover' />
              </div>
              <span className='w-[12px] h-[12px] rounded-full bg-[#3aff20] border-2 border-white absolute bottom-0 right-0'></span>
            </div>
          )
        ))}
      </div>

      {/* 👥 USER LIST */}
      <div className='w-full h-[calc(100vh-420px)] overflow-y-auto flex flex-col gap-4 items-center mt-4 px-[10px] pb-[100px] custom-scroll'>
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className='w-[95%] h-[60px] flex items-center gap-4 bg-white shadow-md rounded-full hover:bg-[#78cae5] cursor-pointer px-4'
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
              <img src={user.image || dp} alt="" className='h-full w-full object-cover' />
            </div>
            <h1 className='text-gray-800 font-semibold text-[18px]'>{user.name || user.userName}</h1>
          </div>
        ))}
      </div>

      {/* 🔘 LOGOUT BUTTON */}
      <div
        className='cursor-pointer w-[60px] h-[60px] rounded-full flex justify-center items-center bg-[#20c7ff] shadow-md fixed bottom-[20px] left-[20px]'
        onClick={handleLogout}
      >
        <BiLogOutCircle className='w-[25px] h-[25px]' />
      </div>
    </div>
  );
}

export default SideBar;

