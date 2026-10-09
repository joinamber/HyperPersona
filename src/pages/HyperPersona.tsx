
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ProductForm, { FormValues } from '@/components/hyper-persona/ProductForm';
import { ProductImage } from '@/components/hyper-persona/ImageUploader';
import UserProfile from '@/components/UserProfile';
import Hero from '@/components/hyper-persona/Hero';
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

  // index.html ships the hero as static HTML (see the note there). When it's
  // present React renders only the rest of the page, so the hero is never
  // replaced and its first paint stays the LCP. The fallback <Hero> covers
  // client-side navigation back to "/" after the static copy has been removed.
  const hasStaticHero = !!document.getElementById('static-hero');
  const heroUserSlot = document.getElementById('hero-user-slot');

  if (loading) {
    return hasStaticHero ? null : (
      <div className="min-h-screen bg-background">
        <Hero />
      </div>
    );
  }

  // Determine what to show in the results section
  const showPersonas = user && personas.length > 0;
  const showEmptyState = !hasSubmitted || (!showPersonas && !isGenerating);

  return (
    <div className={hasStaticHero ? 'bg-background' : 'min-h-screen bg-background'}>
      {hasStaticHero ? (
        user && heroUserSlot ? createPortal(<UserProfile />, heroUserSlot) : null
      ) : (
        <Hero userSlot={user ? <UserProfile /> : undefined} />
      )}

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-7xl">
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
      <CTABanner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HyperPersona;
