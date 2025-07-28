import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import {
  Navbar as MTNavbar,
  Typography,
  Button,
  IconButton,
  Collapse,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
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
    <MTNavbar
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-brown-dark/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
      fullWidth
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Typography
              variant="h4"
              className="font-heading font-bold text-brown-dark dark:text-beige-light"
            >
              UrbanEdge
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Typography
                key={link.name}
                as={Link}
                to={link.path}
                variant="paragraph"
                className={`font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-taupe dark:text-beige-medium"
                    : "text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium"
                }`}
              >
                {link.name}
              </Typography>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Button
                    variant="text"
                    className="flex items-center gap-2 font-medium text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium transition-colors normal-case"
                  >
                    <span>My Account</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
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
                  </Button>
                </MenuHandler>
                <MenuList className="bg-white dark:bg-brown-dark border-none shadow-lg">
                  <MenuItem className="px-4 py-2 text-sm text-brown dark:text-beige-medium border-b border-beige-medium/20 dark:border-brown/20 hover:bg-transparent">
                    {user.email}
                  </MenuItem>

                  {isAdmin && (
                    <MenuItem>
                      <Typography
                        as={Link}
                        to="/admin/dashboard"
                        variant="small"
                        className="font-medium text-brown dark:text-beige-medium"
                      >
                        Admin Dashboard
                      </Typography>
                    </MenuItem>
                  )}

                  <MenuItem>
                    <Typography
                      as={Link}
                      to="/client/dashboard"
                      variant="small"
                      className="font-medium text-brown dark:text-beige-medium"
                    >
                      Dashboard
                    </Typography>
                  </MenuItem>

                  <MenuItem onClick={handleSignOut}>
                    <Typography
                      variant="small"
                      className="font-medium text-red-600"
                    >
                      Sign Out
                    </Typography>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 font-medium text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-taupe hover:bg-taupe/90 text-white rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <IconButton
            variant="text"
            className="md:hidden text-brown-dark dark:text-beige-light ml-auto"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </IconButton>
        </div>
      </div>

      {/* Mobile Menu */}
      <Collapse
        open={isOpen}
        className="md:hidden bg-white dark:bg-brown-dark shadow-lg"
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Typography
              key={link.name}
              as={Link}
              to={link.path}
              variant="paragraph"
              className={`py-2 font-medium ${
                location.pathname === link.path
                  ? "text-taupe dark:text-beige-medium"
                  : "text-brown-dark dark:text-beige-light"
              }`}
            >
              {link.name}
            </Typography>
          ))}

          <div className="flex flex-col space-y-3 pt-4 border-t border-beige-medium dark:border-brown">
            {user ? (
              <>
                <Typography
                  variant="small"
                  className="py-2 text-brown dark:text-beige-medium"
                >
                  {user.email}
                </Typography>

                {isAdmin && (
                  <Typography
                    as={Link}
                    to="/admin/dashboard"
                    variant="paragraph"
                    className="py-2 font-medium text-brown-dark dark:text-beige-light"
                  >
                    Admin Dashboard
                  </Typography>
                )}

                <Typography
                  as={Link}
                  to="/client/dashboard"
                  variant="paragraph"
                  className="py-2 font-medium text-brown-dark dark:text-beige-light"
                >
                  Dashboard
                </Typography>

                <Button
                  variant="text"
                  onClick={handleSignOut}
                  className="py-2 justify-start font-medium text-red-600 dark:text-red-400 normal-case"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 font-medium text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-taupe hover:bg-taupe/90 text-white rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-beige-medium dark:border-brown"></div>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
};

export default Navbar;
