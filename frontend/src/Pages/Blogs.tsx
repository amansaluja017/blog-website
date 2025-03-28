import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";

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
  const status: boolean = useTypedSelector(state => state.user.status);

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
    if (status)  {
      fetchBlogs();
    }
  }, [status]);

  useEffect(() => {
    const filterBlogs = blogs.filter(blog => {
      return (
        Object.values(blog)
        .join("")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      )
    })
    setSearchBlogs(filterBlogs);

    if(searchTerm.length < 1) {
      setValue(blogs)
    } else {
      setValue(filterBlogs)
    }
  }, [searchTerm, blogs]);

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
      <div className="px-4 sm:px-6 md:px-10 text-white">
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input ref={searchRef} onChange={(e) => setSearchTerm(e.target.value)} type="search" className="grow" placeholder="Search" />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 p-4 sm:p-6 md:p-10">
        {blogs &&
          value.map((blog, i) => {
            return (
              <div key={i} className="w-full">
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
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Read</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Blogs;
