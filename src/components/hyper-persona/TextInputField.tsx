
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
      <Label htmlFor={id} className="eyebrow flex items-center gap-1 mb-2">
        {label}
        {required && <span className="text-primary">*</span>}
        <span className="normal-case tracking-normal opacity-70">
          {required ? '(Required)' : '(Optional)'}
        </span>
      </Label>

      <div className="relative">
        {type === "textarea" ? (
          <Textarea
            id={id}
            {...register}
            rows={rows}
            placeholder={placeholder}
            className="block w-full text-sm"
          />
        ) : (
          <Input
            id={id}
            type="text"
            {...register}
            placeholder={placeholder}
            className="block w-full text-sm"
          />
        )}

        {characterCount && (
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
            <div className={`text-xs font-mono ${
              characterCount.valid
                ? 'text-secondary'
                : characterCount.current > 0
                  ? 'text-primary'
                  : 'text-muted-foreground'
            }`}>
              {characterCount.current}/{characterCount.required}
              {characterCount.valid && (
                <span className="ml-1">✓</span>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-destructive text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default TextInputField;
