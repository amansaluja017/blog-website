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
import { useDispatch } from "react-redux";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Update } from "@/store/userSlice";

export function SetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const submit = async (data: any) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/user/set-password`,
        data,
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(Update(response.data.data));
        console.log(response)
        navigate("/blogs");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="bg-[#191E24] text-white border-[#0c0f13] shadow-2xl">
        <CardHeader>
          <CardTitle>Set Password</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="Password">Password</Label>
                <Input
                  id="Password"
                  type="password"
                  placeholder="password"
                  {...register("password")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="ConfirmPassword">Confirm Password</Label>
                <Input
                  id="ConfirmPassword"
                  type="password"
                  placeholder="confirm password"
                  {...register("confirmPassword")}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Set Password
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
