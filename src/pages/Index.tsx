
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlideContent from '@/components/SlideContent';
import SlideControls from '@/components/SlideControls';
import { slides } from '@/data/slideData';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [direction, setDirection] = useState(0);
  
  const totalSlides = slides.length;
  
  // Navigate with keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSlide < totalSlides) {
        setDirection(1);
        setCurrentSlide(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentSlide > 1) {
        setDirection(-1);
        setCurrentSlide(prev => prev - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides]);
  
  const handleNext = () => {
    if (currentSlide < totalSlides) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentSlide > 1) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };
  
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };
  
  return (
    <div className="overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.5 }}
          className={`min-h-screen w-full flex flex-col items-center justify-center p-4 text-white ${currentSlideData?.background || 'bg-gray-900'}`}
        >
          {currentSlideData && (
            <SlideContent
              title={currentSlideData.title}
              content={currentSlideData.content}
              contentType={currentSlideData.contentType}
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      <SlideControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default Index;
