import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { RootState } from "@/store/confStore";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/userSlice";
import { googleLogout } from "@react-oauth/google";
import { OtpSection } from "./OtpSection";
import { BadgeCheck } from "lucide-react";

function Profile() {
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);
  const user = useTypedSelector((state) => state.user.userData);

  const [otpSection, setOtpSection] = useState(false);
  const [otp, setOtp] = useState("");
  const otpRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/getCurrentUser`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setFollowers(response.data.data.followers.length);
          setFollowing(response.data.data.following.length);
          localStorage.setItem("following", JSON.stringify(response.data.data.following));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (status) {
      fetchUser();
    }
  }, [status]);

  const handleLogout = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`,
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      dispatch(logout());
      navigate("/");
      googleLogout();
      localStorage.clear();
    }
  };

  useEffect(() => {
    if (otpSection) {
      otpRef.current?.classList.remove("hidden");
      otpRef.current?.classList.add("flex");
    }

    return () => setOtpSection(false);
  }, [otpSection]);

  const emailVarification = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/email-verify`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOtp(response.data.data);
      }
      setOtpSection(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Avatar className="cursor-pointer ring-2 ring-offset-2 ring-primary">
            <AvatarImage
              src={user?.avatar || "/avatar.jpg"}
              alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-500 text-white font-bold">
              {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`}
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent className="bg-[#1D232A] p-6 rounded-lg">
          <div
            ref={otpRef}
            className="z-50 absolute h-screen w-full items-center justify-center backdrop-blur-sm text-white hidden"
          >
            <OtpSection otp={otp} otpRef={otpRef} />
          </div>
          <SheetHeader>
            <SheetTitle>
              <span className="font-sans text-white text-xl font-bold">
                Profile
              </span>
            </SheetTitle>
            <div className="flex justify-center items-center flex-col text-center mt-6">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-24 h-24 rounded-full ring ring-offset-2 overflow-hidden">
                  <img
                    src={user?.avatar || "./public/avatar.jpg"}
                    alt="User Avatar"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <h3 className="text-white font-semibold text-lg">{`${user?.firstName} ${user?.lastName}`}</h3>
                <div className="flex items-center justify-center">
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  {user?.email_verified ? (
                    <BadgeCheck className="text-green-500 ml-3" />
                  ) : (
                    <span
                      onClick={() => emailVarification()}
                      className="text-sm cursor-pointer relative left-3 px-3 badge badge-soft badge-primary"
                    >
                      verify
                    </span>
                  )}
                </div>
              </div>
              <div className="text-white flex items-center justify-around mt-5 w-full">
                <div>
                  <span className="font-semibold">Followers</span> {followers}
                </div>
                <div>
                  <span className="font-semibold">Following</span> {following}
                </div>
              </div>
            </div>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <hr />
          <div
            onClick={() => {
              navigate("/my-blogs");
            }}
            className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg"
          >
            <div className="text-white font-semibold">My blogs</div>
          </div>
          <hr />
          <div
            onClick={() => {
              navigate("/update-details");
            }}
            className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg"
          >
            <div className="text-white font-semibold">Update details</div>
          </div>
          <hr />
          {user?.source === "google" && !user?.password ? (
            <div
              onClick={() => {
                navigate("/set-password");
              }}
              className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg"
            >
              <div className="text-white font-semibold">Set password</div>
            </div>
          ) : (
            <div
              onClick={() => {
                navigate("/update-password");
              }}
              className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg"
            >
              <div className="text-white font-semibold">Change password</div>
            </div>
          )}
          <hr />

          <button
            onClick={() => handleLogout()}
            className="btn btn-soft btn-error text-sm sm:text-base mt-5"
          >
            Logout
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Profile;
