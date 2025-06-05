
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ProductForm, { FormValues } from '@/components/hyper-persona/ProductForm';
import { ProductImage } from '@/components/hyper-persona/ImageUploader';
import PersonaCard from '@/components/hyper-persona/PersonaCard';
import EmptyState from '@/components/hyper-persona/EmptyState';
import UserProfile from '@/components/UserProfile';
import { generatePersonas, Persona } from '@/services/personaService';
import { Zap, LineChart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HyperPersona = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { toast } = useToast();
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Check for pending form submission after authentication
  useEffect(() => {
    if (user && !loading) {
      const pendingFormData = localStorage.getItem('pendingFormData');
      const pendingImages = localStorage.getItem('pendingProductImages');
      
      if (pendingFormData) {
        try {
          const formData = JSON.parse(pendingFormData);
          const images = pendingImages ? JSON.parse(pendingImages) : [];
          
          // Clear the stored data
          localStorage.removeItem('pendingFormData');
          localStorage.removeItem('pendingProductImages');
          
          // Auto-submit the form
          handlePersonaGeneration(formData, images);
        } catch (error) {
          console.error('Error processing pending form data:', error);
          localStorage.removeItem('pendingFormData');
          localStorage.removeItem('pendingProductImages');
        }
      }
    }
  }, [user, loading]);

  const handlePersonaGeneration = async (data: FormValues, images: ProductImage[]) => {
    setIsGenerating(true);
    try {
      console.log("Submitting form data to generate personas");
      const response = await generatePersonas(data, images);
      console.log("Response received:", response);
      setPersonas(response.personas);
      toast({
        title: "Personas generated successfully!",
        description: "View your customer personas below.",
      });
    } catch (error) {
      console.error("Error in persona generation:", error);
      toast({
        title: "Error generating personas",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
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

  const onSubmit = async (data: FormValues) => {
    // Check if user is authenticated, if not, store data and sign in
    if (!user) {
      try {
        // Store form data and images before authentication
        localStorage.setItem('pendingFormData', JSON.stringify(data));
        localStorage.setItem('pendingProductImages', JSON.stringify(productImages));
        
        // Show a toast to inform user about the process
        toast({
          title: "Signing in...",
          description: "We'll generate your personas after you sign in with Google.",
        });
        
        await signInWithGoogle();
        // The useEffect above will handle form submission after successful login
        return;
      } catch (error) {
        console.error('Sign in error:', error);
        // Clear stored data on error
        localStorage.removeItem('pendingFormData');
        localStorage.removeItem('pendingProductImages');
        toast({
          title: "Sign in failed",
          description: "Please try signing in again to generate personas.",
          variant: "destructive",
        });
        return;
      }
    }

    // User is authenticated, proceed with persona generation
    await handlePersonaGeneration(data, productImages);
  };

  const handleContactClick = () => {
    window.location.href = 'mailto:hello@coaltlab.com';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 flex items-center justify-center">
        <div className="text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header with User Profile */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-indigo-600 font-sans">HyperPersona</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your product description into detailed customer personas with AI-powered insights
            </p>
          </div>
          {user && (
            <div className="absolute top-4 right-4">
              <UserProfile />
            </div>
          )}
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
            {user && personas.length > 0 ? (
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

      {/* Bottom CTA Banner */}
      <div className="bg-indigo-600 py-16 mt-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your User Research?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join forward-thinking companies using AI-powered personas to gain deeper insights, faster and more affordably.
          </p>
          <Button 
            onClick={handleContactClick}
            className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-6 h-auto font-semibold"
          >
            Contact Us Today
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-bold text-xl">HYPERPERSONA</div>
            <div className="text-sm text-indigo-200">© 2025 HyperPersona. All rights reserved.</div>
            <div className="text-sm text-right">
              <div className="font-medium">A venture of Co.Alt Lab</div>
              <div>hello@coaltlab.com</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HyperPersona;
