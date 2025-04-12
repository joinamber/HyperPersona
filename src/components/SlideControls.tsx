
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

const SlideControls: React.FC<SlideControlsProps> = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext
}) => {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-4 z-50">
      <div className="bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-sm font-medium">
          {currentSlide} / {totalSlides}
        </span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevious}
          disabled={currentSlide === 1}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNext}
          disabled={currentSlide === totalSlides}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SlideControls;
