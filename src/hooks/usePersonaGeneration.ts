import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePersonas, Persona } from '@/services/personaService';
import { ProductImage } from '@/components/hyper-persona/ImageUploader';
import { FormValues } from '@/components/hyper-persona/ProductForm';
import { securityLogger, SecurityEventType } from '@/utils/securityLogger';
import { apiRateLimiter, getClientIdentifier } from '@/utils/rateLimiter';

export const usePersonaGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { toast } = useToast();

  const handlePersonaGeneration = async (data: FormValues, images: ProductImage[]) => {
    // Check rate limit
    const clientId = getClientIdentifier();
    const rateLimitCheck = apiRateLimiter.checkLimit(clientId);
    
    if (!rateLimitCheck.allowed) {
      toast({
        title: "Too many requests",
        description: `Please wait ${rateLimitCheck.retryAfter} seconds before trying again.`,
        variant: "destructive",
      });
      securityLogger.log(SecurityEventType.RATE_LIMIT_EXCEEDED, { endpoint: 'generatePersonas' }, 'high');
      return;
    }

    setIsGenerating(true);
    
    // Log form submission
    securityLogger.log(SecurityEventType.FORM_SUBMISSION, {
      productName: data.productName,
      hasImages: images.length > 0,
      imageCount: images.length
    }, 'low');

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Submitting form data to generate personas");
      }
      const response = await generatePersonas(data, images);
      if (process.env.NODE_ENV === 'development') {
        console.log("Response received:", response);
      }
      setPersonas(response.personas);
      toast({
        title: "Personas generated successfully!",
        description: `Generated ${response.personas.length} customer personas for your product.`,
      });
    } catch (error) {
      console.error("Error in persona generation:", error);
      securityLogger.log(SecurityEventType.SUSPICIOUS_ACTIVITY, {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: 'generatePersonas'
      }, 'medium');
      toast({
        title: "Error generating personas",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      setPersonas([]); // Clear personas on error
    } finally {
      setIsGenerating(false);
    }
  };

  const refreshPersona = (personaId: string) => {
    toast({
      title: "Refreshing persona",
      description: "This feature will be available in the full version.",
    });
  };

  const generateSurvey = (personaId: string) => {
    toast({
      title: "Generating survey",
      description: "This feature will be available in the full version.",
    });
  };

  const exportPersona = (personaId: string) => {
    toast({
      title: "Exporting persona",
      description: "This feature will be available in the full version.",
    });
  };

  return {
    isGenerating,
    personas,
    handlePersonaGeneration,
    refreshPersona,
    generateSurvey,
    exportPersona
  };
};