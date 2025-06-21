import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import Profile from './pages/Profile';
import useCurrentUser from './customHooks/useCurrentUser'; // ✅ updated
import useOtherUsers from './customHooks/useOtherUsers';
import {io} from "socket.io-client";
import { serverUrl } from './main';
import { setOnlineUsers, setSocket } from './redux/userSlice';

function App() {
  useCurrentUser(); 
  useOtherUsers();
  let { userData,socket,onlineUsers } = useSelector(state => state.user);
  let dispatch = useDispatch();
  useEffect(()=>{
    if(userData){
    const socketio=io(`${serverUrl}`,{
      query: {
        userId: userData?._id,
      }
    });
    dispatch(setSocket(socketio));
    socketio.on("getOnlineUsers",(users)=>{
      dispatch(setOnlineUsers(users));
    });
    return () => socketio.disconnect();
    }
    else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }
  },[userData])
  return (
    <Routes>
      <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/profile" />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;
