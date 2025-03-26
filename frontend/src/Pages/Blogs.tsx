import { Auth0ContextInterface, useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [accessToken, setAccessToken] = useState<string>("");
  const {
    user,
    getAccessTokenSilently,
    loginWithRedirect,
  }: Auth0ContextInterface<any> = useAuth0();

  useEffect(() => {
    if (user) {
      const registerUser = async () => {
        try {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/v1/users/register`,
            {
              name: user.name,
              email: user.email,
              picture: user.picture,
              sub: user.sub,
              nickname: user.nickname,
              accessToken,
            },
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Error registering user:", error);
        }
      };

      registerUser();
    }
  }, [user?.sub]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (error) {
        loginWithRedirect();
      }
    };

    restoreSession();
  }, [getAccessTokenSilently, loginWithRedirect]);

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
    fetchBlogs();
  }, []);

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
    console.log(filterBlogs);

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
      <div className="px-10 text-white">
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
      <div className=" grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center p-10 py-15 gap-10">
        {blogs &&
          value.map((blog, i) => {
            return (
              <div key={i}>
                <div className="card bg-base-100 w-96 shadow-sm text-white object-fill">
                  <figure>
                    <img
                      src={blog.coverImage || "/default-cover.jpg"}
                      alt={`${blog.title} cover image`}
                      className="h-48 w-full object-cover"
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
