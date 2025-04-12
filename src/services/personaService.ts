
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

// Mock AI response function (to be replaced with real API in production)
export const generatePersonas = async (data: FormValues, images: ProductImage[]): Promise<any> => {
  // Simulate API call with timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
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
      });
    }, 1500);
  });
};
