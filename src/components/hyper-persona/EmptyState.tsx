
import React from 'react';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';

const EmptyState: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <User className="h-12 w-12 text-muted-foreground" />
        <div>
          <h3 className="text-lg font-medium">No personas generated yet</h3>
          <p className="text-muted-foreground">
            Fill out the form and click "Find My Customers" to generate personas
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmptyState;
