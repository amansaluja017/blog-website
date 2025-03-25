import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth0, User } from "@auth0/auth0-react";

function Profile() {
  const { user }: User = useAuth0();
  console.log(user.picture);

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.picture} />
            <AvatarFallback>YB</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent className="bg-[#1D232A]">
          <SheetHeader>
            <SheetTitle>
              <h1 className="font-sans text-white text-lg">Profile</h1>
            </SheetTitle>
            <SheetDescription className="flex justify-center items-center flex-col text-center mt-10">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                  <img src={user.picture} />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <h3 className="text-white font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Profile;
