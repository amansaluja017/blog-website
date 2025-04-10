import { Request, Response } from "express";
import "../types/express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Blog } from "../models/blog.model";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadImage } from "../utils/Cloudinary";
import mongoose, { mongo } from "mongoose";
import { publishToQueue, subscribeToQueue } from "../service/rabbit";

interface userTypes {
  _id: mongoose.Types.ObjectId,
  firstName: string,
  lastName: string,
  avatar: string,
  role: string
}

interface authorType {
  _id: mongoose.Types.ObjectId,
  role: string
}

let author: authorType = {} as authorType;

let users: Array<userTypes> = [];
let admins: Array<userTypes> = [];

export const blogPost = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    content,
  }: { title: string; description: string; content: string } = req.body;

  if (!title || !description || !content) {
    throw new ApiError(404, "Invalid title or description");
  }

  const files = req.files as { [key: string]: { path: string }[] };
  const coverImagePath = files.coverImage[0]?.path;

  if (!coverImagePath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadImage(coverImagePath);

  if (!coverImage) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  publishToQueue("blog:create", JSON.stringify(req.user));

  setTimeout(() => {
    if (Object.keys(author).length > 0) {
      const blog = new Blog({
        title,
        description,
        content,
        author: {
          authorId: author._id,
          authorRole: author.role
        },
        coverImage,
      });

      blog.save()
        .then((savedBlog) => {
          return res
            .status(201)
            .json(new ApiResponse(201, savedBlog, "Blog created successfully"));
        })
        .catch((err) => {
          console.error(err);
          throw new ApiError(500, "Failed to create blog");
        });
    }
  }, 3000)

});

subscribeToQueue("adminVerified", (data) => {
  if (!data) {
    throw new ApiError(400, "Invalid author data");
  }

  author = JSON.parse(data);
});

subscribeToQueue("userInfo", (data) => {
  if (!data) {
    throw new ApiError(400, "Invalid author data");
  }

  author = JSON.parse(data);
  console.log(author);
})

export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  const userIds = blogs.filter(blog => blog.author.authorRole === "user").map(blog => blog.author.authorId);
  const adminIds = blogs.filter(blog => blog.author.authorRole === "admin").map(blog => blog.author.authorId);

  publishToQueue("getUsersBlogs", JSON.stringify(userIds));
  publishToQueue("getAdminBlogs", JSON.stringify(adminIds));

  setTimeout(() => {
    const blogsWithAuthor = blogs.map(blog => ({
      ...blog.toObject(),
      author: admins.find(admin => admin._id === blog.author.authorId) || users.find(user => user._id === blog.author.authorId)
    }));

    const likedBy = blogs.map((blog) => {
      if ((blog.likedBy).includes(req.user as mongoose.Types.ObjectId)) {
        return blog._id;
      }
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { blogsWithAuthor, likedBy },
          "Blogs fetched successfully"
        )
      );
  }, 3000)
});

subscribeToQueue("users", (data) => {

  const parsedData = JSON.parse(data);

  users = parsedData;
})

subscribeToQueue("admins", (data) => {
  const parsedData = JSON.parse(data);

  admins = parsedData;
})

export const myBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await Blog.find({ "author.authorId": req.user }).sort({
    createdAt: -1,
  });

  const likedBlogs = blogs.map((blog) => {
    return blog.likes;
  });

  const views = blogs.map((blog) => {
    return blog.views;
  });

  const totalLikes = likedBlogs.reduce((acc, like) => acc + like, 0);
  const totalViews = views.reduce((acc, view) => acc + view, 0);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { blogs, totalLikes, totalViews },
        "Blogs fetched successfully"
      )
    );
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    content,
  }: { title: string; description: string; content: string } = req.body;
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const files = req.files as { [key: string]: { path: string }[] };
  const coverImagePath = files.coverImage ? files.coverImage[0]?.path : null;


  const coverImage = await uploadImage(coverImagePath as string);

  if (coverImagePath && !coverImage) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    {
      title,
      description,
      content,
      ...(coverImage && { coverImage }),
    },
    { new: true }
  );

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog updated successfully"));
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const blog = await Blog.findByIdAndDelete(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog deleted successfully"));
});

export const toogleLikedBlog = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;

    if (!blogId) {
      throw new ApiError(400, "Blog id is required");
    }

    const alreadyLiked = await Blog.findOne({ _id: blogId }, { likedBy: true });
    const likedBy = alreadyLiked?.likedBy;

    if (likedBy?.includes(req.user as mongoose.Types.ObjectId)) {
      await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likedBy: req.user },
        },
        { new: true }
      );
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likedBy: req.user },
        },
        { new: true }
      );

      if (!blog) {
        throw new ApiError(404, "Blog not found");
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Toggled like successfully"));
  }
);

export const getLikes = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const blog = await Blog.findById(blogId).populate("likedBy");
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const likes = blog.likedBy.length;

  await Blog.findOneAndUpdate({ _id: blog.id }, { likes }, { new: true });

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Likes fetched successfully"));
});

export const blogSeenBy = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { seenBy: req.user },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "one view added successfully"));
});

export const getViews = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const blog = await Blog.findById(blogId).populate("seenBy");
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const views = blog.seenBy.length;

  await Blog.findOneAndUpdate({ _id: blog.id }, { views }, { new: true });

  return res
    .status(200)
    .json(new ApiResponse(200, views, "views fetched successfully"));
});

subscribeToQueue("totalBlogs", async () => {
  const blogsCount = await Blog.countDocuments();

  if (blogsCount > 0) {
    publishToQueue("blogCount", JSON.stringify(blogsCount))
  }
});

subscribeToQueue("getRecentBlogs", async () => {
  const recentBlogs = await Blog.find().sort({createdAt: -1}).limit(5);

  await publishToQueue("recentBlogs", JSON.stringify(recentBlogs));
})

subscribeToQueue("userBlogsDelete", async (data) => {
  const userId = JSON.parse(data);

  const blogs = await Blog.find({"author.authorId": userId});

  blogs.map(async(blog) => {
    await Blog.findByIdAndDelete(blog._id);
  })
});