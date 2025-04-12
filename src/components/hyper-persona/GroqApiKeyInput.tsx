
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GroqApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('groq_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const validateApiKey = (key: string): boolean => {
    // Check if key looks like a Groq API key (typically starts with "gsk_")
    if (!key.trim().startsWith('gsk_')) {
      setKeyError("Groq API keys should start with 'gsk_'");
      return false;
    }
    setKeyError(null);
    return true;
  };

  const handleSaveKey = () => {
    if (apiKey.trim() && validateApiKey(apiKey)) {
      localStorage.setItem('groq_api_key', apiKey.trim());
      toast({
        title: "API key saved",
        description: "Your Groq API key has been saved for this session.",
      });
      
      // Log to confirm the key has been saved
      console.log("Groq API key saved to localStorage (first 3 chars):", apiKey.substring(0, 3) + '***');
      
      setIsVisible(false);
      setKeyError(null);
    } else if (!apiKey.trim()) {
      setKeyError("Please enter a valid Groq API key");
      toast({
        title: "Invalid API key",
        description: "Please enter a valid Groq API key.",
        variant: "destructive",
      });
    }
  };

  // Function to clear the API key
  const handleClearKey = () => {
    localStorage.removeItem('groq_api_key');
    setApiKey('');
    setKeyError(null);
    toast({
      title: "API key cleared",
      description: "Your Groq API key has been removed.",
    });
    console.log("Groq API key removed from localStorage");
  };

  return (
    <div className="mb-6">
      {!isVisible ? (
        <div className="flex flex-col sm:flex-row items-center gap-2">
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
          {!apiKey && (
            <div className="mt-2 sm:mt-0 flex items-center text-amber-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Groq API key required for real personas</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                if (keyError) validateApiKey(e.target.value);
              }}
              placeholder="Enter your Groq API key (starts with gsk_)"
              className={`flex-1 ${keyError ? 'border-red-300' : ''}`}
            />
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button 
                onClick={handleSaveKey}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Save
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setIsVisible(false);
                  setKeyError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
          {keyError && (
            <p className="text-xs text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {keyError}
            </p>
          )}
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
            <p>
              Make sure to use a Groq API key that starts with "gsk_". Get a key at <a href="https://console.groq.com/keys" className="text-indigo-600 hover:underline" target="_blank" rel="noreferrer">console.groq.com/keys</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroqApiKeyInput;
