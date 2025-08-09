import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Undo, 
  Redo,
  Sparkles,
  DollarSign,
  Clock,
  Heart,
  Zap
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useTheme } from './ThemeProvider';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import GlassInput from './GlassInput';
import SkeletonLoader from './SkeletonLoader';
import { UserPreferences, ItineraryAction } from '../types/chat';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userPreferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
  currentItinerary?: any;
  onItineraryAction: (action: ItineraryAction) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isMobile?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  userPreferences,
  onUpdatePreferences,
  currentItinerary,
  onItineraryAction,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isMobile = false,
}) => {
  const { reducedMotion } = useTheme();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isStreaming, 
    streamingContent, 
    sendMessage, 
    stopStreaming,
    clearChat 
  } = useChat({ onItineraryAction });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;
    
    const message = input.trim();
    setInput('');
    
    await sendMessage(message, userPreferences, currentItinerary);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { 
      label: 'Lighten Day', 
      icon: Clock, 
      action: () => sendMessage('Make today\'s schedule less packed with more free time', userPreferences, currentItinerary)
    },
    { 
      label: 'Add Hidden Gem', 
      icon: Sparkles, 
      action: () => sendMessage('Suggest a hidden gem or local secret for this itinerary', userPreferences, currentItinerary)
    },
    { 
      label: 'Kid-friendly', 
      icon: Heart, 
      action: () => sendMessage('Make this itinerary more suitable for families with children', userPreferences, currentItinerary)
    },
    { 
      label: 'Reduce cost 20%', 
      icon: DollarSign, 
      action: () => sendMessage('Help me reduce the cost of this trip by about 20% while keeping it enjoyable', userPreferences, currentItinerary)
    },
  ];

  if (!isOpen) return null;

  const panelClasses = isMobile 
    ? 'fixed inset-0 z-50 glass backdrop-blur-md'
    : `fixed right-0 top-0 h-full w-96 glass backdrop-blur-md shadow-2xl border-l border-white/20 z-40 transform transition-transform duration-300 ${
        isMinimized ? 'translate-x-80' : 'translate-x-0'
      }`;

  return (
    <motion.div 
      className={panelClasses}
      initial={{ x: isMobile ? '100%' : 384 }}
      animate={{ x: 0 }}
      exit={{ x: isMobile ? '100%' : 384 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-primary-500 to-secondary-500 text-dark-900">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-display font-semibold">AI Trip Planner</h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Undo/Redo buttons */}
          <motion.button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Undo className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Redo className="h-4 w-4" />
          </motion.button>
          
          {!isMobile && (
            <motion.button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </motion.button>
          )}
          <motion.button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col h-full"
          >
        <>
          {/* Quick Actions */}
            <div className="p-4 border-b border-white/20 glass backdrop-blur-md">
              <h4 className="text-sm font-medium text-white/80 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    disabled={isStreaming}
                    className="flex items-center space-x-2 p-2 text-xs glass backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 200px)' }}>
            {messages.length === 0 && (
              <motion.div 
                className="text-center text-white/60 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary-400" />
                </motion.div>
                <p className="text-sm text-white">Ask me anything about your trip!</p>
                <p className="text-xs mt-2 text-white/60">I can help you plan activities, adjust your schedule, find hidden gems, and more.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <motion.div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-dark-900'
                      : 'glass backdrop-blur-md text-white border border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-dark-700' : 'text-white/60'
                  }`}>
                    {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </motion.div>
              </motion.div>
            ))}

            {/* Streaming message */}
            {isStreaming && streamingContent && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="max-w-[80%] p-3 rounded-lg glass backdrop-blur-md text-white border border-white/20">
                  <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-2 h-2 bg-primary-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-primary-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-primary-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-xs text-white/60">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Typing indicator */}
            {isStreaming && !streamingContent && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="max-w-[80%] p-3 rounded-lg glass backdrop-blur-md text-white border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-2 h-2 bg-primary-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-primary-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-primary-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-xs text-white/60">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
            <div className="p-4 border-t border-white/20 glass backdrop-blur-md">
            <div className="flex space-x-2">
              <motion.textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to adjust your itinerary..."
                className="flex-1 p-3 glass backdrop-blur-md border border-white/20 rounded-xl resize-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white placeholder-white/60 transition-all duration-300"
                rows={2}
                disabled={isStreaming}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <div className="flex flex-col space-y-1">
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isStreaming}
                  className="p-3 shadow-glow-primary"
                >
                  <Send className="h-4 w-4" />
                </GlassButton>
                {isStreaming && (
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={stopStreaming}
                    className="p-3 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                    title="Stop"
                  >
                    <X className="h-4 w-4" />
                  </GlassButton>
                )}
              </div>
            </div>
          </div>
        </>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatPanel;