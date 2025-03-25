import BlogCards from "@/components/BlogCards";
import { Auth0ContextInterface, useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"


function Blogs() {
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
        console.log(token);
        setAccessToken(token);
      } catch (error) {
        loginWithRedirect();
      }
    };

    restoreSession();
  }, [getAccessTokenSilently, loginWithRedirect]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex w-full justify-end p-3">
      <Button variant="outline" className="cursor-pointer font-sans">Create Blog</Button>
      </div>
      <div className=" grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-center p-10 py-15 gap-10">
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
        <div className="flex justify-center">
          <BlogCards />
        </div>
      </div>
    </div>
  );
}

export default Blogs;
