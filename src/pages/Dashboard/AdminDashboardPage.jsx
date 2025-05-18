import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import AuthDebugger from '../../components/Debug/AuthDebugger';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';
import { checkAdminPrivileges } from '../../lib/adminUtils';

const AdminDashboardPage = () => {
  const { profile, hasRole, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    properties: 0,
    appointments: 0,
    messages: 0,
    documents: 0,
    clients: 0,
    agents: 0,
    transactions: 0,
    admins: 0
  });
  const [loading, setLoading] = useState(true);
  const [showDebugger, setShowDebugger] = useState(false);

  // Verify admin access
  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!user) {
        console.log("No user found, redirecting to admin login");
        navigate('/admin-login');
        return;
      }

      const isAdmin = await checkAdminPrivileges(user.id);

      if (!isAdmin) {
        console.log("User is not an admin, redirecting to unauthorized page");
        navigate('/unauthorized');
      }
    };

    verifyAdminAccess();
  }, [user, navigate]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);

      try {
        const newStats = { ...stats };

        // Fetch admin-specific stats
        const { count: propertiesCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        const { count: appointmentsCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true });

        const { count: messagesCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true });

        const { count: documentsCount } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true });

        const { count: clientsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'client');

        const { count: agentsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'agent');

        const { count: adminsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');

        const { count: transactionsCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true });

        newStats.properties = propertiesCount || 0;
        newStats.appointments = appointmentsCount || 0;
        newStats.messages = messagesCount || 0;
        newStats.documents = documentsCount || 0;
        newStats.clients = clientsCount || 0;
        newStats.agents = agentsCount || 0;
        newStats.admins = adminsCount || 0;
        newStats.transactions = transactionsCount || 0;

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile && hasRole('admin')) {
      fetchDashboardStats();
    }
  }, [profile, hasRole]);

  // Admin stat cards
  const statCards = [
    { title: 'Properties', value: stats.properties, icon: <BuildingOfficeIcon className="h-8 w-8" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' },
    { title: 'Agents', value: stats.agents, icon: <UserGroupIcon className="h-8 w-8" />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300' },
    { title: 'Clients', value: stats.clients, icon: <UserGroupIcon className="h-8 w-8" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' },
    { title: 'Admins', value: stats.admins, icon: <ShieldCheckIcon className="h-8 w-8" />, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300' },
    { title: 'Appointments', value: stats.appointments, icon: <CalendarIcon className="h-8 w-8" />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300' },
    { title: 'Documents', value: stats.documents, icon: <DocumentTextIcon className="h-8 w-8" />, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300' },
    { title: 'Messages', value: stats.messages, icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' },
    { title: 'Transactions', value: stats.transactions, icon: <CurrencyDollarIcon className="h-8 w-8" />, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' },
  ];

  return (
    <DashboardLayout>
      <Helmet>
        <title>Admin Dashboard | UrbanEdge Real Estate</title>
      </Helmet>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-brown-dark dark:text-beige-light">
            Admin Dashboard
          </h1>
          <p className="text-brown dark:text-beige-medium mt-2">
            Welcome, {profile?.first_name}! Here's an overview of your platform.
          </p>
        </div>
        <button
          onClick={() => setShowDebugger(!showDebugger)}
          className="px-4 py-2 bg-taupe text-white rounded-md hover:bg-brown-dark transition-colors"
        >
          {showDebugger ? 'Hide' : 'Show'} Debugger
        </button>
      </div>

      {showDebugger && <AuthDebugger />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-brown-dark rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-8 w-8 bg-beige-medium dark:bg-brown rounded-full mb-4"></div>
              <div className="h-6 w-24 bg-beige-medium dark:bg-brown rounded mb-2"></div>
              <div className="h-8 w-16 bg-beige-medium dark:bg-brown rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-brown-dark rounded-lg shadow-md p-6"
            >
              <div className={`p-3 rounded-full w-fit ${card.color} mb-4`}>
                {card.icon}
              </div>
              <h2 className="text-lg font-medium text-brown-dark dark:text-beige-light mb-2">
                {card.title}
              </h2>
              <p className="text-3xl font-heading font-bold text-brown-dark dark:text-beige-light">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white dark:bg-brown-dark rounded-lg shadow-md p-6">
        <h2 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
          Admin Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/dashboard/user-management"
            className="flex items-center p-4 bg-beige-light dark:bg-brown hover:bg-beige-medium dark:hover:bg-brown-dark rounded-md transition-colors"
          >
            <ShieldCheckIcon className="h-6 w-6 text-taupe mr-3" />
            <span className="text-brown-dark dark:text-beige-light">User Management</span>
          </a>
          <a
            href="/dashboard/properties"
            className="flex items-center p-4 bg-beige-light dark:bg-brown hover:bg-beige-medium dark:hover:bg-brown-dark rounded-md transition-colors"
          >
            <BuildingOfficeIcon className="h-6 w-6 text-taupe mr-3" />
            <span className="text-brown-dark dark:text-beige-light">Manage Properties</span>
          </a>
          <a
            href="/dashboard/agents"
            className="flex items-center p-4 bg-beige-light dark:bg-brown hover:bg-beige-medium dark:hover:bg-brown-dark rounded-md transition-colors"
          >
            <UserGroupIcon className="h-6 w-6 text-taupe mr-3" />
            <span className="text-brown-dark dark:text-beige-light">Manage Agents</span>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
