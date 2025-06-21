import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../main";

const useOtherUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.error("Error fetching other users:", error);
      }
    };

    if (userData) fetchUser(); 
  }, [userData, dispatch]);
};

export default useOtherUsers;
