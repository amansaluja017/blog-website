import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/confStore";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  createdAt: string;
  email_verified: boolean;
  isBlocked: boolean;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    if (!userData || userData.role !== "admin") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [navigate, userData]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/users`,
        { withCredentials: true }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/users/${userId}`,
        { withCredentials: true }
      );

      if(response.status = 200) {
        fetchUsers();
      }
      
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleToggleBlock = async (userId: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/admin/users/${userId}/toggle-block`,
        {},
        { withCredentials: true }
      );
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to toggle user block status:", error);
    }
  };

  return (
    <div className="container bg-base-200 text-white mx-auto p-6 h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Verified</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Joined</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName}'s avatar`}
                    className="w-8 h-8 rounded-full"
                  />
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  {user.email_verified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-red-600">✗ Unverified</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={user.isBlocked ? "text-red-600" : "text-green-600"}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant={user.isBlocked ? "default" : "destructive"}
                      size="sm"
                      onClick={() => handleToggleBlock(user._id)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}