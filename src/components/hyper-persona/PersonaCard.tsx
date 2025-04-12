
import React from 'react';
import { 
  UserCheck, Briefcase, MapPin, Heart, 
  ShoppingCart, Target, MessageCircle, 
  RotateCw, MessageSquare, FileText 
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Persona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  location: string;
  interests: string[];
  values: string[];
  purchaseBehavior: string[];
  reasoning: string;
  researchQuestions: string[];
  marketingChannel: string;
}

interface PersonaCardProps {
  persona: Persona;
  refreshPersona: (personaId: string) => void;
  generateSurvey: (personaId: string) => void;
  exportPersona: (personaId: string) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ 
  persona, 
  refreshPersona, 
  generateSurvey, 
  exportPersona 
}) => {
  return (
    <Card key={persona.id} className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-primary" />
              {persona.name}
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-x-4 mt-1">
              <span className="flex items-center">
                <Briefcase className="mr-1 h-3.5 w-3.5" />
                {persona.occupation}
              </span>
              <span className="flex items-center">
                <MapPin className="mr-1 h-3.5 w-3.5" />
                {persona.location}
              </span>
              <span>{persona.age}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium flex items-center mb-2">
              <Heart className="mr-2 h-4 w-4 text-rose-500" />
              Interests & Values
            </h3>
            <div>
              <h4 className="text-xs text-muted-foreground mb-1">Interests</h4>
              <div className="flex flex-wrap gap-1.5">
                {persona.interests.map((interest, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <h4 className="text-xs text-muted-foreground mb-1">Values</h4>
              <div className="flex flex-wrap gap-1.5">
                {persona.values.map((value, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center mb-2">
              <ShoppingCart className="mr-2 h-4 w-4 text-amber-500" />
              Purchase Behavior
            </h3>
            <ul className="text-sm space-y-1">
              {persona.purchaseBehavior.map((behavior, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></span>
                  {behavior}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium flex items-center mb-2">
              <Target className="mr-2 h-4 w-4 text-blue-500" />
              Why This Persona Fits
            </h3>
            <p className="text-sm">{persona.reasoning}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center mb-2">
              <MessageCircle className="mr-2 h-4 w-4 text-purple-500" />
              Research Questions
            </h3>
            <ol className="text-sm list-decimal list-inside space-y-1">
              {persona.researchQuestions.map((question, idx) => (
                <li key={idx}>{question}</li>
              ))}
            </ol>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center mb-2">
              <MessageSquare className="mr-2 h-4 w-4 text-emerald-500" />
              Best Marketing Channel
            </h3>
            <p className="text-sm">{persona.marketingChannel}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center"
          onClick={() => refreshPersona(persona.id)}
        >
          <RotateCw className="mr-1.5 h-3.5 w-3.5" />
          Refresh Persona
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center"
          onClick={() => generateSurvey(persona.id)}
        >
          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
          Generate Survey
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center"
          onClick={() => exportPersona(persona.id)}
        >
          <FileText className="mr-1.5 h-3.5 w-3.5" />
          Export Persona
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonaCard;
