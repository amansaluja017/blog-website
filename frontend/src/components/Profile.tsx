import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { RootState } from "@/store/confStore";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/userSlice";
import { googleLogout } from "@react-oauth/google";

function Profile() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);
  const user = useTypedSelector((state) => state.user.userData);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/getCurrentUser`,
          { withCredentials: true }
        );
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
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={user?.avatar || "./public/avatar.jpg"}
              alt={`${user?.firstName} ${user?.lastName}`}
            />
            <AvatarFallback>{`${user?.firstName?.[0] || ""}${
              user?.lastName?.[0] || ""
            }`}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent className="bg-[#1D232A] p-6 rounded-lg">
          <SheetHeader>
            <SheetTitle>
              <span className="font-sans text-white text-xl font-bold">
                Profile
              </span>
            </SheetTitle>
            <div className="flex justify-center items-center flex-col text-center mt-6">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-24 h-24 rounded-full ring ring-offset-2 overflow-hidden">
                  <img src={user?.avatar || "./public/avatar.jpg"} alt="User Avatar" />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <h3 className="text-white font-semibold text-lg">{`${user?.firstName} ${user?.lastName}`}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <hr />
          <div
            onClick={() => {
              navigate("/my-blogs");
            }}
            className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg">
            <div className="text-white font-semibold">My blogs</div>
          </div>
          <hr />
          <div
            onClick={() => {
              navigate("/update-details");
            }}
            className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg">
            <div className="text-white font-semibold">Update details</div>
          </div>
          <hr />
          {user?.source === "google" && !user?.password ? (
            <div
              onClick={() => {
                navigate("/set-password");
              }}
              className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg">
              <div className="text-white font-semibold">Set password</div>
            </div>
          ) : (
            <div
              onClick={() => {
                navigate("/update-password");
              }}
              className="w-full cursor-pointer p-4 hover:bg-primary rounded-lg">
              <div className="text-white font-semibold">Change password</div>
            </div>
          )}
          <hr />

          <button
            onClick={() => handleLogout()}
            className="btn btn-soft btn-error text-sm sm:text-base mt-5">
            Logout
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Profile;
