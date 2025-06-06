import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import Home from "./Pages/Home";
import Blogs from "./Pages/Blogs";
import Editor from "./Pages/Editor";
import PostBlog from "./Pages/PostBlog";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import { Provider } from "react-redux";
import { store } from "./store/confStore";
import UserProtected from "./components/UserProtected";
import AdminProtected from "./components/AdminProtected";
import UpdateDetails from "./Pages/UpdateDetails";
import UpdatePassword from "./Pages/UpdatePassword";
import MyBlogs from "./Pages/MyBlogs";
import UpdateBlog from "./Pages/UpdateBlog";
import SetPassword from "./Pages/SetPassword";
import ForgotPassword from "./Pages/ForgotPassword";
import CreatePassword from "./Pages/CreateNewPassword";
import About from "./Pages/About";
import ContactUs from "./Pages/ContactUs";
import Content from "./Pages/Content";
import Dashboard from "./Pages/Admin/Dashboard";
import Users from "./Pages/Admin/Users";
import AdminLoginPage from "./Pages/Admin/Login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route
        path="/blogs"
        element={
          <UserProtected>
            <Blogs />
          </UserProtected>
        }
      />
      <Route
        path="/editor"
        element={
          <UserProtected>
            <Editor />
          </UserProtected>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/blog-post"
        element={
          <UserProtected>
            <PostBlog />
          </UserProtected>
        }
      />
      <Route
        path="/update-details"
        element={
          <UserProtected>
            <UpdateDetails />
          </UserProtected>
        }
      />
      <Route
        path="/update-password"
        element={
          <UserProtected>
            <UpdatePassword />
          </UserProtected>
        }
      />
      <Route
        path="/my-blogs"
        element={
          <UserProtected>
            <MyBlogs />
          </UserProtected>
        }
      />
      <Route
        path="/update-blog"
        element={
          <UserProtected>
            <UpdateBlog />
          </UserProtected>
        }
      />
      <Route
        path="/set-password"
        element={
          <UserProtected>
            <SetPassword />
          </UserProtected>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route
        path="/content"
        element={
          <UserProtected>
            <Content />
          </UserProtected>
        }
      />
      <Route
        path="/admin/login"
        element={
            <AdminLoginPage />
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtected>
            <Dashboard />
          </AdminProtected>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtected>
            <Users />
          </AdminProtected>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
