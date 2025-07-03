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
  );
};

export default PersonaResults;