import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";

export interface userInterface {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

function Header() {
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status = useTypedSelector(state => state.user.status);

 
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm z-50 relative px-4 sm:px-6 md:px-8">
        <div className="flex items-start">
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
        <nav className="flex items-center gap-8 mr-10 w-full justify-center text-white font-medium text-lg">
          {[
            { label: "Home", path: "/blogs" },
            { label: "About", path: "/about" },
            { label: "Contact Us", path: "/contact-us" },
          ].map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
            >
              <h3>{item.label}</h3>
            </div>
          ))}
        </nav>
        <div className="flex-none gap-2">
          <div className="flex items-center gap-2 sm:gap-5">
            {status && <Profile />}
           
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
