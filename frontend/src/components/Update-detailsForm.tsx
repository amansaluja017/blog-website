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
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/confStore";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Update } from "@/store/userSlice";

export function UpdateDetailsForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const user = useTypedSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const submit = async (data: Record<string, any>) => {
    const formData = new FormData();
    Object.keys(data).forEach((key: string) => {
      formData.append(
        key,
        key === "avatar" && data[key]?.[0] ? data[key][0] : data[key]
      );
    });
    if (user.role === "user") {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/user/update-details`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        console.log("Response:", response.data);
        if (response.status === 200) {
          dispatch(Update(response.data.data));
          navigate("/blogs");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    } else if (user.role === "admin") {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/admin/update-details`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        console.log("Response:", response.data);
        if (response.status === 200) {
          dispatch(Update(response.data.data));
          navigate("/blogs");
        }
      } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="bg-[#191E24] text-white border-[#0c0f13] shadow-2xl">
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  defaultValue={user?.firstName}
                  {...register("firstName")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  defaultValue={user?.lastName}
                  {...register("lastName")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  defaultValue={user?.email}
                  disabled={user?.source === "google"}
                  {...register("email")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="avatar">Avatar</Label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                  <input
                    type="file"
                    className="hidden"
                    {...register("avatar")}
                  />
                  <span className="text-gray-400 text-sm">
                    Click or drop to upload image
                  </span>
                </label>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Save changes
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
