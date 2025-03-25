import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";

function Header() {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  console.log(isAuthenticated);
  console.log(user);

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm z-50 relative">
        <a className="btn btn-ghost text-xl text-white">YourBlogs</a>
        <div className="absolute pr-5 right-0">
          {isAuthenticated ? (
            <div className="flex items-center justify-center gap-5">
              
              <Profile />
              <button
                onClick={() =>
                  logout({
                    logoutParams: { returnTo: "http://localhost:5173/" },
                  })
                }
                className="btn btn-soft btn-error">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="btn btn-soft btn-primary">
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
