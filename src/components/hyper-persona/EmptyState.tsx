
import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

const EmptyState: React.FC = () => {
  return (
    <Card className="rounded-2xl border-border/60 p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <User className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg">Nobody here yet</h3>
          <p className="text-muted-foreground">
            Fill out the form and hit "Generate Personas" — your first customer will show up right here.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            HyperPersona reads your product details to find the people most likely to care.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmptyState;
