import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  lines?: number;
  animate?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  variant = 'text', 
  lines = 1,
  animate = true 
}) => {
  const { reducedMotion } = useTheme();
  const shouldAnimate = animate && !reducedMotion;

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { 
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'linear'
      }
    }
  };

  const baseClasses = "relative overflow-hidden bg-gradient-to-r from-glass-light via-glass-medium to-glass-light rounded-lg";
  
  const variantClasses = {
    text: 'h-4',
    card: 'h-48',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={`${baseClasses} ${variantClasses.text}`}>
            {shouldAnimate && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      )}
    </div>
  );
};

export default SkeletonLoader;