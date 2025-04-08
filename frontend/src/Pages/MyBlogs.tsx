import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";
import { Pencil, Trash } from "lucide-react";
import StatsHeader from "@/components/StatsHeader";

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
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number>(0);
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/blog/getMyBlogs`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setTotalLikes(response.data.data.totalLikes);
          setTotalViews(response.data.data.totalViews);
          setBlogs(response.data.data.blogs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (status) {
      fetchBlogs();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-base-200">
      <div>
        <StatsHeader
          totalLikes={totalLikes}
          blogs={blogs}
          totalViews={totalViews}
        />
      </div>
      <div className="flex justify-end p-4 sm:p-6">
        <button
          onClick={() => navigate("/editor")}
          className="btn btn-accent w-full sm:w-auto">
          Create Blog
        </button>
      </div>
      <div className="p-4 sm:p-6">
        {loading && <div className="skeleton h-[18rem] w-[22rem]"></div>}
        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {blogs.map((blog, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className="h-48">
                  <img
                    src={blog.coverImage || "/default-cover.jpg"}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-lg sm:text-xl mb-2 line-clamp-2 text-white">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Pencil
                        onClick={() => {
                          navigate("/update-blog", { state: { blog } });
                          window.location.reload();
                        }}
                        className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700"
                      />
                      <Trash
                        onClick={async () => {
                          try {
                            const response = await axios.delete(
                              `${
                                import.meta.env.VITE_BASE_URL
                              }/blog/delete-blog/${blog._id}`,
                              { withCredentials: true }
                            );
                            if (response.status === 200) {
                              setBlogs((prevBlogs) =>
                                prevBlogs.filter((b) => b._id !== blog._id)
                              );
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                        className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700"
                      />
                    </div>
                    <button
                      onClick={() => {
                        navigate("/content", { state: { blog } });

                        setTimeout(async () => {
                          try {
                            await axios.post(
                              `${
                                import.meta.env.VITE_BASE_URL
                              }/blog/blog-seen/${blog._id}`,
                              {},
                              { withCredentials: true }
                            );

                            await axios.get(
                              `${
                                import.meta.env.VITE_BASE_URL
                              }/blog/get-views/${blog._id}`,
                              { withCredentials: true }
                            );
                          } catch (error) {
                            console.error(error);
                          }
                        }, 10000);
                      }}
                      className="btn btn-primary btn-sm">
                      Read
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && blogs.length === 0 && (
          <div className="text-center text-gray-400">No blogs found.</div>
        )}
      </div>
    </div>
  );
}

export default MyBlogs;
