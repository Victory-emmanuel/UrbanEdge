# UrbanEdge Codebase Index

## 1. Directory Structure

```
UrbanEdge/
├── public/                     # Static assets
│   └── favicon.png             # Site favicon
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── About/              # About page components
│   │   │   ├── AwardsSection.jsx
│   │   │   ├── CTASection.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── StorySection.jsx
│   │   │   ├── TeamSection.jsx
│   │   │   └── ValuesSection.jsx
│   │   ├── Blog/               # Blog page components
│   │   │   ├── BlogGrid.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── FeaturedPost.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   └── Pagination.jsx
│   │   ├── Home/               # Home page components
│   │   │   ├── BlogTeaser.jsx
│   │   │   ├── CTASection.jsx
│   │   │   ├── FeaturedProperties.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── ValueProposition.jsx
│   │   ├── Layout/             # Layout components
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   ├── Properties/         # Property-related components
│   │   │   ├── PropertyFilters.jsx
│   │   │   ├── PropertyGrid.jsx
│   │   │   ├── PropertyMap.jsx
│   │   │   ├── PropertySort.jsx
│   │   │   └── PropertyToggleView.jsx
│   │   ├── Services/           # Service page components
│   │   │   ├── CTASection.jsx
│   │   │   ├── FAQSection.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ProcessSection.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── ServicesGrid.jsx
│   │   │   └── TestimonialsSection.jsx
│   │   ├── UI/                 # Reusable UI components
│   │   │   ├── BlogCard.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── ChatbotWidget.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── SectionHeading.jsx
│   │   └── Universal/          # Universal components (like ThemeToggle)
│   │       └── ThemeToggle.jsx
│   ├── pages/                  # Page components
│   │   ├── AboutPage.jsx       # About page
│   │   ├── BlogPage.jsx        # Blog listing page
│   │   ├── BlogPostPage.jsx    # Individual blog post page
│   │   ├── ContactPage.jsx     # Contact page
│   │   ├── HomePage.jsx        # Home/landing page
│   │   ├── PropertiesPage.jsx  # Property listings page
│   │   ├── PropertyDetailPage.jsx # Individual property page
│   │   └── ServicesPage.jsx    # Services page
│   ├── App.jsx                 # Main application component with routes
│   ├── index.css               # Global styles and Tailwind directives
│   └── main.jsx                # Application entry point
├── .gitignore                  # Git ignore file
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template with font imports
├── package-lock.json           # NPM package lock
├── package.json                # NPM package configuration
├── README.md                   # Project README
├── tailwind.config.js          # Tailwind CSS configuration with custom theme
├── vercel.json                 # Vercel deployment configuration
└── vite.config.js              # Vite configuration
```

## 2. Key Components and Their Purposes

### Layout Components
- **Layout.jsx**: Main layout wrapper that includes Navbar and Footer, handles scroll-to-top on route change
- **Navbar.jsx**: Navigation bar with responsive mobile menu, theme toggle, and scroll-based styling
- **Footer.jsx**: Site footer with navigation links, social media icons, and copyright information

### Universal Components
- **ThemeToggle.jsx**: Dark/light mode toggle using react-toggle-dark-mode with localStorage persistence and system preference detection

### UI Components
- **SectionHeading.jsx**: Reusable section heading with title, subtitle, and animation using framer-motion
- **PropertyCard.jsx**: Card component for displaying property listings with image, details, and favorite functionality
- **BlogCard.jsx**: Card component for displaying blog posts with image, title, excerpt, and category
- **SearchBar.jsx**: Advanced search input for properties with location, price range, and property type filters
- **ChatbotWidget.jsx**: Floating chatbot widget with expandable interface and message history

### Home Page Components
- **HeroSection.jsx**: Hero banner with background image, headline, and search functionality
- **FeaturedProperties.jsx**: Horizontal scrollable list of featured property cards
- **ValueProposition.jsx**: Grid of value proposition cards highlighting UrbanEdge benefits
- **HowItWorks.jsx**: Step-by-step process explanation with alternating layout
- **Testimonials.jsx**: Client testimonials carousel with avatar and quote
- **BlogTeaser.jsx**: Preview of recent blog posts to drive traffic to the blog
- **CTASection.jsx**: Call-to-action section with background and button

### Property Components
- **PropertyFilters.jsx**: Advanced filtering interface for property search with multiple criteria
- **PropertyGrid.jsx**: Responsive grid layout for property cards with loading states
- **PropertyMap.jsx**: Interactive map view of property locations
- **PropertySort.jsx**: Sorting options for property listings (price, date, etc.)
- **PropertyToggleView.jsx**: Toggle between grid and map views

### Service Components
- **ServicesGrid.jsx**: Grid layout of service cards with icons and descriptions
- **ServiceCard.jsx**: Individual service card with icon, title, description, and features
- **ProcessSection.jsx**: Step-by-step service process explanation
- **FAQSection.jsx**: Expandable FAQ accordion with common questions
- **TestimonialsSection.jsx**: Client testimonials specific to services

