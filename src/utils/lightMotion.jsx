// /**
//  * Lightweight Motion Components
//  *
//  * Alternative to framer-motion for basic animations to reduce bundle size.
//  * Uses CSS transitions and Intersection Observer for performance.
//  * Only use this for simple animations; keep framer-motion for complex interactions.
//  */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// /**
//  * Lightweight motion div component using CSS transitions
//  */
export const LightMotion = ({
  children,
  initial = {},
  animate = {},
  whileInView = null,
  viewport = { once: true, margin: "-100px" },
  transition = { duration: 0.5 },
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !whileInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!viewport.once || !hasAnimated)) {
            setIsVisible(true);
            if (viewport.once) {
              setHasAnimated(true);
            }
          } else if (!viewport.once) {
            setIsVisible(false);
          }
        });
      },
      {
        rootMargin: viewport.margin || "0px",
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [whileInView, viewport.once, viewport.margin, hasAnimated]);

  // Determine the target style
  const getStyle = () => {
    let targetStyle = {};

    if (whileInView) {
      targetStyle = isVisible ? whileInView : initial;
    } else {
      targetStyle = animate;
    }

    // Convert to CSS properties
    const style = {
      transition: `all ${transition.duration}s ease-out`,
      transform: "",
      ...targetStyle,
    };

    // Handle common transform properties
    const transforms = [];
    if (targetStyle.x)
      transforms.push(
        `translateX(${
          typeof targetStyle.x === "number"
            ? targetStyle.x + "px"
            : targetStyle.x
        })`
      );
    if (targetStyle.y)
      transforms.push(
        `translateY(${
          typeof targetStyle.y === "number"
            ? targetStyle.y + "px"
            : targetStyle.y
        })`
      );
    if (targetStyle.scale) transforms.push(`scale(${targetStyle.scale})`);
    if (targetStyle.rotate) transforms.push(`rotate(${targetStyle.rotate}deg)`);

    if (transforms.length > 0) {
      style.transform = transforms.join(" ");
    }

    return style;
  };

  return (
    <div ref={ref} className={className} style={getStyle()} {...props}>
      {children}
    </div>
  );
};

LightMotion.propTypes = {
  children: PropTypes.node.isRequired,
  initial: PropTypes.object,
  animate: PropTypes.object,
  whileInView: PropTypes.object,
  viewport: PropTypes.object,
  transition: PropTypes.object,
  className: PropTypes.string,
};

/**
 * Lightweight stagger container
 */
export const LightStagger = ({ children, stagger = 0.1, ...props }) => {
  return (
    <div {...props}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <LightMotion
              key={child.key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * stagger }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {child}
            </LightMotion>
          ))
        : children}
    </div>
  );
};

LightStagger.propTypes = {
  children: PropTypes.node.isRequired,
  stagger: PropTypes.number,
};

/**
 * CSS-only fade in animation utility
 */
export const cssAnimations = {
  fadeIn: {
    animation: "fadeIn 0.5s ease-out forwards",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },

  slideInLeft: {
    animation: "slideInLeft 0.5s ease-out forwards",
    "@keyframes slideInLeft": {
      from: { opacity: 0, transform: "translateX(-20px)" },
      to: { opacity: 1, transform: "translateX(0)" },
    },
  },

  scaleIn: {
    animation: "scaleIn 0.3s ease-out forwards",
    "@keyframes scaleIn": {
      from: { opacity: 0, transform: "scale(0.9)" },
      to: { opacity: 1, transform: "scale(1)" },
    },
  },
};

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

export default LightMotion;
