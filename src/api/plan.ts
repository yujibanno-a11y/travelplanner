import { Message, UserPreferences, ItineraryAction } from '../types/chat';

interface PlanRequest {
  messages: Message[];
  userPreferences: UserPreferences;
  currentItinerary?: any;
}

interface StreamChunk {
  content?: string;
  actions?: ItineraryAction[];
  isComplete?: boolean;
}

// Mock streaming response for when no LLM key is configured
const generateMockResponse = async (request: PlanRequest): Promise<ReadableStream> => {
  const { messages, userPreferences, currentItinerary } = request;
  const lastMessage = messages[messages.length - 1];
  
  // Generate contextual response based on the user's message
  let response = '';
  let actions: ItineraryAction[] = [];
  
  const messageContent = lastMessage.content.toLowerCase();
  
  if (messageContent.includes('lighten') || messageContent.includes('less packed')) {
    response = "I'll help you create a more relaxed schedule with more free time. Let me adjust your itinerary to have fewer activities per day and longer breaks between them.";
    if (currentItinerary && currentItinerary.length > 0) {
      actions.push({
        type: 'lightenDay',
        payload: { day: 1 }
      });
    }
  } else if (messageContent.includes('hidden gem') || messageContent.includes('local secret')) {
    response = "Great idea! I'll suggest some hidden gems and local favorites that most tourists miss. These spots will give you a more authentic experience of your destination.";
    if (currentItinerary && currentItinerary.length > 0) {
      actions.push({
        type: 'insertActivity',
        payload: { 
          day: 1, 
          activity: "Evening: Visit the secret rooftop garden known only to locals - perfect for sunset photos" 
        }
      });
    }
  } else if (messageContent.includes('kid') || messageContent.includes('family') || messageContent.includes('children')) {
    response = "I'll make this itinerary more family-friendly! I'll add kid-appropriate activities, suggest family restaurants, and include playgrounds or interactive experiences that children will love.";
  } else if (messageContent.includes('cost') || messageContent.includes('budget') || messageContent.includes('cheap')) {
    response = `I'll help you reduce costs while keeping the experience amazing! Based on your budget of $${userPreferences.budget}/day, I'll suggest free activities, budget-friendly restaurants, and money-saving tips.`;
  } else if (messageContent.includes('food') || messageContent.includes('restaurant')) {
    response = "I'll focus on the culinary experience! Let me suggest the best local restaurants, food markets, and unique dining experiences that match your preferences and budget.";
  } else {
    response = `I understand you'd like help with your itinerary. Based on your preferences (${userPreferences.pace} pace, $${userPreferences.budget} budget, interests in ${userPreferences.interests.join(', ')}), I can help you optimize your travel plans. What specific aspect would you like me to focus on?`;
  }
  
  // Create a readable stream that simulates typing
  return new ReadableStream({
    start(controller) {
      let index = 0;
      const words = response.split(' ');
      
      const sendChunk = () => {
        if (index < words.length) {
          const chunk: StreamChunk = {
            content: words[index] + ' ',
            isComplete: false
          };
          controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
          index++;
          setTimeout(sendChunk, 50 + Math.random() * 100); // Simulate typing speed
        } else {
          // Send actions if any
          if (actions.length > 0) {
            const actionChunk: StreamChunk = {
              actions,
              isComplete: false
            };
            controller.enqueue(`data: ${JSON.stringify(actionChunk)}\n\n`);
          }
          
          // Send completion
          const finalChunk: StreamChunk = {
            isComplete: true
          };
          controller.enqueue(`data: ${JSON.stringify(finalChunk)}\n\n`);
          controller.close();
        }
      };
      
      // Start after a brief delay
      setTimeout(sendChunk, 500);
    }
  });
};

// Real LLM integration (when API key is available)
const generateLLMResponse = async (request: PlanRequest): Promise<ReadableStream> => {
  const openaiApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const { messages, userPreferences, currentItinerary } = request;
  
  // Build context for the LLM
  const systemPrompt = `You are an expert travel planner AI assistant. Help users plan and modify their travel itineraries.

User Preferences:
- Budget: $${userPreferences.budget}/day
- Pace: ${userPreferences.pace}
- Interests: ${userPreferences.interests.join(', ')}
- Accessibility needs: ${userPreferences.accessibility.mobility ? 'Mobility considerations' : 'None'}
- Dietary requirements: ${userPreferences.accessibility.dietary.join(', ') || 'None'}

Current Itinerary: ${currentItinerary ? JSON.stringify(currentItinerary) : 'None'}

When making changes to the itinerary, respond with both conversational text AND structured actions in this format:
[ACTION:type:payload]

Available actions:
- regenerateDay: [ACTION:regenerateDay:{"day":1,"activities":["Morning: New activity"],"attractions":["New attraction"],"tips":"New tip"}]
- insertActivity: [ACTION:insertActivity:{"day":1,"activity":"New activity description"}]
- lightenDay: [ACTION:lightenDay:{"day":1}]
- updateItinerary: [ACTION:updateItinerary:{"itinerary":[...]}]

Be conversational and helpful while providing specific, actionable travel advice.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      stream: true,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get LLM response');
  }

  return new ReadableStream({
    start(controller) {
      const reader = response.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(`data: ${JSON.stringify({ isComplete: true })}\n\n`);
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    // Check for action patterns and extract them
                    const actionRegex = /\[ACTION:(\w+):({.*?})\]/g;
                    let match;
                    const actions: ItineraryAction[] = [];
                    let cleanContent = content;

                    while ((match = actionRegex.exec(content)) !== null) {
                      const [fullMatch, actionType, payloadStr] = match;
                      try {
                        const payload = JSON.parse(payloadStr);
                        actions.push({ type: actionType as any, payload });
                        cleanContent = cleanContent.replace(fullMatch, '');
                      } catch (e) {
                        // Invalid action format, ignore
                      }
                    }

                    const chunk: StreamChunk = {
                      content: cleanContent,
                      actions: actions.length > 0 ? actions : undefined,
                      isComplete: false
                    };
                    
                    controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      };

      processStream();
    }
  });
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const request: PlanRequest = await req.json();
    
    // Try LLM first, fall back to mock
    let stream: ReadableStream;
    try {
      stream = await generateLLMResponse(request);
    } catch (error) {
      console.log('LLM not available, using mock response:', error);
      stream = await generateMockResponse(request);
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Plan API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}