import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface GlassInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  animate?: boolean;
}

const GlassInput: React.FC<GlassInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  icon,
  animate = true
}) => {
  const { reducedMotion } = useTheme();
  const shouldAnimate = animate && !reducedMotion;

  const motionProps = shouldAnimate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  } : {};

  const Component = shouldAnimate ? motion.div : 'div';

  return (
    <Component className={`relative ${className}`} {...motionProps}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full glass backdrop-blur-md rounded-xl
          border border-white/20 focus:border-primary-400/50
          bg-white/5 focus:bg-white/10
          text-white placeholder-white/60
          px-4 py-3 ${icon ? 'pl-10' : ''}
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary-500/30
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      />
    </Component>
  );
};

export default GlassInput;