
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
  // Remove potentially dangerous characters
  return value.replace(/[<>\"'&]/g, '');
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

// Sanitize AI output to prevent XSS
function sanitizeOutput(text: string): string {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
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
    const prompt = `Based on the following product information, generate 3-4 detailed customer personas in JSON format:

Product: ${validatedData.productName}
Description: ${validatedData.productDescription}
Categories: ${validatedData.productCategories.join(', ')}
Customer Reviews: ${validatedData.productReviews || 'No reviews provided'}

Generate personas as a JSON object with a "personas" array. Each persona should include:
- id (unique string)
- name (realistic full name)
- age (age range like "25-35")
- occupation
- location (city/region)
- interests (array of 3-5 interests)
- values (array of 3-4 core values)
- purchaseBehavior (array of 3-4 buying patterns)
- reasoning (why this persona would be interested in the product)
- researchQuestions (array of 3-4 questions to validate this persona)
- marketingChannel (best channel to reach this persona)

Focus on diversity in demographics, psychographics, and behavior patterns. Make personas realistic and actionable for marketing purposes.`;

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
            content: 'You are a marketing research expert. Generate customer personas in valid JSON format only. Do not include any text outside the JSON response.'
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

    // Parse and validate the AI response
    let personas;
    try {
      const parsedResponse = JSON.parse(generatedContent);
      personas = parsedResponse.personas || [];
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      throw new Error('Invalid response format from AI');
    }

    // Sanitize AI output to prevent XSS
    const sanitizedPersonas = personas.map((persona: any) => ({
      ...persona,
      id: persona.id || `persona-${Math.random().toString(36).substr(2, 9)}`,
      name: sanitizeOutput(persona.name || ''),
      age: sanitizeOutput(persona.age || ''),
      occupation: sanitizeOutput(persona.occupation || ''),
      location: sanitizeOutput(persona.location || ''),
      reasoning: sanitizeOutput(persona.reasoning || ''),
      marketingChannel: sanitizeOutput(persona.marketingChannel || ''),
      interests: Array.isArray(persona.interests) ? persona.interests.map((i: string) => sanitizeOutput(i)) : [],
      values: Array.isArray(persona.values) ? persona.values.map((v: string) => sanitizeOutput(v)) : [],
      purchaseBehavior: Array.isArray(persona.purchaseBehavior) ? persona.purchaseBehavior.map((p: string) => sanitizeOutput(p)) : [],
      researchQuestions: Array.isArray(persona.researchQuestions) ? persona.researchQuestions.map((q: string) => sanitizeOutput(q)) : []
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