### About Components
- **StorySection.jsx**: Company history and mission statement
- **ValuesSection.jsx**: Core values with icons and descriptions
- **TeamSection.jsx**: Team member cards with photos and bios
- **AwardsSection.jsx**: Company awards and recognitions

### Blog Components
- **BlogGrid.jsx**: Responsive grid of blog post cards with loading states
- **CategoryFilter.jsx**: Blog category filtering tabs
- **FeaturedPost.jsx**: Highlighted featured blog post with larger display
- **Pagination.jsx**: Page navigation for blog posts
- **HeroSection.jsx**: Blog page hero with search functionality

## 3. Architectural Patterns

### Component Structure
- **Page-Based Architecture**: Each route corresponds to a page component in the `pages/` directory
- **Component Composition**: Pages are composed of smaller, reusable components
- **Atomic Design Principles**: UI broken down into atoms (buttons, inputs), molecules (cards, search bars), and organisms (sections)
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities and custom breakpoints
- **Dark Mode Support**: Implemented using Tailwind's dark mode variant with theme persistence

### State Management
- **Local Component State**: Using React's useState for component-specific state
- **React Hooks**: Leveraging useEffect for side effects and lifecycle management
- **No Global State**: No Redux or Context API implementation (could be added for scaling)
- **URL State**: Using URL parameters for shareable filters and search states

### Routing
- **React Router**: Used for client-side routing with BrowserRouter
- **Route Configuration**: Defined in App.jsx with route components
- **Dynamic Routes**: Support for dynamic routes with URL parameters (e.g., /properties/:id)
- **Client-Side Navigation**: Internal links use React Router's Link component
- **Hash Links**: Support for scrolling to page sections using react-router-hash-link

### Animation and Interaction
- **Framer Motion**: Used for page transitions, scroll animations, and interactive elements
- **Viewport Detection**: Animations triggered when elements enter the viewport
- **Motion Variants**: Consistent animation patterns across the application
- **Accessibility**: Interactive elements have appropriate ARIA attributes and keyboard support

## 4. Dependencies and Their Usage

### Core Libraries
- **React (18.3.1)**: UI library for building the component-based interface
- **React DOM (18.3.1)**: React renderer for web applications
- **React Router (6.27.0)**: Client-side routing with support for dynamic routes
- **React Router Hash Link (2.4.3)**: Extension for scrolling to page sections
- **Vite (5.4.8)**: Modern build tool and development server with HMR

### UI and Styling
- **Tailwind CSS (3.4.14)**: Utility-first CSS framework for rapid UI development
- **tailwindcss-animate (1.0.7)**: Animation utilities for Tailwind
- **@material-tailwind/react (2.1.10)**: Material Design components optimized for Tailwind
- **framer-motion (11.5.4)**: Production-ready animation library for React
- **react-slick (0.30.2)**: Carousel/slider component based on slick carousel
- **slick-carousel (1.8.1)**: Dependency for react-slick with styles
- **@headlessui/react (2.1.10)**: Unstyled, accessible UI components
- **@heroicons/react (2.1.5)**: SVG icon collection from the makers of Tailwind
- **react-icons (5.3.0)**: Comprehensive icon library with multiple icon sets
- **lucide-react (0.503.0)**: Icon library with consistent design

### UI Utilities
- **class-variance-authority (0.7.1)**: Utility for creating variant components
- **clsx (2.1.1)**: Utility for conditionally joining class names
- **tailwind-merge (3.2.0)**: Utility for merging Tailwind CSS classes without conflicts

### SEO and Document Management
- **react-helmet (6.1.0)**: Document head manager for setting meta tags and titles
- **react-toggle-dark-mode (1.1.1)**: Animated dark mode toggle component
- **react-simple-typewriter (5.0.1)**: Typewriter text effect component

## 5. Data Flow and Mock Data

### Mock Data Models
- **Property Listings**: Comprehensive property objects with details like price, location, features
  - Defined in PropertiesPage.jsx and PropertyDetailPage.jsx
  - Properties include id, title, location, price, bedrooms, bathrooms, sqft, type, features, imageUrl
- **Blog Posts**: Blog article objects with metadata and content
  - Defined in BlogPage.jsx and BlogPostPage.jsx
  - Posts include id, title, excerpt, imageUrl, author, date, category, content
- **Services**: Service offering objects with descriptions and features
  - Defined in ServicesGrid.jsx
  - Services include id, title, description, icon, features, cta
- **Team Members**: Team member profiles with bio and contact info
  - Defined in TeamSection.jsx
  - Members include id, name, role, bio, imageUrl, socialLinks
- **Testimonials**: Client testimonials with quotes and attribution
  - Defined in Testimonials.jsx
  - Testimonials include id, name, role, company, quote, imageUrl
- **FAQs**: Frequently asked questions with answers
  - Defined in FAQSection.jsx
  - FAQs include question and answer

### Data Flow Patterns
- **API Simulation**: setTimeout is used to simulate API calls with loading states
- **Filter Logic**:
  - Implemented in PropertiesPage.jsx for property filtering
  - Filters include location, price range, bedrooms, bathrooms, property type, features
  - URL parameters used for shareable filter states
