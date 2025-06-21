import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useMessages = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
    if (!selectedUser || !selectedUser._id) return;
      try {
        const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(result.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
   fetchMessages(); 
  },[selectedUser?._id, dispatch]);
};

export default useMessages;