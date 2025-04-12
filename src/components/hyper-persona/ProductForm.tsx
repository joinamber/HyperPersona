
import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Upload, X, Target } from 'lucide-react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Define product categories
const productCategories = [
  { value: "tech", label: "Technology" },
  { value: "fashion", label: "Fashion" },
  { value: "beauty", label: "Beauty" },
  { value: "health", label: "Health & Wellness" },
  { value: "fitness", label: "Fitness" },
  { value: "food", label: "Food & Beverages" },
  { value: "home", label: "Home & Decor" },
  { value: "pets", label: "Pet Products" },
  { value: "kids", label: "Kids & Babies" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Financial Services" },
  { value: "travel", label: "Travel" },
];

// Define form schema with Zod
const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productDescription: z.string().min(300, {
    message: "Product description must be at least 300 characters.",
  }),
  productCategories: z.array(z.string()).min(1, {
    message: "Select at least one category."
  }).max(3, {
    message: "You can select up to 3 categories."
  }),
  productReviews: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
export interface ProductImage {
  file: File;
  preview: string;
}

interface ProductFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  isGenerating: boolean;
  productImages: ProductImage[];
  setProductImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  isGenerating, 
  productImages, 
  setProductImages 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      productCategories: [],
      productReviews: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Check if adding new files would exceed the limit
    if (productImages.length + files.length > 3) {
      toast({
        title: "Maximum 3 images allowed",
        description: "Please remove some images before adding more.",
        variant: "destructive",
      });
      return;
    }

    // Process each file
    Array.from(files).forEach(file => {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB limit.`,
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPG and PNG files are allowed.",
          variant: "destructive",
        });
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImages(prev => [...prev, {
          file,
          preview: e.target?.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data);
  };

  return (
    <Card className="lg:sticky lg:top-4 lg:self-start">
      <CardHeader>
        <CardTitle>Tell us about your product</CardTitle>
        <CardDescription>
          Provide details about your product to generate accurate customer personas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="product-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MarketPro Analytics Suite" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description (min 300 characters)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your product in detail, including key features, benefits, and how it solves problems for your customers..." 
                      className="min-h-32 resize-y"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    <span className={field.value.length < 300 ? "text-destructive" : ""}>
                      {field.value.length}/300 characters
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="productCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select up to 3 categories</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productCategories.map(category => (
                      <Button
                        key={category.value}
                        type="button"
                        variant={field.value.includes(category.value) ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => {
                          if (field.value.includes(category.value)) {
                            // Remove category
                            field.onChange(field.value.filter(val => val !== category.value));
                          } else if (field.value.length < 3) {
                            // Add category if less than 3 are selected
                            field.onChange([...field.value, category.value]);
                          } else {
                            // Show toast if trying to add more than 3
                            toast({
                              title: "Maximum 3 categories",
                              description: "Please remove a category before adding another.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image Upload Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base">Product Images (Optional)</FormLabel>
                <FormDescription>
                  {productImages.length}/3 images
                </FormDescription>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {productImages.map((image, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={image.preview}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {productImages.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-20 h-20 flex flex-col items-center justify-center gap-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-xs">Upload</span>
                  </Button>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png"
                multiple
                className="hidden"
              />
              
              <FormDescription>
                JPG/PNG only, max 5MB per image
              </FormDescription>
            </div>
            
            <FormField
              control={form.control}
              name="productReviews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Reviews (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste 1-5 customer reviews or testimonials..." 
                      className="min-h-24 resize-y"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Including real feedback can improve persona accuracy
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          form="product-form"
          type="submit" 
          className="w-full" 
          disabled={isGenerating || form.watch("productDescription").length < 300}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Personas...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Find My Customers
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
