import { motion } from "framer-motion";
import SectionHeading from "../UI/SectionHeading";
import BlogCard from "../UI/BlogCard";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "10 Tips for First-Time Home Buyers in 2023",
    excerpt:
      "Navigating the real estate market as a first-time buyer can be challenging. Here are our top tips to help you make informed decisions.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    author: "Emma Wilson",
    date: "2023-06-15",
    category: "Buying",
  },
  {
    id: 2,
    title: "Interior Design Trends That Increase Property Value",
    excerpt:
      "Discover which interior design choices can significantly boost your property's market value and appeal to potential buyers.",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    author: "Marcus Chen",
    date: "2023-05-28",
    category: "Design",
  },
];

const BlogTeaser = () => {
  return (
    <section className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Real Estate Insights"
          subtitle="Stay informed with the latest market trends, investment strategies, and home improvement tips from our expert team."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 mt-8 xs:mt-10 sm:mt-12">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 xs:mt-10 sm:mt-12">
          <a
            href="/blog"
            className="btn-outline text-xs xs:text-sm sm:text-base"
          >
            Explore All Articles
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogTeaser;
