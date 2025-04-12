
import { FormValues, ProductImage } from '@/components/hyper-persona/ProductForm';

export interface Persona {
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

/**
 * Creates a structured prompt for LLM to generate customer personas
 */
const createPersonaPrompt = (data: FormValues, images: ProductImage[]): string => {
  // Convert image data to descriptions for the prompt
  const imageDescriptions = images.map((img, index) => 
    `[Photo ${index + 1} Description: Product image showing ${img.file.name}]`
  ).join('\n');

  // Build the structured prompt
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

Respond in structured JSON format that matches the following structure:
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
`;
};

/**
 * Generate personas using the Groq API
 */
export const generatePersonas = async (data: FormValues, images: ProductImage[]): Promise<any> => {
  const prompt = createPersonaPrompt(data, images);
  console.log("Generated prompt for LLM:", prompt);
  
  // Get the Groq API key from localStorage
  const apiKey = localStorage.getItem('groq_api_key');
  
  if (!apiKey) {
    console.log("No Groq API key found, using mock data");
    return getMockPersonas();
  }
  
  try {
    console.log("Making API call to Groq with key:", apiKey.substring(0, 3) + '***');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // Groq's llama3 model
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

    const responseData = await response.json();
    console.log("Groq API response:", responseData);

    if (!response.ok) {
      console.error('API Error:', responseData);
      throw new Error(`API error: ${response.status} - ${responseData.error?.message || 'Unknown error'}`);
    }
    
    // Parse the LLM response which should be in JSON format
    try {
      // Extract the content from the response
      const content = responseData.choices[0].message.content;
      console.log("Raw content from API:", content);
      
      // Parse the JSON from the content
      const parsedResponse = JSON.parse(content);
      console.log("Parsed response:", parsedResponse);
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      throw new Error('Failed to parse LLM response');
    }
  } catch (error) {
    console.error('Error calling Groq API:', error);
    // Fall back to mock data if the API call fails
    return getMockPersonas();
  }
};

// Mock data function for fallback or development
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
