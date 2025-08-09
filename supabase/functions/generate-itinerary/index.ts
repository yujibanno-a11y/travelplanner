import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ItineraryRequest {
  destination: string
  days: number
}

interface ItineraryDay {
  day: number
  activities: string[]
  attractions: string[]
  tips: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { destination, days }: ItineraryRequest = await req.json()

    if (!destination || !days) {
      return new Response(
        JSON.stringify({ error: 'Missing destination or days parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create the prompt for OpenAI
    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}. Each day should have UNIQUE activities and attractions - do not repeat the same activities, attractions, or locations across different days.

For each day, provide:
1. 3 UNIQUE specific activities with time of day (morning, afternoon, evening) - ensure no activity is repeated across days
2. 4 UNIQUE must-visit attractions - ensure no attraction is repeated across days
3. One practical tip for that day

IMPORTANT: Make sure each day has completely different activities and attractions. Vary the types of experiences (cultural, outdoor, food, shopping, entertainment, etc.) and locations within ${destination}.

Format the response as a JSON array where each day has this structure:
{
  "day": 1,
  "activities": [
    "Morning: Specific activity description",
    "Afternoon: Specific activity description", 
    "Evening: Specific activity description"
  ],
  "attractions": [
    "Attraction 1 name",
    "Attraction 2 name",
    "Attraction 3 name", 
    "Attraction 4 name"
  ],
  "tips": "Practical tip for this day"
}


    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional travel planner. Provide detailed, practical itineraries in valid JSON format only. Do not include any text outside the JSON response.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate itinerary' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const openaiData = await openaiResponse.json()
    const generatedContent = openaiData.choices[0]?.message?.content

    if (!generatedContent) {
      return new Response(
        JSON.stringify({ error: 'No content generated' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the JSON response from OpenAI
    let itinerary: ItineraryDay[]
    try {
      itinerary = JSON.parse(generatedContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      console.error('Raw response:', generatedContent)
      
      // Fallback to mock data if parsing fails
      itinerary = Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        activities: [
          `Morning: Explore ${destination} city center`,
          `Afternoon: Visit local museums and cultural sites`,
          `Evening: Enjoy dinner at a traditional restaurant`
        ],
        attractions: [
          `${destination} Historic District`,
          'Local Art Museum',
          'Central Square',
          'Popular Viewpoint'
        ],
        tips: `Day ${i + 1}: Wear comfortable walking shoes and bring a camera!`
      }))
    }

    return new Response(
      JSON.stringify({ itinerary }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})