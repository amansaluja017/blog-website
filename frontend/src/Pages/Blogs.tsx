import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    avatar: string;
  };
  coverImage: string;
}
function Blogs() {
  const [blogs, setBlogs] = useState<blogObject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState(blogs);
  const [loading, setLoading] = useState(true);
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("likedBlogs") || "[]"))
  );
  const [following, setFollowing] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("following") || "[]"))
  );
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);

  const heartToogle = async (blogId: string) => {
    setLikedBlogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) {
        newSet.delete(blogId);
      } else {
        newSet.add(blogId);
      }
      localStorage.setItem("likedBlogs", JSON.stringify(Array.from(newSet)));
      return newSet;
    });

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/blog/like-blog/${blogId}`,
      {},
      { withCredentials: true }
    );
    console.log(response);

    await axios.get(
      `${import.meta.env.VITE_BASE_URL}/blog/get-likes/${blogId}`,
      { withCredentials: true }
    );
  };

  useEffect(() => {
    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");

    setLikedBlogs(new Set(likedBlogs));
  }, []);

  const toogleFollowBtn = async (userId: string) => {
    setFollowing((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      localStorage.setItem("following", JSON.stringify(Array.from(newSet)));
      return newSet;
    });

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/followers/${userId}`,
      {},
      { withCredentials: true }
    );
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/blog/getBlogs`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          console.log(response)
          setBlogs(response.data.data.blogs);
          localStorage.setItem("likedBlogs", JSON.stringify(response.data.data.likedBy || []));
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
    const filterBlogs =
      blogs.length > 0
        ? blogs.filter((blog) => {
            return Object.values(blog)
              .join("")
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          })
        : [];

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
          className="btn btn-accent w-full sm:w-auto"
        >
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
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
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
                  <Heart
                    onClick={() => {
                      heartToogle(blog._id);
                    }}
                    fill={likedBlogs.has(blog._id) ? "red" : "none"}
                    className="text-white cursor-pointer"
                  />
                </div>
                <p className="text-xs line-clamp-3 text-gray-400">
                  {blog.description}
                </p>
                <div>
                  <div className="flex items-center h-full justify-between">
                    <Popover>
                      <PopoverContent className="bg-base-200 border-base-200">
                        <div className="flex items-center text-white text-xs gap-x-5">
                          <div>
                            <Avatar>
                              <AvatarImage
                                src={blog.author?.avatar || "/avatar.jpg"}
                                alt={`${blog.author?.firstName || "User"} ${blog.author?.lastName || ""}`}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-gray-500 text-white font-bold">
                                {`${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="w-full">
                            <div className="flex items-center justify-between w-full">
                              <h4>
                                {blog.author?.firstName} {blog.author?.lastName}
                              </h4>
                              <input
                                onChange={() => toogleFollowBtn(blog.author._id)}
                                checked={new Set(JSON.parse(localStorage.getItem("following") || "[]")).has(blog.author?._id) ? false : true}
                                type="checkbox"
                                aria-label="follow"
                                className="btn w-18 h-8 bg-blend-soft-light rounded-full"
                              />
                            </div>
                            <h4 className="text-gray-500">
                              {blog.author?.email}
                            </h4>
                          </div>
                        </div>
                      </PopoverContent>
                      <PopoverTrigger>
                        <Avatar>
                          <AvatarImage
                            src={blog.author?.avatar || "/avatar.jpg"}
                            alt={`${blog.author?.firstName || "User"} ${blog.author?.lastName || ""}`}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gray-500 text-white font-bold">
                            {`${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`}
                          </AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>
                    </Popover>
                    <div className="card-actions justify-end">
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
                        className="btn btn-primary btn-sm sm:btn-md"
                      >
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
