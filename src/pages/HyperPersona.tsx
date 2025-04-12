
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ProductForm, { ProductImage, FormValues } from '@/components/hyper-persona/ProductForm';
import PersonaCard from '@/components/hyper-persona/PersonaCard';
import EmptyState from '@/components/hyper-persona/EmptyState';
import ApiKeyInput from '@/components/hyper-persona/ApiKeyInput';
import { generatePersonas, Persona } from '@/services/personaService';
import { Zap, LineChart, DollarSign } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-indigo-600 font-sans">HyperPersona</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your product description into detailed customer personas with AI-powered insights
          </p>
        </div>

        {/* Why Synthetic User Research Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-indigo-600 text-center mb-12">Why Synthetic User Research?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="text-coral-500 mb-4">
                <Zap size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">10x Faster Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive user insights in hours instead of weeks. No more scheduling delays or participant no-shows.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="text-coral-500 mb-4">
                <LineChart size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Unlimited Scale</h3>
              <p className="text-gray-600 leading-relaxed">
                Test with hundreds or thousands of synthetic users representing your exact target demographics.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="text-coral-500 mb-4">
                <DollarSign size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">80% Cost Reduction</h3>
              <p className="text-gray-600 leading-relaxed">
                Dramatically reduce research costs while increasing the breadth and depth of insights.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <ApiKeyInput />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
                <h2 className="text-2xl font-bold text-indigo-600">Your Customer Personas</h2>
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
    </div>
  );
};

export default HyperPersona;
