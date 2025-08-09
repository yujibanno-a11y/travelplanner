import { useState, useCallback, useRef } from 'react';
import { Message, UserPreferences, ItineraryAction } from '../types/chat';

interface UseChatProps {
  onItineraryAction?: (action: ItineraryAction) => void;
}

export const useChat = ({ onItineraryAction }: UseChatProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...message,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    userPreferences: UserPreferences,
    currentItinerary?: any
  ) => {
    // Add user message
    const userMessage = addMessage({ role: 'user', content });
    
    setIsStreaming(true);
    setStreamingContent('');

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userPreferences,
          currentItinerary,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullContent = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.content) {
                fullContent += data.content;
                setStreamingContent(fullContent);
              }

              if (data.actions) {
                data.actions.forEach((action: ItineraryAction) => {
                  onItineraryAction?.(action);
                });
              }

              if (data.isComplete) {
                // Add assistant message
                addMessage({ role: 'assistant', content: fullContent });
                setStreamingContent('');
                setIsStreaming(false);
                return;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Chat error:', error);
        addMessage({ 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        });
      }
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, [messages, addMessage, onItineraryAction]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingContent('');
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    streamingContent,
    sendMessage,
    stopStreaming,
    clearChat,
    addMessage,
  };
};