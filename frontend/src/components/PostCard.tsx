import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";

interface PostCardProps {
  postContent: string;
}

function PostCard(props: PostCardProps) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const user = useTypedSelector((state: RootState) => state.user.userData);

  const submit = async (data: Record<string, any>) => {
    const formData = new FormData();
    Object.keys(data).forEach((key: string) => {
      formData.append(key, key === "coverImage" ? data[key][0] : data[key]);
    });

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/blog/post`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    console.log(response);
    if (response.status === 201) {
      navigate("/blogs");
    }
  };

  return (
    <Card className="w-[350px] bg-[#191E24] text-white border-[#0c0f13] shadow-xl">
      <CardHeader>
        <CardTitle>Create blog</CardTitle>
        <CardDescription>Create your blog in one click</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                {...register("title", { required: true })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Description</Label>
              <Input
                id="description"
                placeholder="Description of your project"
                {...register("description", { required: true })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Content</Label>
              <Input
                id="Content"
                placeholder="Content of your project"
                defaultValue={props.postContent}
                readOnly
                {...register("content", { required: true })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Writer</Label>
              <Input
                id="Writer"
                defaultValue={`${user?.firstName}` + " " + `${user?.lastName}`}
                readOnly
                {...register("author", { required: true })}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Cover</Label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                <input
                  type="file"
                  className="hidden"
                  {...register("coverImage", { required: true })}
                />
                <span className="text-gray-400 text-sm">
                  Click or drop to upload image
                </span>
              </label>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => {
            navigate("/blogs");
          }}
          variant="outline"
          className="text-black cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(submit)}
          className="bg-black cursor-pointer"
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
