import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
}

/**
 * PageTransition - Wrapper component for smooth page transitions
 * Provides fade-in and slide-up animations when pages load
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * CardAnimation - Wrapper for card animations with hover effects
 */
export const CardAnimation: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ListItemAnimation - Wrapper for list item animations
 */
export const ListItemAnimation: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        x: 4,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * FloatingAnimation - Wrapper for floating animations
 */
export const FloatingAnimation: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * PulseAnimation - Wrapper for pulsing animations
 */
export const PulseAnimation: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * RotateAnimation - Wrapper for rotating animations
 */
export const RotateAnimation: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  );
};
