
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const HyperPersona = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<FormValues | undefined>(undefined);
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
          
          // Set the form data to maintain the form state
          setCurrentFormData(formData);
          setProductImages(images);
          
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
    setHasSubmitted(true);
    try {
      console.log("Submitting form data to generate personas");
      const response = await generatePersonas(data, images);
      console.log("Response received:", response);
      setPersonas(response.personas);
      toast({
        title: "Personas generated successfully!",
        description: `Generated ${response.personas.length} customer personas for your product.`,
      });
    } catch (error) {
      console.error("Error in persona generation:", error);
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

  const onSubmit = async (data: FormValues) => {
    // Store the current form data to maintain state
    setCurrentFormData(data);
    
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

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('hello@coaltlab.com');
      toast({
        title: "Email copied!",
        description: "hello@coaltlab.com has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually copy: hello@coaltlab.com",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 flex items-center justify-center">
        <div className="text-indigo-600">Loading...</div>
      </div>
    );
  }

  // Determine what to show in the results section
  const showPersonas = user && personas.length > 0;
  const showEmptyState = !hasSubmitted || (!showPersonas && !isGenerating);

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
            initialValues={currentFormData}
          />

          {/* Results Section */}
          <div className="space-y-8">
            {isGenerating && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">Generating Your Personas</h2>
                <p className="text-gray-600">Our AI is analyzing your product and creating detailed customer personas...</p>
              </div>
            )}
            
            {showPersonas && (
              <>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-indigo-600 mb-2">Your Customer Personas</h2>
                  <p className="text-gray-600">Here are the detailed customer personas generated for your product:</p>
                </div>
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
            )}
            
            {showEmptyState && (
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-6 h-auto font-semibold">
                Contact Us Today
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Get in Touch</AlertDialogTitle>
                <AlertDialogDescription>
                  Ready to transform your user research? Contact us at:
                  <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                    <div className="text-lg font-semibold text-indigo-600">hello@coaltlab.com</div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={copyEmailToClipboard}>
                  Copy Email
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-bold text-xl">HYPERPERSONA</div>
            <div className="text-sm text-indigo-200">© 2025 HyperPersona. All rights reserved.</div>
            <div className="text-sm text-right">
              <div className="font-medium">A Venture of Co.Alt Lab</div>
              <div>hello@coaltlab.com</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HyperPersona;
