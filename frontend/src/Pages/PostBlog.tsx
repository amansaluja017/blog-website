import PostCard from "@/components/PostCard";
import { useLocation } from "react-router-dom";

function PostBlog() {
  const { state } = useLocation();
  const { content } = state || {};
  console.log(content);

  const postContent = content;

  return (
    <div className="h-screen bg-base-200 flex justify-center items-center">
      <div>
        <PostCard postContent={postContent} />
      </div>
    </div>
  );
}

export default PostBlog;
