import React, { useState, useRef, useEffect } from 'react';
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
    ? 'fixed inset-0 z-50 bg-white'
    : `fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-40 transform transition-transform duration-300 ${
        isMinimized ? 'translate-x-80' : 'translate-x-0'
      }`;

  return (
    <div className={panelClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-semibold">AI Trip Planner</h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Undo/Redo buttons */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 rounded hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 rounded hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
          
          {!isMobile && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded hover:bg-white hover:bg-opacity-20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white hover:bg-opacity-20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={isStreaming}
                    className="flex items-center space-x-1 p-2 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon className="h-3 w-3" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 200px)' }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Ask me anything about your trip!</p>
                <p className="text-xs mt-2">I can help you plan activities, adjust your schedule, find hidden gems, and more.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {isStreaming && streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                  <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isStreaming && !streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to adjust your itinerary..."
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={isStreaming}
              />
              <div className="flex flex-col space-y-1">
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isStreaming}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
                {isStreaming && (
                  <button
                    onClick={stopStreaming}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Stop"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;