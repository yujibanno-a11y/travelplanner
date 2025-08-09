import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'primary' | 'secondary' | 'none';
  onClick?: () => void;
  animate?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  glow = 'none',
  onClick,
  animate = true
}) => {
  const { reducedMotion } = useTheme();
  const shouldAnimate = animate && !reducedMotion;

  const glowClasses = {
    primary: 'shadow-glow-primary hover:shadow-glow-primary',
    secondary: 'shadow-glow-secondary hover:shadow-glow-secondary',
    none: ''
  };

  const motionProps = shouldAnimate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: hover ? { y: -2, scale: 1.02 } : undefined,
    transition: { duration: 0.3, ease: 'easeOut' }
  } : {};

  const Component = shouldAnimate ? motion.div : 'div';

  return (
    <Component
      className={`
        glass backdrop-blur-md rounded-2xl shadow-glass
        border border-white/20 dark:border-white/10
        transition-all duration-300 ease-out
        ${hover ? 'hover:border-white/30 dark:hover:border-white/20 cursor-pointer' : ''}
        ${glowClasses[glow]}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default GlassCard;