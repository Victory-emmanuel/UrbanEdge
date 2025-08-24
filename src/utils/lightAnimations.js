// Lightweight animation utilities to replace framer-motion in non-critical components
// This reduces bundle size while maintaining essential animations

import { useEffect, useRef, useState } from "react";

// Simple fade-in animation hook
export const useFadeIn = (delay = 0, duration = 500) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
  };

  return { ref, style, isVisible };
};

// Intersection Observer animation hook
export const useInViewAnimation = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.once !== false) {
            observer.disconnect();
          }
        } else if (options.once === false) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "-50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return { ref, isInView };
};

// Simple Motion component replacement
export const SimpleMotion = ({
  children,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
  delay = 0,
  className = "",
  ...props
}) => {
  const { ref, isInView } = useInViewAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, delay]);

  const style = {
    opacity: hasAnimated ? animate.opacity : initial.opacity,
    transform: `translateY(${hasAnimated ? animate.y || 0 : initial.y || 0}px)`,
    transition: `all ${transition.duration}s ease-out`,
  };

  return (
    <div ref={ref} style={style} className={className} {...props}>
      {children}
    </div>
  );
};

// Stagger animation for lists
export const useStaggerAnimation = (
  itemCount,
  baseDelay = 0,
  staggerDelay = 100
) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const { ref, isInView } = useInViewAnimation();

  useEffect(() => {
    if (isInView) {
      const timers = [];
      for (let i = 0; i < itemCount; i++) {
        const timer = setTimeout(() => {
          setVisibleItems((prev) => new Set([...prev, i]));
        }, baseDelay + i * staggerDelay);
        timers.push(timer);
      }

      return () => timers.forEach(clearTimeout);
    }
  }, [isInView, itemCount, baseDelay, staggerDelay]);

  const getItemStyle = (index, customDelay = 0) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: visibleItems.has(index) ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
    transitionDelay: `${customDelay}ms`,
  });

  return { ref, getItemStyle, visibleItems };
};

// CSS-based animations for critical components
export const animationClasses = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  slideDown: "animate-slide-down",
  scaleIn: "animate-scale-in",
  bounce: "animate-bounce-in",
};

// Generate keyframes CSS for Tailwind
export const generateAnimationCSS = () => `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-up {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slide-down {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scale-in {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes bounce-in {
    0% { 
      opacity: 0;
      transform: scale(0.3);
    }
    50% { 
      opacity: 1;
      transform: scale(1.05);
    }
    70% { 
      transform: scale(0.9);
    }
    100% { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
  
  .animate-slide-down {
    animation: slide-down 0.5s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.6s ease-out;
  }
`;

// Performance-optimized animation wrapper
export const OptimizedMotion = ({ children, ...motionProps }) => {
  // Use native CSS animations for better performance
  const shouldUseCSS =
    typeof window !== "undefined" &&
    "animation" in document.documentElement.style;

  if (shouldUseCSS && motionProps.whileInView) {
    return <SimpleMotion {...motionProps}>{children}</SimpleMotion>;
  }

  // Fallback to framer-motion for complex animations
  const { motion } = require("framer-motion");
  return motion.div(motionProps, children);
};

export default {
  useFadeIn,
  useInViewAnimation,
  SimpleMotion,
  useStaggerAnimation,
  animationClasses,
  generateAnimationCSS,
  OptimizedMotion,
};
