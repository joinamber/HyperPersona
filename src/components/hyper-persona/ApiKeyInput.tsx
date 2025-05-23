
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      toast({
        title: "API key saved",
        description: "Your API key has been saved for this session.",
      });
      setIsVisible(false);
    } else {
      toast({
        title: "Invalid API key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-6">
      {!isVisible ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          onClick={() => setIsVisible(true)}
        >
          <Key className="h-4 w-4" />
          {apiKey ? "Change API Key" : "Add OpenAI API Key"}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
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

export default ApiKeyInput;
