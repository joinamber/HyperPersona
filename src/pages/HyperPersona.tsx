
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ProductForm, { FormValues } from '@/components/hyper-persona/ProductForm';
import { ProductImage } from '@/components/hyper-persona/ImageUploader';
import UserProfile from '@/components/UserProfile';
import WhySyntheticResearch from '@/components/hyper-persona/WhySyntheticResearch';
import PersonaResults from '@/components/hyper-persona/PersonaResults';
import CTABanner from '@/components/hyper-persona/CTABanner';
import Footer from '@/components/hyper-persona/Footer';
import SecureStorage from '@/utils/secureStorage';
import { usePersonaGeneration } from '@/hooks/usePersonaGeneration';

const HyperPersona = () => {
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<FormValues | undefined>(undefined);
  const { toast } = useToast();
  const { user, loading, signInWithGoogle } = useAuth();
  const {
    isGenerating,
    personas,
    handlePersonaGeneration,
    refreshPersona,
    generateSurvey,
    exportPersona
  } = usePersonaGeneration();

  // Check for pending form submission after authentication
  useEffect(() => {
    if (user && !loading) {
      const pendingFormData = SecureStorage.getItem('pendingFormData');
      const pendingImages = SecureStorage.getItem('pendingProductImages');
      
      if (pendingFormData) {
        try {
          const formData = JSON.parse(pendingFormData);
          const images = pendingImages ? JSON.parse(pendingImages) : [];
          
          // Set the form data to maintain the form state
          setCurrentFormData(formData);
          setProductImages(images);
          
          // Clear the stored data
          SecureStorage.removeItem('pendingFormData');
          SecureStorage.removeItem('pendingProductImages');
          
          // Auto-submit the form
          setHasSubmitted(true);
          handlePersonaGeneration(formData, images);
        } catch (error) {
          console.error('Error processing pending form data:', error);
          SecureStorage.removeItem('pendingFormData');
          SecureStorage.removeItem('pendingProductImages');
        }
      }
    }
  }, [user, loading, handlePersonaGeneration]);

  const onSubmit = async (data: FormValues) => {
    // Store the current form data to maintain state
    setCurrentFormData(data);
    
    // Check if user is authenticated, if not, store data and sign in
    if (!user) {
      try {
        // Store form data and images securely before authentication
        SecureStorage.setItem('pendingFormData', JSON.stringify(data), 30 * 60 * 1000); // 30 minutes
        SecureStorage.setItem('pendingProductImages', JSON.stringify(productImages), 30 * 60 * 1000);
        
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
        SecureStorage.removeItem('pendingFormData');
        SecureStorage.removeItem('pendingProductImages');
        toast({
          title: "Sign in failed",
          description: "Please try signing in again to generate personas.",
          variant: "destructive",
        });
        return;
      }
    }

    // User is authenticated, proceed with persona generation
    setHasSubmitted(true);
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
        <WhySyntheticResearch />

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
          <PersonaResults
            isGenerating={isGenerating}
            personas={personas}
            showPersonas={showPersonas}
            showEmptyState={showEmptyState}
            refreshPersona={refreshPersona}
            generateSurvey={generateSurvey}
            exportPersona={exportPersona}
          />
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <CTABanner copyEmailToClipboard={copyEmailToClipboard} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HyperPersona;
