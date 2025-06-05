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

// Define a Zod schema for form validation
const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productDescription: z.string().min(10, {
    message: "Product description must be at least 10 characters.",
  }),
  productCategories: z.string().min(2, {
    message: "Please enter at least one category tag.",
  }).array().min(1, {
    message: "Please enter at least one category tag.",
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

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
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

  // Handle category tag input
  const [categoryInput, setCategoryInput] = useState('');

  const handleAddCategory = () => {
    const newCategory = categoryInput.trim();
    if (newCategory && !form.getValues().productCategories.includes(newCategory)) {
      form.setValue("productCategories", [...form.getValues().productCategories, newCategory]);
    }
    setCategoryInput('');
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    form.setValue("productCategories", form.getValues().productCategories.filter(category => category !== categoryToRemove));
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
            Product Name
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
            Product Description
          </Label>
          <Textarea
            id="productDescription"
            {...form.register("productDescription")}
            rows={4}
            placeholder="Enter product description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {form.formState.errors.productDescription && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.productDescription.message}</p>
          )}
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Category Tags
          </Label>
          <div className="mt-1 flex flex-wrap gap-2">
            {form.getValues().productCategories.map((category) => (
              <Badge key={category} className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1">
                {category}
                <button type="button" onClick={() => handleRemoveCategory(category)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              type="text"
              placeholder="Add category tag"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
          {form.formState.errors.productCategories && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.productCategories.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="productReviews" className="block text-sm font-medium text-gray-700">
            Customer Review Snippets (Optional)
          </Label>
          <Textarea
            id="productReviews"
            {...form.register("productReviews")}
            rows={3}
            placeholder="Enter customer review snippets"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Product Images
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
