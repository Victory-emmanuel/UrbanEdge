import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/supabase';
import ThemeToggle from '../Universal/ThemeToggle';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    // Common links for all roles
    const commonLinks = [
      { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="h-5 w-5" /> },
      { name: 'Profile', path: '/dashboard/profile', icon: <UserIcon className="h-5 w-5" /> },
    ];

    // Admin-specific links
    const adminLinks = [
      { name: 'Properties', path: '/dashboard/properties', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
      { name: 'Agents', path: '/dashboard/agents', icon: <UserGroupIcon className="h-5 w-5" /> },
      { name: 'Clients', path: '/dashboard/clients', icon: <UserGroupIcon className="h-5 w-5" /> },
      { name: 'Analytics', path: '/dashboard/analytics', icon: <ChartBarIcon className="h-5 w-5" /> },
      { name: 'User Management', path: '/dashboard/user-management', icon: <ShieldCheckIcon className="h-5 w-5" /> },
      { name: 'Settings', path: '/dashboard/settings', icon: <CogIcon className="h-5 w-5" /> },
    ];

    // Agent-specific links
    const agentLinks = [
      { name: 'Properties', path: '/dashboard/properties', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
      { name: 'Appointments', path: '/dashboard/appointments', icon: <CalendarIcon className="h-5 w-5" /> },
      { name: 'Clients', path: '/dashboard/clients', icon: <UserGroupIcon className="h-5 w-5" /> },
      { name: 'Messages', path: '/dashboard/messages', icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
    ];

    // Client-specific links
    const clientLinks = [
      { name: 'Saved Properties', path: '/dashboard/saved-properties', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
      { name: 'Appointments', path: '/dashboard/appointments', icon: <CalendarIcon className="h-5 w-5" /> },
      { name: 'Documents', path: '/dashboard/documents', icon: <DocumentTextIcon className="h-5 w-5" /> },
      { name: 'Applications', path: '/dashboard/applications', icon: <DocumentTextIcon className="h-5 w-5" /> },
      { name: 'Messages', path: '/dashboard/messages', icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
    ];

    if (hasRole('admin')) {
      return [...commonLinks, ...adminLinks];
    } else if (hasRole('agent')) {
      return [...commonLinks, ...agentLinks];
    } else {
      return [...commonLinks, ...clientLinks];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-beige-light dark:bg-brown">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white dark:bg-brown-dark shadow-md text-brown-dark dark:text-beige-light"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="fixed inset-0 bg-brown-dark/50" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-brown-dark shadow-lg flex flex-col">
              {renderSidebarContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:bg-white lg:dark:bg-brown-dark lg:shadow-lg lg:flex-col">
        {renderSidebarContent()}
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );

  function renderSidebarContent() {
    return (
      <>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-beige-medium dark:border-brown">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light">
              UrbanEdge
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-beige-medium dark:border-brown">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-taupe text-white flex items-center justify-center font-medium">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div className="ml-3">
              <p className="font-medium text-brown-dark dark:text-beige-light">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-brown dark:text-beige-medium capitalize">
                {profile?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? "bg-taupe text-white"
                      : "text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown hover:text-brown-dark dark:hover:text-beige-light"
                  }`}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-beige-medium dark:border-brown">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="text-sm text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium transition-colors"
            >
              View Website
            </Link>
            <ThemeToggle />
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-2 rounded-md text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </>
    );
  }
};

export default DashboardLayout;
