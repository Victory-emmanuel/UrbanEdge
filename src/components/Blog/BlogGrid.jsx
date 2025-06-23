import { motion } from "framer-motion";
import BlogCard from "../UI/BlogCard";

const BlogGrid = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-beige-medium dark:bg-brown animate-pulse rounded-lg h-96"
          ></div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-heading font-semibold text-brown-dark dark:text-beige-light mb-2">
          No articles found
        </h3>
        <p className="text-brown dark:text-beige-medium">
          Try adjusting your search or category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <BlogCard post={post} />
        </motion.div>
      ))}
    </div>
  );
};

export default BlogGrid;
