import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RestaurantRequest {
  destination: string
  days: number
  budget?: number
}

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  priceRange: string
  avgCost: number
  address: string
  image: string
  reviews: number
  specialties: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { destination, days, budget = 50 }: RestaurantRequest = await req.json()

    if (!destination) {
      return new Response(
        JSON.stringify({ error: 'Missing destination parameter' }),
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
    const prompt = `Generate a list of 8-12 diverse restaurants in ${destination} for travelers. Consider a budget of approximately $${budget} per person per meal.

Include a variety of:
- Price ranges (budget-friendly to mid-range)
- Cuisine types (local specialties, international options)
- Different neighborhoods/areas in ${destination}
- Highly rated establishments with good reviews

For each restaurant, provide:
1. A realistic restaurant name that could exist in ${destination}
2. Cuisine type (focus on local specialties and popular international cuisines)
3. Rating between 4.0-4.9 (realistic high ratings)
4. Price range: $ (under $25), $$ ($25-50), $$$ ($50+)
5. Average cost per person for a meal
6. Realistic address/area in ${destination}
7. Number of reviews (realistic range: 200-2000)
8. 2-4 specialty dishes or features

Format the response as a JSON array where each restaurant has this structure:
{
  "id": "unique_id",
  "name": "Restaurant Name",
  "cuisine": "cuisine_type",
  "rating": 4.5,
  "priceRange": "$$",
  "avgCost": 35,
  "address": "Address in ${destination}",
  "image": "https://images.pexels.com/photos/restaurant-photo-id/pexels-photo-restaurant-photo-id.jpeg?auto=compress&cs=tinysrgb&w=400",
  "reviews": 850,
  "specialties": ["Dish 1", "Dish 2", "Dish 3"]
}

Use realistic Pexels image URLs for restaurant/food photos. Make sure all restaurants are diverse and represent the local food scene of ${destination}.`

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
            content: 'You are a local food expert and travel guide. Provide detailed, realistic restaurant recommendations in valid JSON format only. Do not include any text outside the JSON response.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.8,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate restaurants' }),
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
    let restaurants: Restaurant[]
    try {
      restaurants = JSON.parse(generatedContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      console.error('Raw response:', generatedContent)
      
      // Fallback to mock data if parsing fails
      restaurants = [
        {
          id: '1',
          name: `${destination} Local Bistro`,
          cuisine: 'local',
          rating: 4.6,
          priceRange: '$$',
          avgCost: 32,
          address: `Main Street, ${destination}`,
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 750,
          specialties: ['Local Specialty', 'Seasonal Menu', 'Craft Cocktails']
        },
        {
          id: '2',
          name: `${destination} Street Food`,
          cuisine: 'street food',
          rating: 4.4,
          priceRange: '$',
          avgCost: 18,
          address: `Food District, ${destination}`,
          image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 920,
          specialties: ['Quick Bites', 'Local Flavors', 'Affordable Meals']
        },
        {
          id: '3',
          name: `${destination} Fine Dining`,
          cuisine: 'international',
          rating: 4.8,
          priceRange: '$$$',
          avgCost: 65,
          address: `Uptown, ${destination}`,
          image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 420,
          specialties: ['Tasting Menu', 'Wine Pairing', 'Chef Special']
        }
      ]
    }

    return new Response(
      JSON.stringify({ restaurants }),
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