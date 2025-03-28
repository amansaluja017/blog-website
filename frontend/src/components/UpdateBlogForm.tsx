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
}

interface FormData {
    title: string;
    description: string;
}

export function UpdateBlogForm({
    className,
    blog,
    ...props
}: UpdateBlogFormProps) {
    const navigate = useNavigate();    

    const { register, handleSubmit } = useForm<FormData>();

    const submit = async (data: FormData) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/update-blog/${blog._id}`,
                data,
                { withCredentials: true }
            );
            if (response.status === 200) {
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
                                    defaultValue={blog.title}
                                    {...register("title")}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="newPassword">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    defaultValue={blog.description}
                                    {...register("description")}
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
