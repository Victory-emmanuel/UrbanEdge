import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const DashboardHomePage = () => {
  const { profile, hasRole } = useAuth();
  const [stats, setStats] = useState({
    properties: 0,
    appointments: 0,
    messages: 0,
    documents: 0,
    clients: 0,
    agents: 0,
    transactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      
      try {
        const newStats = { ...stats };
        
        // Fetch stats based on user role
        if (hasRole('admin')) {
          // Admin sees all stats
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
          
          const { count: transactionsCount } = await supabase
            .from('transactions')
            .select('*', { count: 'exact', head: true });
          
          newStats.properties = propertiesCount || 0;
          newStats.appointments = appointmentsCount || 0;
          newStats.messages = messagesCount || 0;
          newStats.documents = documentsCount || 0;
          newStats.clients = clientsCount || 0;
          newStats.agents = agentsCount || 0;
          newStats.transactions = transactionsCount || 0;
        } else if (hasRole('agent')) {
          // Agent sees their properties, appointments, clients, and messages
          const { count: propertiesCount } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', profile.id);
          
          const { count: appointmentsCount } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', profile.id);
          
          const { count: messagesCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`);
          
          // Count unique clients from appointments
          const { data: clientsData } = await supabase
            .from('appointments')
            .select('client_id')
            .eq('agent_id', profile.id);
          
          const uniqueClients = new Set(clientsData?.map(item => item.client_id) || []);
          
          newStats.properties = propertiesCount || 0;
          newStats.appointments = appointmentsCount || 0;
          newStats.messages = messagesCount || 0;
          newStats.clients = uniqueClients.size;
        } else {
          // Client sees their saved properties, appointments, documents, and messages
          const { count: savedPropertiesCount } = await supabase
            .from('saved_properties')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);
          
          const { count: appointmentsCount } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', profile.id);
          
          const { count: messagesCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`);
          
          const { count: documentsCount } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);
          
          const { count: applicationsCount } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', profile.id);
          
          newStats.properties = savedPropertiesCount || 0;
          newStats.appointments = appointmentsCount || 0;
          newStats.messages = messagesCount || 0;
          newStats.documents = documentsCount || 0;
          newStats.applications = applicationsCount || 0;
        }
        
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (profile) {
      fetchDashboardStats();
    }
  }, [profile, hasRole]);

  // Get stat cards based on user role
  const getStatCards = () => {
    if (hasRole('admin')) {
      return [
        { title: 'Properties', value: stats.properties, icon: <BuildingOfficeIcon className="h-8 w-8" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' },
        { title: 'Agents', value: stats.agents, icon: <UserGroupIcon className="h-8 w-8" />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300' },
        { title: 'Clients', value: stats.clients, icon: <UserGroupIcon className="h-8 w-8" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' },
        { title: 'Appointments', value: stats.appointments, icon: <CalendarIcon className="h-8 w-8" />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300' },
        { title: 'Documents', value: stats.documents, icon: <DocumentTextIcon className="h-8 w-8" />, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300' },
        { title: 'Messages', value: stats.messages, icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' },
        { title: 'Transactions', value: stats.transactions, icon: <CurrencyDollarIcon className="h-8 w-8" />, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' },
      ];
    } else if (hasRole('agent')) {
      return [
        { title: 'Properties', value: stats.properties, icon: <BuildingOfficeIcon className="h-8 w-8" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' },
        { title: 'Clients', value: stats.clients, icon: <UserGroupIcon className="h-8 w-8" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' },
        { title: 'Appointments', value: stats.appointments, icon: <CalendarIcon className="h-8 w-8" />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300' },
        { title: 'Messages', value: stats.messages, icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' },
      ];
    } else {
      return [
        { title: 'Saved Properties', value: stats.properties, icon: <BuildingOfficeIcon className="h-8 w-8" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' },
        { title: 'Appointments', value: stats.appointments, icon: <CalendarIcon className="h-8 w-8" />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300' },
        { title: 'Documents', value: stats.documents, icon: <DocumentTextIcon className="h-8 w-8" />, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300' },
        { title: 'Applications', value: stats.applications || 0, icon: <DocumentTextIcon className="h-8 w-8" />, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' },
        { title: 'Messages', value: stats.messages, icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' },
      ];
    }
  };

  const statCards = getStatCards();

  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard | UrbanEdge Real Estate</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-brown-dark dark:text-beige-light">
          Welcome, {profile?.first_name}!
        </h1>
        <p className="text-brown dark:text-beige-medium mt-2">
          Here's an overview of your {hasRole('admin') ? 'platform' : hasRole('agent') ? 'agent' : 'client'} dashboard.
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
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
      
      {/* Additional dashboard content can be added here */}
    </DashboardLayout>
  );
};

export default DashboardHomePage;
