import { Link } from "react-router-dom";
import { CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const BlogCard = ({ post }) => {
  const { id, title, excerpt, imageUrl, author, date, category } = post;

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card group h-full flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-40 xs:h-48 sm:h-56">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-2 xs:top-4 left-2 xs:left-4 bg-taupe text-white px-2 xs:px-3 py-1 text-xs xs:text-sm rounded-md">
            {category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 xs:p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-heading font-bold text-base xs:text-lg sm:text-xl mb-1 xs:mb-2 text-brown-dark dark:text-beige-light group-hover:text-taupe dark:group-hover:text-beige-medium transition-colors line-clamp-2">
          <Link to={`/blog/${id}`}>{title}</Link>
        </h3>

        {/* Meta */}
        <div className="flex items-center text-xs xs:text-sm text-brown dark:text-beige-medium mb-2 xs:mb-3 space-x-2 xs:space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />

            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <UserIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />

            <span>{author}</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xs xs:text-sm sm:text-base text-brown dark:text-beige-medium mb-3 xs:mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p>

        {/* Read More Link */}
        <Link
          to={`/blog/${id}`}
          className="text-taupe hover:text-brown dark:hover:text-beige-light font-medium transition-colors inline-flex items-center text-xs xs:text-sm sm:text-base"
        >
          Read More
          <svg
            className="w-3 h-3 xs:w-4 xs:h-4 ml-1 xs:ml-2"
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
  );
};

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
};

export default BlogCard;
