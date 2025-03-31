import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";

interface blogObject {
  _id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  coverImage: string;
}
function Blogs() {
  const [blogs, setBlogs] = useState<blogObject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState(blogs);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/getBlogs`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setBlogs(response.data.data);
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

  useEffect(() => {
    const filterBlogs = blogs.filter((blog) => {
      return Object.values(blog)
        .join("")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });

    if (searchTerm.length < 1) {
      setValue(blogs);
    } else {
      setValue(filterBlogs);
    }
  }, [searchTerm, blogs]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <label className="input-group w-full sm:w-80">
            <input
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              className="input input-bordered w-full text-white"
              placeholder="Search blogs..."
            />
            <span className="bg-primary text-white">
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </span>
          </label>
        </div>
        <button
          onClick={() => navigate("/editor")}
          className="btn btn-accent w-full sm:w-auto">
          Create Blog
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-6">
        {loading && <div className="skeleton h-[18rem] w-[22rem]"></div>}
        {!loading &&
          blogs.length > 0 &&
          value.map((blog, i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="h-48 w-full">
                <img
                  src={blog.coverImage || "/default-cover.jpg"}
                  alt={`${blog.title} cover`}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-lg sm:text-xl line-clamp-2 text-white">
                    {blog.title}
                  </h2>
                  <button className="btn btn-square">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="size-[1.2em]">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-xs line-clamp-3 text-gray-400">
                  {blog.description}
                </p>
                <div>
                  <div className="flex items-center h-full justify-between">
                    <h3 className="text-gray-500 text-xs italic">
                      ~ {`${blog.author?.firstName} ${blog.author?.lastName}`}
                    </h3>
                    <div className="card-actions justify-end">
                      <button
                        onClick={() =>
                          navigate("/content", { state: { blog } })
                        }
                        className="btn btn-primary btn-sm sm:btn-md">
                        Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Blogs;
