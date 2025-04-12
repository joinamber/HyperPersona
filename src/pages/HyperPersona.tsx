
import React, { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Loader2, Send, User, RotateCw, 
  MessageSquare, FileText, Upload, 
  X, UserCheck, MapPin, Briefcase, Heart, 
  ShoppingCart, Target, MessageCircle
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

type FormValues = z.infer<typeof formSchema>;

interface ProductImage {
  file: File;
  preview: string;
}

interface Persona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  location: string;
  interests: string[];
  values: string[];
  purchaseBehavior: string[];
  reasoning: string;
  researchQuestions: string[];
  marketingChannel: string;
}

// Mock AI response function (to be replaced with real API in production)
const generatePersonas = async (data: FormValues, images: ProductImage[]): Promise<any> => {
  // Simulate API call with timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        personas: [
          {
            id: "p1",
            name: "Sarah Thompson",
            age: "28-35",
            occupation: "Marketing Manager",
            location: "Urban",
            interests: ["Fitness", "Technology", "Fashion"],
            values: ["Quality", "Efficiency", "Status"],
            purchaseBehavior: [
              "Researches extensively before purchase",
              "Willing to pay premium for quality",
              "Brand loyal when satisfied"
            ],
            reasoning: "Based on the product description, Sarah represents professionals who value efficiency and quality. The product's features align with her need for reliable solutions.",
            researchQuestions: [
              "What factors most influence your purchasing decisions for work-related tools?",
              "How important is brand reputation compared to product features?"
            ],
            marketingChannel: "LinkedIn + Instagram (sponsored posts)"
          },
          {
            id: "p2",
            name: "Michael Chen",
            age: "35-42",
            occupation: "Small Business Owner",
            location: "Suburban",
            interests: ["Entrepreneurship", "Home Improvement", "Local Community"],
            values: ["Practicality", "Value for Money", "Support"],
            purchaseBehavior: [
              "Price-conscious but values durability",
              "Reads reviews extensively",
              "Prefers products with good customer service"
            ],
            reasoning: "Michael represents the practical business owner segment who needs reliable solutions that provide clear ROI. The product's emphasis on efficiency would appeal to him.",
            researchQuestions: [
              "What level of customer support do you expect when purchasing business solutions?",
              "How do you balance cost vs. features when making business purchases?"
            ],
            marketingChannel: "Facebook Business Groups + Local Business Events"
          },
          {
            id: "p3",
            name: "Emma Rodriguez",
            age: "22-29",
            occupation: "Freelance Designer",
            location: "Urban",
            interests: ["Design", "Coffee Culture", "Digital Nomad Lifestyle"],
            values: ["Creativity", "Flexibility", "Aesthetic"],
            purchaseBehavior: [
              "Early adopter of new tools",
              "Influenced by peers and social media",
              "Values portability and design"
            ],
            reasoning: "Emma represents creative professionals who need flexible solutions. The product's innovative aspects and ease of use would appeal to her workflow needs.",
            researchQuestions: [
              "How important is the visual design of products you use professionally?",
              "Do you prefer products that integrate with your existing workflow tools?"
            ],
            marketingChannel: "Instagram + Design Community Forums"
          }
        ]
      });
    }, 1500);
  });
};

const HyperPersona = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
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

  const refreshPersona = (personaId: string) => {
    toast({
      title: "Refreshing persona",
      description: "This feature will be available in the full version.",
    });
  };

  const generateSurvey = (personaId: string) => {
    toast({
      title: "Generating survey",
      description: "This feature will be available in the full version.",
    });
  };

  const exportPersona = (personaId: string) => {
    toast({
      title: "Exporting persona",
      description: "This feature will be available in the full version.",
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    try {
      const response = await generatePersonas(data, productImages);
      setPersonas(response.personas);
      toast({
        title: "Personas generated successfully!",
        description: "View your customer personas below.",
      });
    } catch (error) {
      toast({
        title: "Error generating personas",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">HyperPersona</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your product description into detailed customer personas with AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="lg:sticky lg:top-4 lg:self-start">
          <CardHeader>
            <CardTitle>Tell us about your product</CardTitle>
            <CardDescription>
              Provide details about your product to generate accurate customer personas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Results Section */}
        <div className="space-y-8">
          {personas.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold">Your Customer Personas</h2>
              {personas.map((persona) => (
                <Card key={persona.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <UserCheck className="mr-2 h-5 w-5 text-primary" />
                          {persona.name}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-x-4 mt-1">
                          <span className="flex items-center">
                            <Briefcase className="mr-1 h-3.5 w-3.5" />
                            {persona.occupation}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3.5 w-3.5" />
                            {persona.location}
                          </span>
                          <span>{persona.age}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium flex items-center mb-2">
                          <Heart className="mr-2 h-4 w-4 text-rose-500" />
                          Interests & Values
                        </h3>
                        <div>
                          <h4 className="text-xs text-muted-foreground mb-1">Interests</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {persona.interests.map((interest, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xs text-muted-foreground mb-1">Values</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {persona.values.map((value, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium flex items-center mb-2">
                          <ShoppingCart className="mr-2 h-4 w-4 text-amber-500" />
                          Purchase Behavior
                        </h3>
                        <ul className="text-sm space-y-1">
                          {persona.purchaseBehavior.map((behavior, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></span>
                              {behavior}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium flex items-center mb-2">
                          <Target className="mr-2 h-4 w-4 text-blue-500" />
                          Why This Persona Fits
                        </h3>
                        <p className="text-sm">{persona.reasoning}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium flex items-center mb-2">
                          <MessageCircle className="mr-2 h-4 w-4 text-purple-500" />
                          Research Questions
                        </h3>
                        <ol className="text-sm list-decimal list-inside space-y-1">
                          {persona.researchQuestions.map((question, idx) => (
                            <li key={idx}>{question}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium flex items-center mb-2">
                          <MessageSquare className="mr-2 h-4 w-4 text-emerald-500" />
                          Best Marketing Channel
                        </h3>
                        <p className="text-sm">{persona.marketingChannel}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => refreshPersona(persona.id)}
                    >
                      <RotateCw className="mr-1.5 h-3.5 w-3.5" />
                      Refresh Persona
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => generateSurvey(persona.id)}
                    >
                      <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                      Generate Survey
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => exportPersona(persona.id)}
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" />
                      Export Persona
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <User className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium">No personas generated yet</h3>
                  <p className="text-muted-foreground">
                    Fill out the form and click "Find My Customers" to generate personas
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HyperPersona;
