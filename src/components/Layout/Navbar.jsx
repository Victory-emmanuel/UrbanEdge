import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../Universal/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
];

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-brown-dark/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light">
              UrbanEdge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-taupe dark:text-beige-medium"
                    : "text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 font-medium text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium transition-colors"
                >
                  <span>My Account</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brown-dark rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-brown dark:text-beige-medium border-b border-beige-medium/20 dark:border-brown/20">
                      {user.email}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-brown dark:text-beige-medium hover:bg-beige-light/20 dark:hover:bg-brown/20"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/client/dashboard"
                      className="block px-4 py-2 text-sm text-brown dark:text-beige-medium hover:bg-beige-light/20 dark:hover:bg-brown/20"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-beige-light/20 dark:hover:bg-brown/20"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
            <ThemeToggle className="shadow-md" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-brown-dark dark:text-beige-light"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-brown-dark shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`py-2 font-medium ${
                  location.pathname === link.path
                    ? "text-taupe dark:text-beige-medium"
                    : "text-brown-dark dark:text-beige-light"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-beige-medium dark:border-brown">
              {user ? (
                <>
                  <div className="py-2 text-sm text-brown dark:text-beige-medium">
                    {user.email}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="py-2 font-medium text-brown-dark dark:text-beige-light"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/client/dashboard"
                    className="py-2 font-medium text-brown-dark dark:text-beige-light"
                  >
                   Dashboard
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="py-2 text-left font-medium text-red-600 dark:text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="py-2 font-medium text-brown-dark dark:text-beige-light"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-center">
                    Register
                  </Link>
                </>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-beige-medium dark:border-brown">
                <ThemeToggle className="shadow-md" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
