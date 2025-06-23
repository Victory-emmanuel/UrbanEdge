import { motion } from "framer-motion";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-taupe text-white"
              : "bg-beige-light dark:bg-brown text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown-dark"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-taupe text-white"
                : "bg-beige-light dark:bg-brown text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown-dark"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
