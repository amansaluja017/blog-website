import { useAuth0 } from "@auth0/auth0-react";

function Header() {
  const { loginWithRedirect, isAuthenticated, logout, user  } = useAuth0();
  console.log(isAuthenticated);
  console.log(user);

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm fixed">
        <a className="btn btn-ghost text-xl text-white">daisyUI</a>
        <div className="absolute pr-5 right-0">
          {isAuthenticated ? (
            <button
              onClick={() => logout({ logoutParams: { returnTo: "http://localhost:5173/" } })}
              className="btn btn-soft btn-primary">
              Logout
            </button>
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
