
import { FormValues, ProductImage } from '@/components/hyper-persona/ProductForm';
import { supabase } from '@/integrations/supabase/client';

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
    const { data: result, error } = await supabase.functions.invoke('generate-personas', {
      body: {
        data,
        images
      }
    });

    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(`Edge Function error: ${error.message}`);
    }

    console.log("Edge Function response:", result);
    return result;
  } catch (error) {
    console.error('Error calling Edge Function:', error);
    throw error;
  }
};
