import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import BlogPostContent from "../components/Blog/BlogPost/BlogPostContent";
import AuthorBio from "../components/Blog/BlogPost/AuthorBio";
import RelatedPosts from "../components/Blog/BlogPost/RelatedPosts";

// Sample blog post data
const blogPost = {
  id: 1,
  title: "10 Tips for First-Time Home Buyers in 2023",
  excerpt:
    "Navigating the real estate market as a first-time buyer can be challenging. Here are our top tips to help you make informed decisions and find your dream home.",
  content: `
    <h2>Introduction</h2>
    <p>Buying your first home is an exciting milestone, but it can also be overwhelming. The real estate market in 2023 presents unique challenges and opportunities for first-time buyers. With rising interest rates, changing inventory levels, and evolving market dynamics, it's crucial to be well-prepared before diving into homeownership.</p>
    
    <p>At UrbanEdge, we've helped hundreds of first-time buyers navigate the complexities of the real estate market. Based on our experience, we've compiled these essential tips to help you make informed decisions and find your dream home.</p>
    
    <h2>1. Get Your Finances in Order</h2>
    <p>Before you start browsing listings, take a thorough look at your financial situation. This includes:</p>
    <ul>
      <li>Checking your credit score and addressing any issues</li>
      <li>Calculating your debt-to-income ratio</li>
      <li>Saving for a down payment (aim for at least 20% to avoid PMI)</li>
      <li>Setting aside funds for closing costs (typically 2-5% of the loan amount)</li>
      <li>Creating a budget for ongoing homeownership expenses</li>
    </ul>
    
    <h2>2. Get Pre-approved for a Mortgage</h2>
    <p>A mortgage pre-approval gives you a clear understanding of how much house you can afford and shows sellers that you're a serious buyer. Shop around with different lenders to find the best rates and terms. Remember that pre-approval is different from pre-qualification; the former involves a more thorough financial check and carries more weight with sellers.</p>
    
    <h2>3. Define Your Must-Haves vs. Nice-to-Haves</h2>
    <p>Create two lists: one for features you absolutely need in a home (e.g., minimum number of bedrooms, specific school district) and another for features you'd like but could live without. This will help you focus your search and make decisions when comparing properties.</p>
    
    <h2>4. Research Neighborhoods Thoroughly</h2>
    <p>The location of your home affects not only your daily life but also the property's long-term value. Consider factors such as:</p>
    <ul>
      <li>Commute times to work</li>
      <li>School quality (even if you don't have children, this affects resale value)</li>
      <li>Access to amenities like grocery stores, restaurants, and parks</li>
      <li>Crime rates and safety</li>
      <li>Future development plans for the area</li>
      <li>Property tax rates</li>
    </ul>
    
    <h2>5. Look Beyond the Surface</h2>
    <p>When viewing homes, look past cosmetic issues like outdated paint colors or fixtures. These are relatively easy and inexpensive to change. Instead, focus on the home's structural integrity, layout, and potential for future modifications. Consider bringing a contractor along for a second viewing of homes you're serious about.</p>
    
    <h2>6. Budget for Additional Costs</h2>
    <p>The purchase price is just the beginning. Be prepared for additional costs such as:</p>
    <ul>
      <li>Home inspection and appraisal fees</li>
      <li>Moving expenses</li>
      <li>Immediate repairs or renovations</li>
      <li>New furniture and appliances</li>
      <li>Homeowners association (HOA) fees if applicable</li>
      <li>Utilities, which may be higher than in a rental</li>
    </ul>
    
    <h2>7. Don't Skip the Home Inspection</h2>
    <p>A thorough home inspection can reveal issues that aren't visible during a showing, potentially saving you thousands in unexpected repairs. Never waive this contingency, even in a competitive market. If the inspection reveals significant problems, you can negotiate repairs, a price reduction, or even walk away if necessary.</p>
    
    <h2>8. Consider Future Resale Value</h2>
    <p>Even as a first-time buyer, think about the home's potential resale value. Most people stay in their first home for 5-7 years, not forever. Consider factors that might affect future marketability, such as the home's layout, the neighborhood's trajectory, and proximity to amenities.</p>
    
    <h2>9. Be Patient and Flexible</h2>
    <p>Finding the right home takes time, especially in today's market. Be prepared to make multiple offers and face potential disappointments. Stay flexible and open to properties that might not check every box but offer good value and potential.</p>
    
    <h2>10. Work with an Experienced Real Estate Agent</h2>
    <p>A knowledgeable agent who specializes in working with first-time buyers can be invaluable. They can help you navigate the process, negotiate effectively, and avoid common pitfalls. At UrbanEdge, our agents are specifically trained to guide first-time buyers through every step of the homebuying journey.</p>
    
    <h2>Conclusion</h2>
    <p>Buying your first home is a significant financial and emotional investment. By following these tips and working with experienced professionals, you can navigate the process with confidence and find a home that meets your needs now and in the future.</p>
    
    <p>If you're ready to start your homebuying journey, contact UrbanEdge today. Our team of experts is ready to help you find your perfect first home.</p>
  `,
  imageUrl:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
  author: {
    name: "Emma Wilson",
    role: "Senior Real Estate Advisor",
    bio: "Emma has been helping first-time homebuyers navigate the real estate market for over 10 years. She specializes in urban properties and is passionate about educating clients on making smart investment decisions.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  date: "2023-06-15",
  category: "Buying",
  readTime: 8,
};

// Sample related posts
const relatedPosts = [
  {
    id: 2,
    title: "Interior Design Trends That Increase Property Value",
    excerpt:
      "Discover which interior design choices can significantly boost your property's market value and appeal to potential buyers.",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    category: "Design",
  },
  {
    id: 5,
    title: "How to Prepare Your Home for a Successful Sale",
    excerpt:
      "Maximize your property's appeal and selling price with these expert staging and preparation tips from our top-selling agents.",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Selling",
  },
  {
    id: 7,
    title: "The Pros and Cons of Different Mortgage Types",
    excerpt:
      "A comprehensive guide to fixed-rate, adjustable-rate, and other mortgage options to help you choose the best financing for your situation.",
    imageUrl:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    category: "Financing",
  },
];

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch post by ID
    setLoading(true);
    setTimeout(() => {
      // In a real app, you would fetch the post with the matching ID
      setPost(blogPost);
      setLoading(false);

      // Scroll to top when post loads
      window.scrollTo(0, 0);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-beige-medium dark:bg-brown rounded w-3/4 mb-4"></div>
          <div className="h-96 bg-beige-medium dark:bg-brown rounded mb-8"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-full mb-4"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-full mb-4"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-3/4 mb-8"></div>
          <div className="h-8 bg-beige-medium dark:bg-brown rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-full mb-4"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-full mb-4"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
          Article Not Found
        </h2>
        <p className="text-brown dark:text-beige-medium mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <a href="/blog" className="btn-primary">
          Back to Blog
        </a>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | UrbanEdge Real Estate Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="py-12 bg-beige-light dark:bg-brown">
        <div className="container mx-auto px-4">
          {/* Blog Post Content */}
          <BlogPostContent post={post} />

          {/* Author Bio */}
          <AuthorBio author={post.author} />

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
