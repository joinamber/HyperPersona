
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormValues {
  productName: string;
  productDescription: string;
  productCategories: string[];
  productReviews?: string;
}

interface ProductImage {
  file: {
    name: string;
  };
}

interface Persona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  location: string;
  interests: string[];
  values: string[];
  purchaseBehavior: string[];
  reasoning: string;
  researchQuestions: string[];
  marketingChannel: string;
}

const createPersonaPrompt = (data: FormValues, images: ProductImage[]): string => {
  const imageDescriptions = images.map((img, index) => 
    `[Photo ${index + 1} Description: Product image showing ${img.file.name}]`
  ).join('\n');

  return `You are an AI customer researcher for a product company. Based on the product information provided, generate 3 high-potential customer personas.

Each persona must include:
- Name (fictional)
- Age range
- Occupation
- Location type (urban, suburban, rural)
- Key interests and values
- Purchase behavior
- Why this persona fits the product (use case match, price point alignment, lifestyle fit)

Also provide:
- 2 follow-up research questions to better validate this persona.
- 1 example marketing channel to reach this persona.

Here is the product input:
[Product Name: ${data.productName}]
[Product Description: ${data.productDescription}]
[Category Tags: ${data.productCategories.join(', ')}]
${imageDescriptions}
${data.productReviews ? `[Customer Review Snippets: ${data.productReviews}]` : ''}

I need you to respond with only the JSON data in this exact format:
{
  "personas": [
    {
      "id": "string",
      "name": "string",
      "age": "string",
      "occupation": "string",
      "location": "string",
      "interests": ["string"],
      "values": ["string"],
      "purchaseBehavior": ["string"],
      "reasoning": "string",
      "researchQuestions": ["string", "string"],
      "marketingChannel": "string"
    }
  ]
}

Only return JSON, do not include markdown formatting such as \`\`\`json or any other explanation text.`;
};

const extractJSONFromResponse = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.log("Failed to parse entire response as JSON, attempting to extract JSON portion", error);
    
    try {
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        console.log("Extracted JSON string:", jsonStr);
        return JSON.parse(jsonStr);
      } else {
        throw new Error("No JSON object found in response");
      }
    } catch (extractError) {
      console.error("Failed to extract JSON:", extractError);
      throw new Error("Failed to extract valid JSON from LLM response");
    }
  }
};

const getMockPersonas = () => {
  return {
    personas: [
      {
        id: "p1",
        name: "Sarah Thompson",
        age: "28-35",
        occupation: "Marketing Manager",
        location: "Urban",
        interests: ["Fitness", "Technology", "Fashion"],
        values: ["Quality", "Efficiency", "Status"],
        purchaseBehavior: [
          "Researches extensively before purchase",
          "Willing to pay premium for quality",
          "Brand loyal when satisfied"
        ],
        reasoning: "Based on the product description, Sarah represents professionals who value efficiency and quality. The product's features align with her need for reliable solutions.",
        researchQuestions: [
          "What factors most influence your purchasing decisions for work-related tools?",
          "How important is brand reputation compared to product features?"
        ],
        marketingChannel: "LinkedIn + Instagram (sponsored posts)"
      },
      {
        id: "p2",
        name: "Michael Chen",
        age: "35-42",
        occupation: "Small Business Owner",
        location: "Suburban",
        interests: ["Entrepreneurship", "Home Improvement", "Local Community"],
        values: ["Practicality", "Value for Money", "Support"],
        purchaseBehavior: [
          "Price-conscious but values durability",
          "Reads reviews extensively",
          "Prefers products with good customer service"
        ],
        reasoning: "Michael represents the practical business owner segment who needs reliable solutions that provide clear ROI. The product's emphasis on efficiency would appeal to him.",
        researchQuestions: [
          "What level of customer support do you expect when purchasing business solutions?",
          "How do you balance cost vs. features when making business purchases?"
        ],
        marketingChannel: "Facebook Business Groups + Local Business Events"
      },
      {
        id: "p3",
        name: "Emma Rodriguez",
        age: "22-29",
        occupation: "Freelance Designer",
        location: "Urban",
        interests: ["Design", "Coffee Culture", "Digital Nomad Lifestyle"],
        values: ["Creativity", "Flexibility", "Aesthetic"],
        purchaseBehavior: [
          "Early adopter of new tools",
          "Influenced by peers and social media",
          "Values portability and design"
        ],
        reasoning: "Emma represents creative professionals who need flexible solutions. The product's innovative aspects and ease of use would appeal to her workflow needs.",
        researchQuestions: [
          "How important is the visual design of products you use professionally?",
          "Do you prefer products that integrate with your existing workflow tools?"
        ],
        marketingChannel: "Instagram + Design Community Forums"
      }
    ]
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data, images } = await req.json();
    
    if (!data) {
      throw new Error('No form data provided');
    }

    console.log("Generating personas with data:", data);
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    if (!groqApiKey) {
      console.log('No Groq API key found, falling back to mock data');
      return new Response(JSON.stringify(getMockPersonas()), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = createPersonaPrompt(data, images || []);
    console.log("Generated prompt for LLM:", prompt);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1.0,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      console.log('Falling back to mock data due to API error');
      return new Response(JSON.stringify(getMockPersonas()), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const responseData = await response.json();
    console.log("Groq API full response:", responseData);

    const content = responseData.choices[0].message.content;
    console.log("Raw content from API:", content);
    
    try {
      const parsedResponse = extractJSONFromResponse(content);
      console.log("Successfully parsed response:", parsedResponse);
      
      if (!parsedResponse.personas || !Array.isArray(parsedResponse.personas)) {
        console.error("Invalid response structure:", parsedResponse);
        throw new Error("Response doesn't contain the expected personas array");
      }
      
      parsedResponse.personas = parsedResponse.personas.map((persona: any, index: number) => {
        if (!persona.id) {
          persona.id = `persona-${index + 1}`;
        }
        return persona;
      });
      
      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      console.log('Falling back to mock data due to parse error');
      return new Response(JSON.stringify(getMockPersonas()), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-personas function:', error);
    console.log('Falling back to mock data due to function error');
    return new Response(JSON.stringify(getMockPersonas()), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
