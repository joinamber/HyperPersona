
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GroqApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('groq_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('groq_api_key', apiKey.trim());
      toast({
        title: "API key saved",
        description: "Your Groq API key has been saved for this session.",
      });
      
      // Log to confirm the key has been saved
      console.log("Groq API key saved to localStorage (first 3 chars):", apiKey.substring(0, 3) + '***');
      
      setIsVisible(false);
    } else {
      toast({
        title: "Invalid API key",
        description: "Please enter a valid Groq API key.",
        variant: "destructive",
      });
    }
  };

  // Function to clear the API key (useful for debugging)
  const handleClearKey = () => {
    localStorage.removeItem('groq_api_key');
    setApiKey('');
    toast({
      title: "API key cleared",
      description: "Your Groq API key has been removed.",
    });
    console.log("Groq API key removed from localStorage");
  };

  return (
    <div className="mb-6">
      {!isVisible ? (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            onClick={() => setIsVisible(true)}
          >
            <Key className="h-4 w-4" />
            {apiKey ? "Change Groq API Key" : "Add Groq API Key"}
          </Button>
          {apiKey && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
              onClick={handleClearKey}
            >
              Clear API Key
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="flex-1"
            />
            <Button 
              onClick={handleSaveKey}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Save
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      )}
    </div>
  );
};

export default GroqApiKeyInput;
