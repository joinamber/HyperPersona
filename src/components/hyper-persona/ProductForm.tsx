
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2 } from 'lucide-react';

// Define the shape of the form values
export interface FormValues {
  productName: string;
  productDescription: string;
  productCategories: string[];
  productReviews?: string;
}

// Define the shape of the product image
export interface ProductImage {
  file: File;
  preview: string;
}

// Comprehensive list of category tags
const CATEGORY_TAGS = [
  // Technology & Electronics
  'Technology', 'Electronics', 'Software', 'Mobile Apps', 'Gaming', 'Smart Home', 'Wearables', 'Audio', 'Video', 'Photography',
  
  // Fashion & Beauty
  'Fashion', 'Clothing', 'Accessories', 'Jewelry', 'Beauty', 'Skincare', 'Cosmetics', 'Hair Care', 'Footwear', 'Bags',
  
  // Health & Wellness
  'Health', 'Wellness', 'Fitness', 'Nutrition', 'Medical', 'Mental Health', 'Supplements', 'Exercise Equipment', 'Healthcare',
  
  // Home & Living
  'Home & Garden', 'Furniture', 'Kitchen', 'Appliances', 'Decor', 'Cleaning', 'Storage', 'Bedding', 'Lighting', 'Tools',
  
  // Food & Beverage
  'Food', 'Beverages', 'Snacks', 'Organic', 'Gourmet', 'Dietary', 'Cooking', 'Baking', 'Coffee', 'Tea',
  
  // Sports & Outdoors
  'Sports', 'Outdoors', 'Recreation', 'Camping', 'Hiking', 'Water Sports', 'Winter Sports', 'Team Sports', 'Individual Sports',
  
  // Business & Professional
  'Business', 'Professional', 'B2B', 'Office Supplies', 'Marketing', 'Education', 'Training', 'Consulting', 'Finance',
  
  // Entertainment & Media
  'Entertainment', 'Media', 'Books', 'Movies', 'Music', 'Art', 'Crafts', 'Hobbies', 'Collectibles', 'Toys',
  
  // Travel & Transportation
  'Travel', 'Transportation', 'Luggage', 'Travel Accessories', 'Tourism', 'Hotels', 'Airlines', 'Car Accessories',
  
  // Lifestyle & Personal
  'Lifestyle', 'Personal Care', 'Self-Improvement', 'Relationships', 'Parenting', 'Pet Care', 'Gifts', 'Luxury',
  
  // Sustainability & Environment
  'Sustainable', 'Eco-Friendly', 'Green', 'Environmental', 'Renewable', 'Recycled', 'Organic', 'Natural',
  
  // Age & Demographics
  'Kids', 'Teens', 'Adults', 'Seniors', 'Baby', 'Toddler', 'Family', 'Men', 'Women', 'Unisex',
  
  // Price Points
  'Budget', 'Mid-Range', 'Premium', 'Luxury', 'Affordable', 'Value', 'High-End', 'Economy'
];

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
  const [uploading, setUploading] = useState(false);
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
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const newImages = await Promise.all(
        files.map(
          (file): Promise<ProductImage> => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({ file: file, preview: reader.result as string });
              reader.onerror = () => reject();
              reader.readAsDataURL(file);
            });
          }
        )
      );

      setProductImages([...productImages, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = (indexToRemove: number) => {
    setProductImages(productImages.filter((_, index) => index !== indexToRemove));
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Describe Your Product</h2>
        <p className="text-gray-600">Tell us about your product and we'll generate detailed customer personas</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 font-normal ml-1">(Required)</span>
          </Label>
          <Input
            id="productName"
            type="text"
            {...form.register("productName")}
            placeholder="Enter product name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {form.formState.errors.productName && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.productName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
            Product Description <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 font-normal ml-1">(Required)</span>
          </Label>
          <div className="mt-1 relative">
            <Textarea
              id="productDescription"
              {...form.register("productDescription")}
              rows={4}
              placeholder="Enter detailed product description (minimum 300 characters)"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Minimum 300 characters required for better persona generation
              </p>
              <div className={`text-xs font-medium ${
                isDescriptionValid 
                  ? 'text-green-600' 
                  : descriptionLength > 0 
                    ? 'text-orange-600' 
                    : 'text-gray-500'
              }`}>
                {descriptionLength}/300 characters
                {isDescriptionValid && (
                  <span className="ml-1 text-green-600">✓</span>
                )}
              </div>
            </div>
          </div>
          {form.formState.errors.productDescription && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.productDescription.message}</p>
          )}
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Category Tags <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 font-normal ml-1">(Required - Select up to 5)</span>
          </Label>
          
          {/* Selected Tags Display */}
          <div className="mb-4 min-h-[40px] p-3 border border-gray-200 rounded-md bg-gray-50">
            {selectedCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge key={category} className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1">
                    {category}
                    <button type="button" onClick={() => handleCategoryToggle(category)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No categories selected</p>
            )}
          </div>

          {/* Available Tags Grid */}
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CATEGORY_TAGS.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const isDisabled = !isSelected && selectedCategories.length >= 5;
                
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    disabled={isDisabled}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : isDisabled
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Selected: {selectedCategories.length}/5 categories
          </p>
          
          {form.formState.errors.productCategories && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.productCategories.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="productReviews" className="block text-sm font-medium text-gray-700">
            Customer Review Snippets 
            <span className="text-xs text-gray-500 font-normal ml-1">(Optional)</span>
          </Label>
          <Textarea
            id="productReviews"
            {...form.register("productReviews")}
            rows={3}
            placeholder="Enter customer review snippets (optional)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Product Images 
            <span className="text-xs text-gray-500 font-normal ml-1">(Optional)</span>
          </Label>
          <div className="mt-1 flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-5">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-indigo-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </>
                )}
              </div>
              <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>

          {productImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image.preview} alt={`Product ${index + 1}`} className="rounded-md object-cover aspect-square" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Personas...
            </>
          ) : (
            "Generate Personas"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
