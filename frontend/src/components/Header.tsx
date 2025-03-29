import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export interface userInterface {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status = useTypedSelector((state) => state.user.status);

  return (
    <div className="sticky top-0 z-50 text-white">
      <div className="navbar bg-base-100 shadow-md px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src="./public/logo.webp"
              alt="logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <strong className="btn btn-ghost text-base sm:text-lg md:text-xl text-white ml-2">
              YourBlogs
            </strong>
          </div>

          {status && (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {[
                { label: "Home", path: "/blogs" },
                { label: "About", path: "/about" },
                { label: "Contact Us", path: "/contact-us" },
              ].map((item) => (
                <NavigationMenu key={item.path}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        onClick={() => navigate(item.path)}
                        className="cursor-pointer">
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            {status && <Profile />}
            {!status && (
              <button
                onClick={() => navigate("/signup")}
                className="btn btn-primary btn-sm sm:btn-md">
                Signup
              </button>
            )}
          </div>

          {status && (
            <button
              className="md:hidden ml-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg">
          <nav className="flex flex-col py-4">
            {[
              { label: "Home", path: "/blogs" },
              { label: "About", path: "/about" },
              { label: "Contact Us", path: "/contact-us" },
            ].map((item) => (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="px-6 py-2 text-white hover:bg-base-200 cursor-pointer">
                <h3>{item.label}</h3>
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export default Header;
