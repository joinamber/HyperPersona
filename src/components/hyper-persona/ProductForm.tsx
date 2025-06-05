import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import our new components
import CategorySelector from './CategorySelector';
import ImageUploader, { ProductImage } from './ImageUploader';
import TextInputField from './TextInputField';
import FormHeader from './FormHeader';
import SubmitButton from './SubmitButton';

// Define the shape of the form values
export interface FormValues {
  productName: string;
  productDescription: string;
  productCategories: string[];
  productReviews?: string;
}

// Define a Zod schema for form validation
const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productDescription: z.string().min(300, {
    message: "Product description must be at least 300 characters.",
  }),
  productCategories: z.array(z.string()).min(1, {
    message: "Please select at least one category tag.",
  }).max(5, {
    message: "You can select up to 5 category tags maximum.",
  }),
  productReviews: z.string().optional(),
});

interface ProductFormProps {
  onSubmit: (data: FormValues) => void;
  isGenerating: boolean;
  productImages: ProductImage[];
  setProductImages: (images: ProductImage[]) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  isGenerating, 
  productImages, 
  setProductImages 
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      productCategories: [],
      productReviews: "",
    },
  });

  // Watch the product description to get real-time character count
  const productDescription = form.watch("productDescription");
  const descriptionLength = productDescription?.length || 0;
  const isDescriptionValid = descriptionLength >= 300;

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    const formData = { ...values, productCategories: selectedCategories };
    onSubmit(formData);
    // Removed form.reset() to keep the form data after submission
  };

  // Handle category tag selection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Remove category
        const newCategories = prev.filter(cat => cat !== category);
        form.setValue("productCategories", newCategories);
        return newCategories;
      } else if (prev.length < 5) {
        // Add category (only if under limit)
        const newCategories = [...prev, category];
        form.setValue("productCategories", newCategories);
        return newCategories;
      }
      return prev;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      <FormHeader 
        title="Describe Your Product" 
        subtitle="Tell us about your product and we'll generate detailed customer personas" 
      />

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <TextInputField 
          id="productName"
          label="Product Name"
          required={true}
          placeholder="Enter product name"
          register={form.register("productName")}
          error={form.formState.errors.productName?.message}
        />

        <TextInputField 
          id="productDescription"
          label="Product Description"
          required={true}
          type="textarea"
          rows={4}
          placeholder="Enter detailed product description (minimum 300 characters)"
          register={form.register("productDescription")}
          error={form.formState.errors.productDescription?.message}
          description="Minimum 300 characters required for better persona generation"
          characterCount={{
            current: descriptionLength,
            required: 300,
            valid: isDescriptionValid
          }}
        />

        <CategorySelector 
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          errorMessage={form.formState.errors.productCategories?.message}
        />

        <TextInputField 
          id="productReviews"
          label="Customer Review Snippets"
          required={false}
          type="textarea"
          rows={3}
          placeholder="Enter customer review snippets (optional)"
          register={form.register("productReviews")}
        />

        <ImageUploader 
          productImages={productImages} 
          onImagesChange={setProductImages} 
        />

        <SubmitButton 
          isGenerating={isGenerating}
          label="Generate Personas"
          loadingLabel="Generating Personas..."
        />
      </form>
    </div>
  );
};

export default ProductForm;
