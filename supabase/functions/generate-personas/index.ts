
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};

// Input validation helper functions
function validateString(value: any, maxLength: number = 1000): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value !== 'string') {
    return String(value).slice(0, maxLength);
  }
  if (value.length > maxLength) {
    return value.slice(0, maxLength);
  }
  // Remove potentially dangerous characters but keep normal punctuation
  return value.replace(/[<>]/g, '');
}

function validateArray(value: any): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(item => validateString(item, 100)).filter(Boolean);
}

function validateFormData(data: any) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid form data');
  }

  const validated = {
    productName: validateString(data.productName, 100),
    productDescription: validateString(data.productDescription, 2000),
    productCategories: validateArray(data.productCategories),
    productReviews: validateString(data.productReviews, 1000)
  };

  // Validate required fields
  if (!validated.productName || !validated.productDescription) {
    throw new Error('Product name and description are required');
  }

  if (validated.productDescription.length < 10) {
    throw new Error('Product description must be at least 10 characters');
  }

  return validated;
}

function validateImages(images: any[]) {
  if (!Array.isArray(images)) {
    return [];
  }
  
  // Limit number of images
  if (images.length > 5) {
    return images.slice(0, 5);
  }

  return images.slice(0, 5).map(img => {
    if (typeof img !== 'object' || !img.url) {
      return null;
    }
    return {
      url: validateString(img.url, 500),
      name: validateString(img.name || '', 100)
    };
  }).filter(Boolean);
}

// Rate limiting helper (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per user

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(userId, { count: 1, lastReset: now });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Updated sanitize function that preserves normal text and punctuation
function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Only remove truly dangerous content, preserve normal punctuation and apostrophes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Helper function to extract JSON from AI response
function extractJSON(text: string): any {
  try {
    // First try to parse as-is
    return JSON.parse(text);
  } catch (e) {
    console.log('Direct JSON parse failed, trying to extract...');
    
    // Try to find JSON within the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        console.log('Extracted JSON parse failed:', e2);
      }
    }
    
    // If no JSON found, throw error
    throw new Error('No valid JSON found in response');
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Initialize Supabase client to verify the JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting check
    if (!checkRateLimit(user.id)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      throw new Error('Invalid JSON in request body');
    }

    const { data, images = [] } = requestBody;
    
    // Validate input data
    const validatedData = validateFormData(data);
    const validatedImages = validateImages(images);

    console.log('Generating personas for user:', user.id);
    console.log('Validated product data:', validatedData.productName);

    // Get Groq API key from secrets
    const groqApiKey = Deno.env.get('groq-api');
    if (!groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    // Prepare the prompt for persona generation
    const prompt = `You are a marketing research expert. Generate 3-4 detailed customer personas for this product in VALID JSON format ONLY.

Product: ${validatedData.productName}
Description: ${validatedData.productDescription}
Categories: ${validatedData.productCategories.join(', ')}
Customer Reviews: ${validatedData.productReviews || 'No reviews provided'}

Return ONLY a JSON object with this exact structure:
{
  "personas": [
    {
      "id": "unique-id-1",
      "name": "Full Name",
      "age": "25-35",
      "occupation": "Job Title",
      "location": "City, Country",
      "interests": ["interest1", "interest2", "interest3"],
      "values": ["value1", "value2", "value3"],
      "purchaseBehavior": ["behavior1", "behavior2", "behavior3"],
      "reasoning": "Why this persona would be interested in the product",
      "researchQuestions": ["question1", "question2", "question3"],
      "marketingChannel": "best channel to reach this persona"
    }
  ]
}

Generate diverse personas with realistic details. Return ONLY valid JSON, no additional text or formatting.`;

    // Call Groq API with security headers
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'HyperPersona/1.0',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing research expert. Generate customer personas in valid JSON format only. Do not include any text outside the JSON response. Always start your response with { and end with }. Use proper quotes and avoid special characters that could break JSON parsing.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error('Failed to generate personas');
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated from AI');
    }

    console.log('AI Response content:', generatedContent);

    // Parse and validate the AI response with improved error handling
    let personas;
    try {
      const parsedResponse = extractJSON(generatedContent);
      personas = parsedResponse.personas || [];
      
      if (!Array.isArray(personas)) {
        console.error('Personas is not an array:', personas);
        throw new Error('Invalid response format: personas must be an array');
      }
      
      if (personas.length === 0) {
        console.error('No personas generated');
        throw new Error('No personas were generated');
      }
      
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      console.error('Raw response:', generatedContent);
      throw new Error('Invalid response format from AI');
    }

    // Apply minimal sanitization that preserves normal text and punctuation
    const sanitizedPersonas = personas.map((persona: any, index: number) => ({
      id: persona.id || `persona-${Date.now()}-${index}`,
      name: sanitizeText(persona.name || 'Unknown'),
      age: sanitizeText(persona.age || '25-35'),
      occupation: sanitizeText(persona.occupation || 'Professional'),
      location: sanitizeText(persona.location || 'Unknown'),
      reasoning: sanitizeText(persona.reasoning || 'Potential customer'),
      marketingChannel: sanitizeText(persona.marketingChannel || 'Digital'),
      interests: Array.isArray(persona.interests) ? persona.interests.map((i: string) => sanitizeText(i)).filter(Boolean) : [],
      values: Array.isArray(persona.values) ? persona.values.map((v: string) => sanitizeText(v)).filter(Boolean) : [],
      purchaseBehavior: Array.isArray(persona.purchaseBehavior) ? persona.purchaseBehavior.map((p: string) => sanitizeText(p)).filter(Boolean) : [],
      researchQuestions: Array.isArray(persona.researchQuestions) ? persona.researchQuestions.map((q: string) => sanitizeText(q)).filter(Boolean) : []
    }));

    console.log(`Generated ${sanitizedPersonas.length} personas for user ${user.id}`);

    return new Response(JSON.stringify({ personas: sanitizedPersonas }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-personas function:', error);
    
    // Return generic error message to avoid information disclosure
    const errorMessage = error.message.includes('Rate limit') || 
                        error.message.includes('Unauthorized') ||
                        error.message.includes('Invalid') ||
                        error.message.includes('too long') ||
                        error.message.includes('required')
      ? error.message 
      : 'An error occurred while generating personas';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: error.message.includes('Unauthorized') ? 401 : 
              error.message.includes('Rate limit') ? 429 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