- **Search Functionality**:
  - Implemented in SearchBar.jsx for properties
  - Implemented in BlogPage.jsx for blog content
  - Search queries update URL parameters
- **Pagination**: Implemented for blog posts with page size and current page state
- **Favorites**: Toggle functionality for marking properties as favorites
- **Category Filtering**: Blog posts can be filtered by category
- **Sorting**: Properties can be sorted by different criteria (price, date, etc.)
- **View Toggling**: Properties can be viewed in grid or map layout

## 6. Configuration Files

### Build and Development
- **vite.config.js**: Vite configuration for build and development
  - Configures React plugin for JSX support
  - Sets up development server and build options
- **package.json**: NPM scripts and dependencies
  - Scripts: dev, build, lint, preview
  - Defines all project dependencies and their versions
- **vercel.json**: Vercel deployment configuration
  - Configures rewrites for client-side routing support
  - Ensures all routes are handled by the SPA

### Styling and Linting
- **tailwind.config.js**: Tailwind CSS configuration
  - Defines custom color palette for UrbanEdge brand (beige, taupe, brown)
  - Sets up custom screen breakpoints (xs, ss, sm, md, lg, xl)
  - Configures dark mode as "class" for manual toggling
  - Extends theme with custom fonts (Marcellus for headings, PT Serif for body)
  - Includes content paths for component scanning
- **eslint.config.js**: ESLint configuration for code quality
  - Uses new flat config format
  - Configures React-specific rules
  - Sets up React Hooks linting
  - Includes React Refresh plugin for development
- **index.css**: Global styles and Tailwind directives
  - Imports Tailwind base, components, and utilities
  - Defines global styles for typography, buttons, and cards
  - Sets up dark mode color variants

### HTML and Assets
- **index.html**: HTML template
  - Imports Google Fonts (Marcellus and PT Serif)
  - Sets up meta tags for SEO
  - Contains root div for React mounting
- **public/**: Static assets directory
  - favicon.png: Site favicon

## 7. Key Features

### Theme System
- **Dark/Light Mode Toggle**: Interactive toggle with smooth transitions
- **Theme Persistence**: Uses localStorage to remember user preference
- **System Preference Detection**: Detects and respects user's system preference
- **Custom Color Palette**: Branded color scheme with dark mode variants
- **Consistent Theming**: All components respect the current theme

### Responsive Design
- **Mobile-First Approach**: Designed for mobile devices first, then scales up
- **Custom Breakpoints**: Tailored breakpoints in tailwind.config.js (xs: 400px and up)
- **Responsive Typography**: Font sizes adjust based on screen size
- **Adaptive Layouts**: Grid layouts adjust columns based on screen width
- **Responsive Navigation**: Collapses to hamburger menu on smaller screens
- **Touch-Friendly UI**: Larger tap targets on mobile devices

### Animation and Interaction
- **Page Transitions**: Smooth transitions between pages
- **Scroll Animations**: Elements animate as they enter the viewport
- **Hover Effects**: Interactive elements have hover states
- **Loading States**: Skeleton loaders for async content
- **Micro-interactions**: Small animations for user feedback

### SEO and Accessibility
- **Meta Tags**: Dynamic meta tags using react-helmet
- **Semantic HTML**: Proper HTML structure for accessibility
- **Descriptive Titles**: Each page has a unique, descriptive title
- **ARIA Attributes**: Interactive elements have appropriate ARIA labels
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: Meets WCAG guidelines for readability

### User Experience
- **Property Search**: Advanced filtering and search functionality
- **Property Favorites**: Users can mark properties as favorites
- **Blog Categories**: Content organized by categories
- **Responsive Images**: Optimized for different screen sizes
- **Chatbot Support**: Interactive chatbot for user assistance
- **Form Validation**: Input validation for contact and search forms

## 8. Future Development Considerations

### Potential Enhancements
- **Backend Integration**: Replace mock data with real API endpoints
- **Authentication**: Implement user authentication for favorites and saved searches
- **Global State Management**: Add Redux or Context API for global state as the application grows
- **Performance Optimization**: Implement code splitting and lazy loading for larger bundles
- **Testing**: Add unit and integration tests for components and functionality
- **Internationalization**: Add multi-language support for global audience
- **Accessibility Audit**: Conduct a comprehensive accessibility audit and implement improvements

### Scaling Considerations
- **Component Library**: Extract common components into a dedicated library
- **Design System**: Formalize the design system with documentation
- **API Layer**: Create a dedicated API layer with caching and error handling
- **Analytics**: Implement analytics to track user behavior and performance
- **CI/CD**: Set up continuous integration and deployment pipelines

## 9. Conclusion

The UrbanEdge codebase is a well-structured React application built with modern tools and best practices. It follows a component-based architecture with clear separation of concerns, making it maintainable and extensible. The use of Tailwind CSS provides a consistent design system with responsive layouts and dark mode support.

The application is currently using mock data but is structured in a way that would make it easy to integrate with a real backend API. The codebase demonstrates good practices in terms of component composition, state management, and user experience.

This index document serves as a comprehensive reference for understanding the project structure, key components, architectural patterns, and configuration. It should be updated as the codebase evolves to maintain its usefulness as a reference tool.
