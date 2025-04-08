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
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface UpdateBlogFormProps extends React.ComponentProps<"div"> {
  blog?: any;
  editedContent?: any;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  coverImage?: FileList;
}

export function UpdateBlogForm({
  className,
  blog,
  editedContent,
  ...props
}: UpdateBlogFormProps) {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<FormData>();

  const submit = async (data: FormData) => {
    const formData = new FormData();
    Object.keys(data as Record<string, any>).forEach((key) => {
      formData.append(
        key,
        key === "coverImage"
          ? (data as Record<string, any>)[key][0]
          : (data as Record<string, any>)[key]
      );
    });
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/blog/update-blog/${blog._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("blog");
        navigate("/my-blogs");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="bg-[#191E24] text-white border-[#0c0f13] shadow-2xl">
        <CardHeader>
          <CardTitle>Update Blog</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="currPassword">Title</Label>
                <Input
                  id="title"
                  type="text"
                  defaultValue={blog?.title}
                  {...register("title")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="newPassword">Description</Label>
                <Input
                  id="description"
                  type="text"
                  defaultValue={blog?.description}
                  {...register("description")}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="newPassword">Content</Label>
                  <span
                    onClick={() =>
                      navigate("/editor", { state: { content: blog.content } })
                    }
                    className="text-red-500 text-sm cursor-pointer hover:underline"
                  >
                    Edit
                  </span>
                </div>
                <Input
                  id="content"
                  type="text"
                  defaultValue={editedContent ? editedContent : blog?.content}
                  readOnly
                  {...register("content")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="coverImage">Cover image</Label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                  <input
                    type="file"
                    className="hidden"
                    {...register("coverImage")}
                  />
                  <span className="text-gray-400 text-sm">
                    Click or drop to upload image
                  </span>
                </label>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Update
                </Button>
              </div>
            </div>
          </form>
          <div
            onClick={() => {
              navigate("/my-blogs");
              localStorage.removeItem("blog");
            }}
            className="flex flex-col gap-3 mt-5"
          >
            <Button className="w-full cursor-pointer">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
