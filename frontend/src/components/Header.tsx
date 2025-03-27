import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/confStore";
import { logout } from "@/store/userSlice";

export interface userInterface {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status = useTypedSelector(state => state.user.status);

  const handleLogout = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`,
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      console.log(response);
      dispatch(logout());
      navigate("/");
      googleLogout();
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm z-50 relative px-4 sm:px-6 md:px-8">
        <div className="flex-1">
          <a className="flex items-center">
            <img
              src="./public/logo.webp"
              alt="logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <strong className="btn btn-ghost text-lg sm:text-xl text-white ml-2 sm:ml-5">
              YourBlogs
            </strong>
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="flex items-center gap-2 sm:gap-5">
            {status && <Profile />}
            {status && (
              <button
                onClick={() => handleLogout()}
                className="btn btn-soft btn-error text-sm sm:text-base">
                Logout
              </button>
            )}
            {!status && (
              <button
                onClick={() => {
                  navigate("/signup");
                }}
                className="btn btn-soft btn-primary text-sm sm:text-base">
                Signup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
