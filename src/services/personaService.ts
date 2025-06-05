
import { FormValues } from '@/components/hyper-persona/ProductForm';
import { ProductImage } from '@/components/hyper-persona/ImageUploader';
import { supabase } from '@/integrations/supabase/client';
import { sanitizePersona } from '@/utils/sanitizer';

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
 * Generate personas using the secure Supabase Edge Function
 */
export const generatePersonas = async (data: FormValues, images: ProductImage[]): Promise<any> => {
  console.log("Calling secure Edge Function to generate personas");
  
  try {
    // Validate required fields before sending
    if (!data.productName || !data.productDescription) {
      throw new Error('Product name and description are required');
    }

    const { data: result, error } = await supabase.functions.invoke('generate-personas', {
      body: {
        data,
        images
      }
    });

    if (error) {
      console.error('Edge Function error:', error);
      
      // Handle specific error types
      if (error.message?.includes('Unauthorized')) {
        throw new Error('Please sign in to generate personas');
      } else if (error.message?.includes('Rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again');
      } else if (error.message?.includes('Invalid input')) {
        throw new Error('Please check your input and try again');
      } else {
        throw new Error('Failed to generate personas. Please try again');
      }
    }

    if (!result || !result.personas) {
      throw new Error('No personas were generated. Please try again');
    }

    // Sanitize the personas before returning
    const sanitizedPersonas = result.personas
      .map(sanitizePersona)
      .filter(Boolean); // Remove any null results from sanitization

    if (sanitizedPersonas.length === 0) {
      throw new Error('Generated personas were invalid. Please try again');
    }

    console.log("Edge Function response processed successfully");
    return { personas: sanitizedPersonas };
  } catch (error) {
    console.error('Error calling Edge Function:', error);
    
    // Re-throw with user-friendly message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred. Please try again');
    }
  }
};
