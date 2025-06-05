
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TextInputFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  placeholder: string;
  register: any;
  type?: "text" | "textarea";
  rows?: number;
  description?: string;
  characterCount?: {
    current: number;
    required: number;
    valid: boolean;
  };
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  id,
  label,
  required = false,
  error,
  placeholder,
  register,
  type = "text",
  rows = 4,
  description,
  characterCount
}) => {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {required ? (
          <span className="text-xs text-gray-500 font-normal ml-1">(Required)</span>
        ) : (
          <span className="text-xs text-gray-500 font-normal ml-1">(Optional)</span>
        )}
      </Label>
      
      <div className="mt-1 relative">
        {type === "textarea" ? (
          <Textarea
            id={id}
            {...register}
            rows={rows}
            placeholder={placeholder}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        ) : (
          <Input
            id={id}
            type="text"
            {...register}
            placeholder={placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        )}
        
        {characterCount && (
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {description}
            </p>
            <div className={`text-xs font-medium ${
              characterCount.valid 
                ? 'text-green-600' 
                : characterCount.current > 0 
                  ? 'text-orange-600' 
                  : 'text-gray-500'
            }`}>
              {characterCount.current}/{characterCount.required} characters
              {characterCount.valid && (
                <span className="ml-1 text-green-600">✓</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default TextInputField;
