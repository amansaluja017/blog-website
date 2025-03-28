import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux';
import { login } from "@/store/userSlice";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/googleLogin`,
        { token },
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(login(response.data.data));
        navigate('/blogs');
      }
    }

    if(token) {
      fetchToken();
    }
  }, [token]);

  return (
    <GoogleLogin
      onSuccess={(response) => {
        if(response) {
          setToken(response.credential!);
        }
      }}
      onError={() => {
        console.error("Login Failed");
      }}
    />
  );
};

export default GoogleLoginButton;
