import { UpdateBlogForm } from "@/components/UpdateBlogForm";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function UpdateBlog() {
  const { state } = useLocation();
  const { blog } = state || {};
  const {editedContent} = state || {};

  useEffect(() => {
    if (blog && Object.keys(blog).length > 0) {
      localStorage.setItem("blog", JSON.stringify(blog));
    }
  }, [blog]);

  const blogData = JSON.parse(localStorage.getItem("blog") || "{}");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-base-200">
      <div className="w-full max-w-sm">
        <UpdateBlogForm blog={blogData} editedContent={editedContent} />
      </div>
    </div>
  );
}

export default UpdateBlog;
