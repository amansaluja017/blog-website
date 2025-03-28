import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";
import { Pencil, Trash } from "lucide-react";

export interface blogObject {
    _id: string;
    title: string;
    description: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: string;
    coverImage: string;
}
function MyBlogs() {
  const [blogs, setBlogs] = useState<blogObject[]>([]);
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);

  useEffect(() => {
    try {
      const fetchBlogs = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/getMyBlogs`,
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.status === 200) {
          setBlogs(response.data.data);
        }
      };
      if (status) {
        fetchBlogs();
      }
    } catch (error) {
      console.error(error);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex w-full justify-end p-3">
        <button
          onClick={() => {
            navigate("/editor");
          }}
          className="btn btn-soft btn-accent">
          Create Blog
        </button>
      </div>
      <div className="h-screen">
        {blogs.length > 0 ? (
          blogs.map((blog, i) => {
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 p-4 sm:p-6 md:p-10">
                <div className="w-full">
                  <div className="card bg-base-100 w-full shadow-sm text-white">
                    <figure className="h-48 w-full">
                      <img
                        src={blog.coverImage || "/default-cover.jpg"}
                        alt={`${blog.title} cover image`}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{blog.title}</h2>
                      <p>{blog.description}</p>
                      <div className="card-actions justify-end items-center">
                        <div className="flex absolute left-8 gap-5 bottom-5">
                          <Pencil
                            onClick={() =>
                              navigate("/update-blog", { state: { blog } })
                            }
                            className="cursor-pointer text-blue-300"
                          />
                          <Trash
                            onClick={async () => {
                                try {
                                    const response = await axios.delete(
                                        `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/delete-blog/${blog._id}`,
                                        { withCredentials: true }
                                    );
                                    if(response.status === 200) {
                                        window.location.reload();
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                            className="cursor-pointer text-red-400"
                          />
                        </div>
                        <button className="btn btn-primary">Read</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center w-full h-full ">
            <h1 className="text-white text-lg font-normal">No blogs found</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBlogs;
