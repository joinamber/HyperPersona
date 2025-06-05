
import React from 'react';

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-indigo-600 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default FormHeader;
