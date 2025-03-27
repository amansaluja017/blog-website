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
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "@/store/confStore";// Adjust the path to your store file

interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

function Profile() {
  const [user, setUser] = useState<User>();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status = useTypedSelector(state => state.user.status);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/getCurrentUser`,
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        setUser(response.data.data);
        console.log(response.data.data);
      }
    };
    if(status) {
      fetchUser();
    }
  }, [status]);

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
            <AvatarFallback>{`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent className="bg-[#1D232A] p-6 rounded-lg">
          <SheetHeader>
            <SheetTitle>
              <span className="font-sans text-white text-xl font-bold">Profile</span>
            </SheetTitle>
            <div className="flex justify-center items-center flex-col text-center mt-6">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-24 h-24 rounded-full ring ring-offset-2 overflow-hidden">
                  <img src={user?.avatar} alt="User Avatar" />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <h3 className="text-white font-semibold text-lg">{`${user?.firstName} ${user?.lastName}`}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <SheetDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error pariatur ad tenetur ab explicabo quo obcaecati delectus maxime debitis! Facere dicta repudiandae et aspernatur explicabo quasi quis est ex neque?
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Profile;
