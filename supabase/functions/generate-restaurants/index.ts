const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Restaurant generation function called')
    
    // Get the OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    // Parse request body
    const { destination, budget = 'medium' } = await req.json()
    console.log('Generating restaurants for:', { destination, budget })

    if (!destination) {
      throw new Error('Destination is required')
    }

    // Create the prompt for OpenAI
    const prompt = `Generate a list of 8-12 diverse restaurants for ${destination}. Consider the budget level: ${budget}.

Please return a JSON array of restaurant objects with this exact structure:
[
  {
    "name": "Restaurant Name",
    "cuisine": "Cuisine Type",
    "rating": 4.5,
    "priceRange": "$$ - $$$",
    "address": "Full address in ${destination}",
    "specialty": "Famous dish or specialty",
    "description": "Brief description of the restaurant"
  }
]

Requirements:
- Include a mix of local specialties and international cuisines
- Vary the price ranges based on the budget (${budget})
- Use realistic restaurant names that would exist in ${destination}
- Include accurate-sounding addresses for ${destination}
- Ratings should be between 3.8 and 4.9
- Make sure all restaurants feel authentic to ${destination}
- Return ONLY the JSON array, no additional text`

    // Call OpenAI API
    console.log('Calling OpenAI API...')
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
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', openaiResponse.status, errorText)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    console.log('OpenAI response received')

    // Parse the response
    const content = openaiData.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Try to parse the JSON response
    let restaurants
    try {
      restaurants = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content)
      throw new Error('Invalid JSON response from OpenAI')
    }

    // Validate the response structure
    if (!Array.isArray(restaurants)) {
      throw new Error('OpenAI response is not an array')
    }

    console.log(`Generated ${restaurants.length} restaurants for ${destination}`)

    return new Response(
      JSON.stringify({ restaurants }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error in generate-restaurants function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        restaurants: [] 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})