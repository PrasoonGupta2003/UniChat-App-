import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../main";

const useCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useCurrentUser;
