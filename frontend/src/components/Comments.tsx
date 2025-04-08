import { RootState } from "@/store/confStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface commentTypes {
  _id: string;
  owner: {
    _id: string;
    avatar: string;
    firstName: string;
    lastName: string;
  }
  blog: string,
  content: string;
}

function Comments({ blogId }: { blogId: string }) {
  const { register, handleSubmit, reset } = useForm();

  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const user = useTypedSelector((state) => state.user.userData);

  const [comments, setComments] = useState<commentTypes[]>([]);

  useEffect(() => {
    const fetchComments = async (blogId: string) => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/comment/get-comments/${blogId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setComments(response.data.data);
      }
    };

    fetchComments(blogId);
  }, [blogId]);

  const submit = async (data: any) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/comment/post-comment/${blogId}`,
        data,
        { withCredentials: true }
      );
      if(response.status === 200) {
        setComments([...comments, response.data.data]);
        reset({ content: "" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-white h-full overflow-y-auto">
      <div className="items-start p-6">
        <h2 className="text-2xl font-serif text-white">Comments</h2>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <Avatar>
              <AvatarImage
                src={user?.avatar || "/avatar.jpg"}
                alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
                className="object-cover rounded-full w-6 h-6"
              />
              <AvatarFallback className="bg-gray-500 text-white font-bold">
                {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex w-full items-center">
            <textarea
              className="w-full px-2 py-2 rounded-md placeholder-gray-400 border-2 border-gray-600"
              placeholder="Write a comment..."
              {...register("content", { required: true })}
            />
            <button type="submit" className="relative right-8 cursor-pointer">
              <SendHorizonal />
            </button>
          </div>
        </div>
      </form>

      <div className="h-full max-h-[30rem] overflow-y-auto mt-10">
        {comments &&
          comments.map((comment, i) => {
            return (
              <div
                key={i}
                className="p-3 flex gap-x-3 items-center bg-gray-800 rounded-lg"
              >
                <Avatar>
                  <AvatarImage
                    src={comment.owner?.avatar || "/avatar.jpg"}
                    alt={`${comment.owner?.firstName || "User"} ${comment.owner?.lastName || ""}`}
                    className="object-cover rounded-full w-8 h-8"
                  />
                  <AvatarFallback className="bg-gray-500 text-white font-bold">
                    {`${comment?.owner?.firstName?.[0] || ""}${comment?.owner?.lastName?.[0] || ""}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xs text-gray-400">
                    {comment?.owner?.firstName} {comment?.owner?.lastName}
                  </h4>
                  <div>
                    <h5>{comment.content}</h5>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Comments;
