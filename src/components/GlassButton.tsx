import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  animate?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  animate = true
}) => {
  const { reducedMotion } = useTheme();
  const shouldAnimate = animate && !reducedMotion;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-400
      hover:from-primary-400 hover:to-primary-300
      text-dark-900 font-semibold
      shadow-glow-primary hover:shadow-glow-primary
      border border-primary-400/50
    `,
    secondary: `
      bg-gradient-to-r from-secondary-500 to-secondary-400
      hover:from-secondary-400 hover:to-secondary-300
      text-white font-semibold
      shadow-glow-secondary hover:shadow-glow-secondary
      border border-secondary-400/50
    `,
    ghost: `
      glass backdrop-blur-md
      hover:bg-white/20 dark:hover:bg-white/10
      text-white border border-white/20
      hover:border-white/30
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const motionProps = shouldAnimate ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeInOut' }
  } : {};

  const Component = shouldAnimate ? motion.button : 'button';

  return (
    <Component
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-xl transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary-500/50
        ${className}
      `}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default GlassButton;