import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import HeroSection from "../components/Blog/HeroSection";
import CategoryFilter from "../components/Blog/CategoryFilter";
import FeaturedPost from "../components/Blog/FeaturedPost";
import BlogGrid from "../components/Blog/BlogGrid";
import Pagination from "../components/Blog/Pagination";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "10 Tips for First-Time Home Buyers in 2023",
    excerpt:
      "Navigating the real estate market as a first-time buyer can be challenging. Here are our top tips to help you make informed decisions and find your dream home.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    author: "Emma Wilson",
    date: "2023-06-15",
    category: "Buying",
    featured: true,
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
  {
    id: 3,
    title: "The Impact of Rising Interest Rates on the Housing Market",
    excerpt:
      "An analysis of how changing interest rates affect property prices, buyer behavior, and investment strategies in today's real estate landscape.",
    imageUrl:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    author: "Sarah Johnson",
    date: "2023-05-15",
    category: "Market Trends",
  },
  {
    id: 4,
    title: "Sustainable Home Features That Buyers Love",
    excerpt:
      "Eco-friendly homes are increasingly popular. Learn which sustainable features are most attractive to today's environmentally conscious buyers.",
    imageUrl:
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    author: "David Thompson",
    date: "2023-04-22",
    category: "Sustainability",
  },
  {
    id: 5,
    title: "How to Prepare Your Home for a Successful Sale",
    excerpt:
      "Maximize your property's appeal and selling price with these expert staging and preparation tips from our top-selling agents.",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    author: "Jennifer Lee",
    date: "2023-04-10",
    category: "Selling",
  },
  {
    id: 6,
    title: "Commercial Real Estate Opportunities in Emerging Markets",
    excerpt:
      "Exploring lucrative investment possibilities in developing urban centers and how to identify properties with high growth potential.",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    author: "Michael Chen",
    date: "2023-03-28",
    category: "Investment",
  },
  {
    id: 7,
    title: "The Pros and Cons of Different Mortgage Types",
    excerpt:
      "A comprehensive guide to fixed-rate, adjustable-rate, and other mortgage options to help you choose the best financing for your situation.",
    imageUrl:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    author: "Emma Wilson",
    date: "2023-03-15",
    category: "Financing",
  },
  {
    id: 8,
    title: "Navigating Rental Property Management: A Beginner's Guide",
    excerpt:
      "Essential tips for new landlords on tenant screening, maintenance planning, and maximizing returns on your rental investments.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    author: "David Thompson",
    date: "2023-02-28",
    category: "Property Management",
  },
  {
    id: 9,
    title: "Smart Home Technology: What's Worth the Investment",
    excerpt:
      "From security systems to energy management, discover which smart home features provide the best return on investment and lifestyle benefits.",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055e2e28ed1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    author: "Sarah Johnson",
    date: "2023-02-15",
    category: "Technology",
  },
];

// Extract unique categories
const categories = [...new Set(blogPosts.map((post) => post.category))];

const BlogPage = () => {
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Find featured post
  const featuredPost = blogPosts.find((post) => post.featured);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filtered = [...blogPosts];

      // Apply category filter
      if (activeCategory) {
        filtered = filtered.filter((post) => post.category === activeCategory);
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query),
        );
      }

      // Remove featured post from regular grid if it's included in filtered results
      if (featuredPost && !activeCategory && !searchQuery) {
        filtered = filtered.filter((post) => post.id !== featuredPost.id);
      }

      setFilteredPosts(filtered);
      setCurrentPage(1); // Reset to first page when filters change
      setLoading(false);
    }, 500);
  }, [activeCategory, searchQuery]);

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of posts section
    window.scrollTo({
      top: document.getElementById("posts-section").offsetTop - 100,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Explore real estate insights, market trends, and expert advice on buying, selling, and investing in properties. Stay informed with UrbanEdge's real estate blog."
        />
      </Helmet>

      <HeroSection onSearch={handleSearch} />

      <section
        className="py-16 bg-beige-light dark:bg-brown"
        id="posts-section"
      >
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Featured Post (only show if no filters are applied) */}
          {featuredPost && !activeCategory && !searchQuery && (
            <FeaturedPost post={featuredPost} />
          )}

          {/* Blog Grid */}
          <BlogGrid posts={currentPosts} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
