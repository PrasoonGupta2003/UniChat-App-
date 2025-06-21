import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 loading state
  const [err, setErr] = useState("");
  let dispatch=useDispatch();
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // 👈 Start loading
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        userName, email, password
      }, { withCredentials: true });
      dispatch(setUserData(result.data));
      console.log("Signup success:", result.data);
      navigate("/profile");
      setEmail("");
      setPassword("");
      setUserName("");
      setErr("")
      // You can also navigate to login or dashboard here
    } catch (e) {
      console.log(e);
      setErr(e?.response?.data?.message);
    } finally {
      setLoading(false); // 👈 Stop loading in both success/failure
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-[500px] bg-white rounded-[20px] flex flex-col gap-8 border-2 border-[#06a2d6] shadow-xl overflow-hidden">

        {/* Header */}
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-md flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-gray-600 font-bold text-[30px]">
              Welcome to <span className="text-white">UniChat</span>
            </h1>
            <p className="text-white text-[14px] mt-2 italic tracking-wide">
              Connect freely, chat globally.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col gap-5 items-center pb-8" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Enter username"
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-5 py-2 bg-white rounded-lg shadow-md text-[16px]"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <input
            type="email"
            placeholder="Enter email"
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-5 py-2 bg-white rounded-lg shadow-md text-[16px]"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] rounded-lg shadow-md relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Enter password"
              className="w-full h-full outline-none px-5 py-2 bg-white text-gray-700 text-[16px] rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute top-[10px] right-[20px] text-[15px] text-[#20c7ff] font-semibold cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "View"}
            </span>
          </div>

         {err && <p className='text-red-500'>{err}</p>}
          <button
            type="submit"
            className="w-[90%] py-3 bg-[#20c7ff] rounded-2xl shadow-md text-[18px] font-semibold text-white hover:shadow-inner transition-all disabled:opacity-50"
            disabled={loading} // 👈 prevent multiple clicks
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <p className="text-sm">
            Already have an Account?{" "}
            <span
              className="text-[#20c7ff] font-bold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
