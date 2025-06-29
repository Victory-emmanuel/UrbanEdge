import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { favoritesService } from "../../../lib/favoritesService";
import { useAuth } from "../../../contexts/AuthContext";
import PropertyCard from "../../UI/PropertyCard";
import RecentProperties from "../Dashboard/RecentProperties";
import ChatInterface from "../../Client/Chat/ChatInterface";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  Spinner,
  Alert,
} from "@material-tailwind/react";

/**
 * Client Dashboard component for displaying user's favorite properties, recent properties, and chat
 */
const ClientDashboard = () => {
  const { user } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's favorite properties on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user's favorite properties
        const favoritesResult = await favoritesService.getUserFavorites();
        console.log('Favorites result:', favoritesResult);

        if (favoritesResult.error) {
          console.error('Favorites error:', favoritesResult.error);
          throw favoritesResult.error;
        }

        // Fetch favorites count
        const countResult = await favoritesService.getFavoritesCount();
        console.log('Count result:', countResult);

        if (countResult.error) {
          console.error('Count error:', countResult.error);
          throw countResult.error;
        }

        setFavoriteProperties(favoritesResult.data || []);
        setFavoritesCount(countResult.data || 0);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load your favorite properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Refresh favorites when a property is favorited/unfavorited
  const refreshFavorites = async () => {
    if (!user) return;

    try {
      const favoritesResult = await favoritesService.getUserFavorites();
      if (favoritesResult.error) throw favoritesResult.error;

      const countResult = await favoritesService.getFavoritesCount();
      if (countResult.error) throw countResult.error;

      setFavoriteProperties(favoritesResult.data || []);
      setFavoritesCount(countResult.data || 0);
    } catch (err) {
      console.error("Error refreshing favorites:", err);
    }
  };

  // Handle property card favorite toggle callback
  const handleFavoriteToggle = () => {
    // Refresh the favorites list when a property is favorited/unfavorited
    refreshFavorites();
  };

  // Expose test function to window for debugging
  useEffect(() => {
    window.testFavorites = async () => {
      console.log('=== MANUAL FAVORITES TEST ===');
      const result = await favoritesService.testAddFavorite();
      console.log('Manual test result:', result);
      return result;
    };

    return () => {
      delete window.testFavorites;
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="p-6 shadow-sm">
          <div className="flex justify-center items-center flex-col gap-4">
            <Spinner className="h-12 w-12" color="blue" />
            <Typography variant="h6" color="blue-gray">
              Loading your dashboard...
            </Typography>
          </div>
        </Card>
      </div>
    );
  }

  // Show authentication required message if user is not logged in
  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="p-8 shadow-sm">
          <CardBody className="flex flex-col items-center">
            <HeartIcon className="h-16 w-16 text-blue-500 mb-4" />
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Sign In to View Your Favorites
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="mb-6 opacity-70">
              Create an account or sign in to save your favorite properties and access them anytime.
            </Typography>
            <Link to="/auth">
              <Button size="lg" color="blue">
                Sign In / Sign Up
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-4 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Client Dashboard
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="opacity-70">
              Manage your favorite properties, view recent listings, and chat with our team
            </Typography>
          </div>
          <Link to="/properties">
            <Button className="flex items-center gap-2" color="blue">
              <MagnifyingGlassIcon className="h-5 w-5" />
              Browse Properties
            </Button>
          </Link>
        </div>
        </Card>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <Tabs value={activeTab} className="w-full">
          <TabsHeader>
            <Tab 
              value="overview" 
              onClick={() => setActiveTab("overview")}
              className={activeTab === "overview" ? "text-blue-500" : ""}
            >
              <div className="flex items-center gap-2">
                Overview
              </div>
            </Tab>
            <Tab 
              value="favorites" 
              onClick={() => setActiveTab("favorites")}
              className={activeTab === "favorites" ? "text-blue-500" : ""}
            >
              <div className="flex items-center gap-2">
                <HeartIcon className="h-4 w-4" />
                Favorites ({favoritesCount})
              </div>
            </Tab>
            <Tab 
              value="chat" 
              onClick={() => setActiveTab("chat")}
              className={activeTab === "chat" ? "text-blue-500" : ""}
            >
              <div className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Chat Support
              </div>
            </Tab>
          </TabsHeader>
        </Tabs>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Recent Properties Section */}
          <RecentProperties />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-red-50 p-3 mr-4">
                    <HeartIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <Typography variant="h4" color="blue-gray">{favoritesCount}</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="opacity-70">Favorite Properties</Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-50 p-3 mr-4">
                    <HomeIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <Typography variant="h4" color="blue-gray">4</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="opacity-70">Recent Properties</Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-50 p-3 mr-4">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <Typography variant="h4" color="blue-gray">24/7</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="opacity-70">Chat Support</Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "favorites" && (
        <div>
          <div className="mb-6">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              My Favorite Properties
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="opacity-70">
              {favoritesCount === 0
                ? "You haven't saved any properties yet"
                : `You have ${favoritesCount} favorite ${favoritesCount === 1 ? 'property' : 'properties'}`
              }
            </Typography>
          </div>

          {error && (
            <Alert color="red" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Favorite Properties Grid */}
          {favoriteProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavoriteToggle={handleFavoriteToggle}
                  showFavoriteButton={true}
                  linkTo={`/client/properties/${property.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Card className="p-8">
                <CardBody className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <HeartIcon className="h-12 w-12 text-gray-400" />
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    No Favorite Properties Yet
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="mb-6 max-w-md mx-auto opacity-70">
                    Start exploring our property listings and save your favorites by clicking the heart icon on any property card.
                  </Typography>
                  <Link to="/properties">
                    <Button className="flex items-center gap-2" color="blue">
                      <HomeIcon className="h-5 w-5" />
                      Explore Properties
                    </Button>
                  </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === "chat" && (
        <div>
          <div className="mb-6">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Chat Support
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="opacity-70">
              Get instant help from our real estate experts
            </Typography>
          </div>
          <ChatInterface />
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
