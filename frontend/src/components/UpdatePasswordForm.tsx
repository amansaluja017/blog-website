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

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const submit = async (data: any) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/update-password`,
        data,
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(Update(response.data.data));
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
          <CardTitle>Change Password</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="currPassword">Current Password</Label>
                <Input
                  id="currPassword"
                  type="password"
                  placeholder="current password"
                  {...register("currentPassword")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="new password"
                  {...register("NewPassword")}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Update
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
