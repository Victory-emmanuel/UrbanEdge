import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { propertyService } from "../../../lib/propertyService";
import { userService } from "../../../lib/userService";
import AdminChatInterface from "../Chat/AdminChatInterface";
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Avatar,
  IconButton,
  Badge,
  Chip,
} from "@material-tailwind/react";
import { supabase } from "../../../lib/supabase";

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
        !currentStatus
      );
      if (error) throw error;

      // Update the users list
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return { ...user, is_admin: !currentStatus };
          }
          return user;
        })
      );
    } catch (err) {
      console.error("Error updating user admin status:", err);
      setError(err.message);
    }
  };

  // Handle CSV export of property data
  const handleExportCSV = async () => {
    try {
      // Show loading state or notification if needed
      setLoading(true);
      
      // Fetch all properties if not already loaded
      let propertiesToExport = properties;
      if (!propertiesToExport || propertiesToExport.length === 0) {
        const { data, error } = await propertyService.getProperties();
        if (error) throw error;
        propertiesToExport = data || [];
      }
      
      // Convert properties to CSV format
      const headers = [
        "ID",
        "Title",
        "Location",
        "Price",
        "Bedrooms",
        "Bathrooms",
        "Square Feet",
        "Property Type",
        "Sale Type",
        "Description",
        "Created At",
        "Updated At"
      ];
      
      const csvRows = [
        headers.join(","), // Header row
        ...propertiesToExport.map(property => [
          property.id,
          `"${property.title?.replace(/"/g, '""') || ''}"`, // Escape quotes in CSV
          `"${property.location?.replace(/"/g, '""') || ''}"`,
          property.price || '',
          property.bedrooms || '',
          property.bathrooms || '',
          property.square_feet || '',
          `"${property.property_type?.replace(/"/g, '""') || ''}"`,
          `"${property.sale_type?.replace(/"/g, '""') || ''}"`,
          `"${property.description?.replace(/"/g, '""') || ''}"`,
          property.created_at ? new Date(property.created_at).toLocaleString() : '',
          property.updated_at ? new Date(property.updated_at).toLocaleString() : ''
        ].join(","))
      ];
      
      const csvContent = csvRows.join("\n");
      
      // Create a Blob with the CSV data
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `urbanedge-properties-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setLoading(false);
    } catch (err) {
      console.error("Error exporting properties to CSV:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle TXT export of property data in JSON format
  const handleExportTXT = async () => {
    try {
      // Show loading state or notification if needed
      setLoading(true);
      
      // Fetch all properties if not already loaded
      let propertiesToExport = properties;
      if (!propertiesToExport || propertiesToExport.length === 0) {
        const { data, error } = await propertyService.getProperties();
        if (error) throw error;
        propertiesToExport = data || [];
      }
      
      // Convert properties to a plain text string (JSON format)
      const textContent = JSON.stringify(propertiesToExport, null, 2);
      
      // Create a Blob with the plain text data
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8;" });
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `urbanedge-properties-json-${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setLoading(false);
    } catch (err) {
      console.error("Error exporting properties to DOCX:", err);
      setError(err.message);
      setLoading(false);
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
    <div className=" mx-auto p-6">
      <Card className="mb-6 shadow-md">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex items-center justify-between gap-8">
            <div>
              <Typography className="" variant="h4" color="blue-gray">
                Admin Dashboard
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage properties, users, and client communications
              </Typography>
            </div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </CardHeader>
        <CardBody className="px-0">
          <Tabs value={activeTab}>
            <TabsHeader className="bg-transparent xx:overflow-x-scroll xs:overflow-hidden mb-4">
              <Tab
                value="properties"
                onClick={() => setActiveTab("properties")}
                className="text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  <span className="text-base ss:inline-block hidden">
                    Properties
                  </span>
                </div>
              </Tab>
              <Tab
                value="users"
                onClick={() => setActiveTab("users")}
                className="text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-base ss:inline-block hidden">
                    User Management
                  </span>
                </div>
              </Tab>
              <Tab
                value="chat"
                onClick={() => setActiveTab("chat")}
                className="text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span className="text-base ss:inline-block hidden">
                    Chat Management
                  </span>
                </div>
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value="properties" className="p-0 ">
                <div className="px-4">
                  <div className="flex justify-between items-center mb-6">
                    <Typography
                      className="xs:text-lg ss:text-xl text-base font-semibold"
                      color="blue-gray"
                    >
                      Property Management
                    </Typography>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2"
                        size="sm"
                        color="green"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />{" "}
                        <span className="text-base ss:inline-block hidden">
                          Export CSV
                        </span>
                      </Button>
                      <Button
                        onClick={handleExportTXT}
                        className="flex items-center gap-2"
                        size="sm"
                        color="purple"
                      >
                        <DocumentTextIcon className="h-4 w-4" />{" "}
                        <span className="text-base ss:inline-block hidden">
                          Export TXT
                        </span>
                      </Button>
                      <Button
                        onClick={() => navigate("/admin/properties/new")}
                        className="flex items-center gap-2"
                        size="sm"
                      >
                        <PlusCircleIcon className="h-4 w-4" />{" "}
                        <span className="text-base ss:inline-block hidden">
                          Add New Property
                        </span>
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <Typography className="mt-2">
                        Loading properties...
                      </Typography>
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography>No properties found.</Typography>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max table-auto text-left">
                        <thead>
                          <tr>
                            {[
                              "Title",
                              "Location",
                              "Price",
                              "Type",
                              "Sale Type",
                              "Actions",
                            ].map((head) => (
                              <th
                                key={head}
                                className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4"
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal leading-none opacity-70"
                                >
                                  {head}
                                </Typography>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {properties.map((property, index) => (
                            <tr
                              key={property.id}
                              className="even:bg-blue-gray-50/50"
                            >
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {property.title}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {property.location}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  ${property.price.toLocaleString()}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Chip
                                  value={property.property_type || "N/A"}
                                  size="sm"
                                  variant="ghost"
                                  color="blue-gray"
                                />
                              </td>
                              <td className="p-4">
                                <Chip
                                  value={property.sale_type || "N/A"}
                                  size="sm"
                                  variant="ghost"
                                  color="blue"
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <IconButton
                                    variant="text"
                                    color="blue"
                                    size="sm"
                                    onClick={() =>
                                      navigate(
                                        `/admin/properties/edit/${property.id}`
                                      )
                                    }
                                  >
                                    <PencilSquareIcon className="h-4 w-4" />
                                  </IconButton>
                                  <IconButton
                                    variant="text"
                                    color="red"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteProperty(property.id)
                                    }
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </IconButton>
                                  <IconButton
                                    variant="text"
                                    color="green"
                                    size="sm"
                                    onClick={() =>
                                      navigate(`/properties/${property.id}`)
                                    }
                                  >
                                    <HomeIcon className="h-4 w-4" />
                                  </IconButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="users" className="p-0">
                <div className="px-4">
                  <div className="flex justify-between items-center mb-6">
                    <Typography variant="h5" color="blue-gray">
                      User Management
                    </Typography>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <Typography className="mt-2">Loading users...</Typography>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography>No users found.</Typography>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max table-auto text-left">
                        <thead>
                          <tr>
                            {[
                              "Email",
                              "Admin Status",
                              "Created At",
                              "Actions",
                            ].map((head) => (
                              <th
                                key={head}
                                className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4"
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal leading-none opacity-70"
                                >
                                  {head}
                                </Typography>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <tr
                              key={user.id}
                              className="even:bg-blue-gray-50/50"
                            >
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {user.email}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Chip
                                  value={user.is_admin ? "Admin" : "User"}
                                  size="sm"
                                  variant="ghost"
                                  color={user.is_admin ? "amber" : "blue-gray"}
                                />
                              </td>
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {new Date(
                                    user.created_at
                                  ).toLocaleDateString()}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Button
                                  size="sm"
                                  color={user.is_admin ? "orange" : "blue"}
                                  variant="filled"
                                  onClick={() =>
                                    handleToggleAdminStatus(
                                      user.id,
                                      user.is_admin
                                    )
                                  }
                                >
                                  {user.is_admin
                                    ? "Remove Admin"
                                    : "Make Admin"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="chat" className="p-0">
                <div className="px-4">
                  <div className="mb-6">
                    <Typography variant="h5" color="blue-gray">
                      Chat Management
                    </Typography>
                    <Typography color="gray" className="mt-1">
                      Manage client conversations and provide support
                    </Typography>
                  </div>
                  <AdminChatInterface />
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminDashboard;
