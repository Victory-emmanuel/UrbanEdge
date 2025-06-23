import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarIcon, UserIcon } from "@heroicons/react/24/outline";

const FeaturedPost = ({ post }) => {
  const { id, title, excerpt, imageUrl, author, date, category } = post;

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-brown-dark rounded-lg shadow-lg overflow-hidden mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="relative h-64 md:h-auto">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />

          {category && (
            <div className="absolute top-4 left-4 bg-taupe text-white px-3 py-1 text-sm rounded-md">
              {category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            <Link
              to={`/blog/${id}`}
              className="hover:text-taupe dark:hover:text-beige-medium transition-colors"
            >
              {title}
            </Link>
          </h2>

          {/* Meta */}
          <div className="flex items-center text-sm text-brown dark:text-beige-medium mb-4 space-x-4">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{author}</span>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-brown dark:text-beige-medium mb-6 flex-grow">
            {excerpt}
          </p>

          {/* Read More Link */}
          <Link
            to={`/blog/${id}`}
            className="text-taupe hover:text-brown dark:hover:text-beige-light font-medium transition-colors inline-flex items-center"
          >
            Read More
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedPost;
