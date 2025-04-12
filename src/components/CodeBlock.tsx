
import React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = 'javascript', 
  title,
  className
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-lg overflow-hidden bg-gray-900 my-4", className)}>
      {title && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">{title}</div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">{language}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language} text-sm`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
