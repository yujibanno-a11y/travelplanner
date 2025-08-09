import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  children?: React.ReactNode;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actionButton,
  children
}) => {
  const { reducedMotion } = useTheme();

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={reducedMotion ? undefined : backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md"
          variants={reducedMotion ? undefined : modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <GlassCard className="p-6" glow="none">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h2 className="text-xl font-display font-bold text-white">
                  {title}
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-5 w-5 text-white/60" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                {message}
              </p>

              {children}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <GlassButton
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </GlassButton>
                {actionButton && (
                  <GlassButton
                    variant={actionButton.variant || 'primary'}
                    onClick={actionButton.onClick}
                    className="flex-1"
                  >
                    {actionButton.label}
                  </GlassButton>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorModal;