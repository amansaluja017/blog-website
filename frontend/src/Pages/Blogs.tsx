import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";
import { OtpSection } from "@/components/OtpSection";

interface blogObject {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  coverImage: string;
}
function Blogs() {
  const [blogs, setBlogs] = useState<blogObject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBlogs, setSearchBlogs] = useState<blogObject[]>([]);
  const [value, setValue] = useState(blogs);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/getBlogs`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setBlogs(response.data.data);
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
    setSearchBlogs(filterBlogs);

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
        {blogs &&
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
                <h2 className="card-title text-lg sm:text-xl line-clamp-2 text-white">
                  {blog.title}
                </h2>
                <p className="text-sm line-clamp-3 text-white">
                  {blog.description}
                </p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm sm:btn-md">
                    Read
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Blogs;
