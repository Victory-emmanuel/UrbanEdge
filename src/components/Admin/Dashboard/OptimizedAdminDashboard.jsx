import { useState, useEffect, Suspense, lazy } from \"react\";
import { useNavigate } from \"react-router-dom\";
import { useAuth } from \"../../../contexts/AuthContext\";
import { SimpleMotion } from \"../../../utils/lightAnimations\";
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
} from \"@heroicons/react/24/outline\";

// Lazy load heavy admin components
const AdminPropertyManager = lazy(() => import('./AdminPropertyManager'));
const AdminUserManager = lazy(() => import('./AdminUserManager'));
const AdminChatInterface = lazy(() => import('../Chat/AdminChatInterface'));
const AdminAnalytics = lazy(() => import('./AdminAnalytics'));

// Loading component for admin sections
const AdminSectionLoader = ({ section }) => (
  <div className=\"min-h-64 flex items-center justify-center\">
    <div className=\"text-center\">
      <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-taupe mx-auto mb-4\"></div>
      <p className=\"text-brown-dark dark:text-beige-light\">Loading {section}...</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(\"properties\");

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      navigate(\"/\");
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) {
    return (
      <div className=\"min-h-screen flex items-center justify-center\">
        <div className=\"text-center\">
          <h2 className=\"text-2xl font-bold text-brown-dark dark:text-beige-light mb-4\">
            Access Denied
          </h2>
          <p className=\"text-brown dark:text-beige-medium\">
            You need administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: \"properties\",
      label: \"Properties\",
      icon: HomeIcon,
      component: AdminPropertyManager,
    },
    {
      id: \"users\",
      label: \"Users\",
      icon: UserIcon,
      component: AdminUserManager,
    },
    {
      id: \"chat\",
      label: \"Chat Support\",
      icon: ChatBubbleLeftRightIcon,
      component: AdminChatInterface,
    },
    {
      id: \"analytics\",
      label: \"Analytics\",
      icon: ChartBarIcon,
      component: AdminAnalytics,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className=\"min-h-screen bg-beige-light dark:bg-brown\">
      <div className=\"container mx-auto px-4 py-8\">
        <SimpleMotion className=\"mb-8\">
          <h1 className=\"text-3xl font-bold text-brown-dark dark:text-beige-light mb-2\">
            Admin Dashboard
          </h1>
          <p className=\"text-brown dark:text-beige-medium\">
            Manage properties, users, and site content
          </p>
        </SimpleMotion>

        {/* Tab Navigation */}
        <SimpleMotion delay={0.1} className=\"mb-8\">
          <div className=\"bg-white dark:bg-brown-dark rounded-lg shadow-sm border border-gray-200 dark:border-brown p-2\">
            <nav className=\"flex space-x-2\">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === tab.id
                        ? \"bg-taupe text-white\"
                        : \"text-brown-dark dark:text-beige-light hover:bg-beige-light dark:hover:bg-brown\"
                    }`}
                  >
                    <Icon className=\"h-5 w-5\" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </SimpleMotion>

        {/* Tab Content */}
        <SimpleMotion delay={0.2} className=\"bg-white dark:bg-brown-dark rounded-lg shadow-sm border border-gray-200 dark:border-brown\">
          <Suspense fallback={<AdminSectionLoader section={activeTabData?.label} />}>
            {ActiveComponent && <ActiveComponent />}
          </Suspense>
        </SimpleMotion>
      </div>
    </div>
  );
};

export default AdminDashboard;", "original_text": ""}]