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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/blog-post" element={<PostBlog />} />
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
