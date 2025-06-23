import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { propertyService } from "../../../lib/propertyService";
import { userService } from "../../../lib/userService";
import AdminChatInterface from "../Chat/AdminChatInterface";

/**
 * Admin Dashboard component
 * Provides property and user management for administrators
 */
const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("properties");

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === "properties") {
          const { data, error } = await propertyService.getProperties();
          if (error) throw error;
          setProperties(data || []);
        } else if (activeTab === "users") {
          const { data, error } = await userService.getAllUsers();
          if (error) throw error;
          setUsers(data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      fetchData();
    }
  }, [activeTab, user, isAdmin]);

  // Handle property deletion
  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      const { error } = await propertyService.deleteProperty(id);
      if (error) throw error;

      // Update the properties list
      setProperties(properties.filter((property) => property.id !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
      setError(err.message);
    }
  };

  // Handle toggling user admin status
  const handleToggleAdminStatus = async (userId, currentStatus) => {
    try {
      const { error } = await userService.setUserAdminStatus(
        userId,
        !currentStatus,
      );
      if (error) throw error;

      // Update the users list
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return { ...user, is_admin: !currentStatus };
          }
          return user;
        }),
      );
    } catch (err) {
      console.error("Error updating user admin status:", err);
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">Please log in to access this page.</div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        You do not have permission to access this page.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("properties")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "properties" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "users" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "chat" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Chat Management
          </button>
        </nav>
      </div>

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Property Management</h2>
            <button
              onClick={() => navigate("/admin/properties/new")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add New Property
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">No properties found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b text-left">Title</th>
                    <th className="py-3 px-4 border-b text-left">Location</th>
                    <th className="py-3 px-4 border-b text-left">Price</th>
                    <th className="py-3 px-4 border-b text-left">Type</th>
                    <th className="py-3 px-4 border-b text-left">Sale Type</th>
                    <th className="py-3 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{property.title}</td>
                      <td className="py-3 px-4 border-b">
                        {property.location}
                      </td>
                      <td className="py-3 px-4 border-b">
                        ${property.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {property.property_type?.name}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {property.sale_type?.name}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/properties/edit/${property.id}`)
                            }
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/properties/${property.id}`)
                            }
                            className="text-green-500 hover:text-green-700"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-semibold mb-6">User Management</h2>

          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b text-left">Email</th>
                    <th className="py-3 px-4 border-b text-left">
                      Admin Status
                    </th>
                    <th className="py-3 px-4 border-b text-left">Created At</th>
                    <th className="py-3 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{user.email}</td>
                      <td className="py-3 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded text-xs ${user.is_admin ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {user.is_admin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <button
                          onClick={() =>
                            handleToggleAdminStatus(user.id, user.is_admin)
                          }
                          className={`px-3 py-1 rounded text-white ${user.is_admin ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                          {user.is_admin ? "Remove Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Chat Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage client conversations and provide support
            </p>
          </div>
          <AdminChatInterface />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
