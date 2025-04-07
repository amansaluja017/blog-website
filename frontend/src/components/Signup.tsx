import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signup } from "@/store/userSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef, useState } from "react";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const checkRef = useRef<HTMLButtonElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

const [isChecked, setIsChecked] = useState(false);

useEffect(() => {
  if (!isChecked) {
    btnRef.current?.setAttribute("disabled", "");
  } else {
    btnRef.current?.removeAttribute("disabled");
  }
}, [isChecked]);

  const submit = async (data: object) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        data,
        { withCredentials: true }
      );
      if (response.status === 201) {
        dispatch(signup(response.data.data));
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#191E24] text-white border-[#0c0f13] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Create an account to start writing blogs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">First name</Label>
                <Input
                  id="FirstName"
                  type="text"
                  placeholder="John"
                  required
                  {...register("firstName", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Last name</Label>
                <Input
                  id="LastName"
                  type="text"
                  placeholder="Smith"
                  {...register("lastName")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password", { required: true })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  ref={checkRef}
                  id="terms"
                  className="cursor-pointer"
                  onCheckedChange={(checked) => setIsChecked(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Accept terms and conditions
                </label>
              </div>
              <Button ref={btnRef} type="submit" className="w-full cursor-pointer disabled:bg-[#242527]">
                Signup
              </Button>
              <div className="divider">OR</div>
              <GoogleLoginButton />
            </div>
            <div
              onClick={() => navigate("/login")}
              className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
