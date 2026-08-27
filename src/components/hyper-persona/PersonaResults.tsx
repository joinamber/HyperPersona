import PersonaCard from './PersonaCard';
import EmptyState from './EmptyState';
import { Persona } from '@/services/personaService';

interface PersonaResultsProps {
  isGenerating: boolean;
  personas: Persona[];
  showPersonas: boolean;
  showEmptyState: boolean;
  refreshPersona: (personaId: string) => void;
  generateSurvey: (personaId: string) => void;
  exportPersona: (personaId: string) => void;
}

const PersonaResults = ({
  isGenerating,
  personas,
  showPersonas,
  showEmptyState,
  refreshPersona,
  generateSurvey,
  exportPersona
}: PersonaResultsProps) => {
  return (
    <div className="space-y-8">
      {isGenerating && (
        <div className="bg-card rounded-2xl border border-border/60 p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl mb-2">Sketching your personas</h2>
          <p className="text-muted-foreground">Reading between the lines of your product to find the people who'd love it…</p>
        </div>
      )}

      {showPersonas && (
        <>
          <div className="bg-card rounded-2xl border border-border/60 p-6">
            <h2 className="text-2xl mb-2">Your customer personas</h2>
            <p className="text-muted-foreground">Here's who we think you're really building for:</p>
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
  );
};

export default PersonaResults;