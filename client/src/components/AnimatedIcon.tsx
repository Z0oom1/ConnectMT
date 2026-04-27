import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  children: React.ReactNode;
  variant?: 'pulse' | 'bounce' | 'rotate' | 'float' | 'wiggle';
  size?: number;
  className?: string;
}

/**
 * AnimatedIcon - Component for animated icons with various effects
 */
export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  variant = 'pulse',
  size = 24,
  className = '',
}) => {
  const variants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity },
    },
    bounce: {
      y: [0, -10, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    rotate: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: 'linear' },
    },
    float: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    wiggle: {
      rotate: [-5, 5, -5],
      transition: { duration: 0.5, repeat: Infinity },
    },
  };

  return (
    <motion.div
      animate={variants[variant]}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      className={className}
    >
      {React.cloneElement(children as React.ReactElement, { size })}
    </motion.div>
  );
};

/**
 * AnimatedNumber - Component for animating number changes
 */
interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className = '' }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {value}
    </motion.span>
  );
};

/**
 * AnimatedProgress - Component for animated progress bars
 */
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className = '',
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full h-2 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full bg-accent rounded-full"
      />
    </div>
  );
};

/**
 * AnimatedBadge - Component for animated badge notifications
 */
interface AnimatedBadgeProps {
  count: number;
  className?: string;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({ count, className = '' }) => {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.5, repeat: Infinity }}
      className={`flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold ${className}`}
    >
      {count > 9 ? '9+' : count}
    </motion.div>
  );
};
