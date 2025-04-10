import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/confStore";

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  totalComments: number;
}

interface RecentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  createdAt: string;
}

interface RecentBlog {
  _id: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    if (!userData || userData.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/dashboard-stats`,
          { withCredentials: true }
        );

        const { stats, recentUsers, recentBlogs } = response.data.data;
        setStats(stats);
        setRecentUsers(recentUsers);
        setRecentBlogs(recentBlogs);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [navigate, userData]);

  return (
    <div className="container mx-auto p-6 bg-base-200 text-white h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Blogs</h3>
          <p className="text-3xl font-bold">{stats?.totalBlogs || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Comments</h3>
          <p className="text-3xl font-bold">{stats?.totalComments || 0}</p>
        </Card>
      </div>

      {/* Recent Users */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={`${user.firstName}'s avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                    {user?.firstName} {user?.lastName}
                  </td>
                  <td className="p-4">{user?.email}</td>
                  <td className="p-4">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Blogs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Blogs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Author</th>
                <th className="text-left p-4">Views</th>
                <th className="text-left p-4">Likes</th>
                <th className="text-left p-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentBlogs.map((blog) => (
                <tr key={blog._id} className="border-b">
                  <td className="p-4">{blog.title}</td>
                  <td className="p-4">
                    {blog.author?.firstName} {blog.author?.lastName}
                  </td>
                  <td className="p-4">{blog.views}</td>
                  <td className="p-4">{blog.likes}</td>
                  <td className="p-4">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}