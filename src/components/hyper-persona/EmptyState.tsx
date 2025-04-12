
import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

const EmptyState: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <User className="h-12 w-12 text-muted-foreground" />
          <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2" />
        </div>
        <div>
          <h3 className="text-lg font-medium">No personas generated yet</h3>
          <p className="text-muted-foreground">
            Fill out the form and click "Find My Customers" to generate AI-powered personas
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Our AI analyzes your product details to identify high-potential customer segments
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmptyState;
