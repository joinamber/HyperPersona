
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ProductForm, { ProductImage, FormValues } from '@/components/hyper-persona/ProductForm';
import PersonaCard from '@/components/hyper-persona/PersonaCard';
import EmptyState from '@/components/hyper-persona/EmptyState';
import ApiKeyInput from '@/components/hyper-persona/ApiKeyInput';
import { generatePersonas, Persona } from '@/services/personaService';

const HyperPersona = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { toast } = useToast();
  
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

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    try {
      const response = await generatePersonas(data, productImages);
      setPersonas(response.personas);
      toast({
        title: "Personas generated successfully!",
        description: "View your customer personas below.",
      });
    } catch (error) {
      toast({
        title: "Error generating personas",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">HyperPersona</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your product description into detailed customer personas with AI-powered insights
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <ApiKeyInput />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <ProductForm 
          onSubmit={onSubmit} 
          isGenerating={isGenerating} 
          productImages={productImages} 
          setProductImages={setProductImages} 
        />

        {/* Results Section */}
        <div className="space-y-8">
          {personas.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold">Your Customer Personas</h2>
              {personas.map((persona) => (
                <PersonaCard 
                  key={persona.id} 
                  persona={persona} 
                  refreshPersona={refreshPersona}
                  generateSurvey={generateSurvey}
                  exportPersona={exportPersona}
                />
              ))}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default HyperPersona;
