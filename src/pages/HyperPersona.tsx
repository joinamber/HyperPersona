
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send, User, Target, Megaphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeatureCard from '@/components/FeatureCard';

// Define form schema with Zod
const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productDescription: z.string().min(10, {
    message: "Product description must be at least 10 characters.",
  }),
  productCategory: z.string().min(2, {
    message: "Product category must be at least 2 characters.",
  }),
  optionalReviews: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock AI response function (to be replaced with real API in production)
const generatePersonas = async (data: FormValues): Promise<any> => {
  // Simulate API call with timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        personas: [
          {
            name: "Sarah Thompson",
            age: 32,
            occupation: "Marketing Manager",
            painPoints: [
              "Limited time to research new tools",
              "Needs to show ROI on marketing spend",
              "Struggles with data analysis"
            ],
            goals: [
              "Increase marketing efficiency",
              "Gain deeper customer insights",
              "Streamline reporting processes"
            ],
            interests: ["Marketing tech", "Data visualization", "Remote work tools"],
            habits: ["Researches products thoroughly before purchase", "Values peer recommendations", "Active on LinkedIn"]
          },
          {
            name: "Michael Chen",
            age: 41,
            occupation: "Small Business Owner",
            painPoints: [
              "Managing multiple aspects of business",
              "Tight budget constraints",
              "Limited marketing expertise"
            ],
            goals: [
              "Grow customer base efficiently",
              "Reduce time spent on marketing",
              "Understand target audience better"
            ],
            interests: ["Business growth strategies", "Automation tools", "Entrepreneurship"],
            habits: ["Compares pricing carefully", "Seeks time-saving solutions", "Values simplicity"]
          }
        ],
        reasoning: "Based on the product description, I've identified two key customer personas. Sarah represents marketing professionals who need specialized tools but have limited time. Michael represents small business owners who need efficient solutions without marketing expertise. Both personas would value this product for different reasons - Sarah for its advanced capabilities and Michael for its simplicity and time-saving aspects.",
        researchPrompts: [
          "What challenges do marketing managers face when implementing new tools?",
          "How do small business owners typically research marketing solutions?",
          "What is the decision-making process for marketing software purchases?"
        ],
        marketingChannels: [
          "LinkedIn - for reaching marketing professionals",
          "Small business forums and communities",
          "Industry-specific webinars and events",
          "Content marketing focused on ROI and time-saving"
        ]
      });
    }, 1500);
  });
};

const HyperPersona = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      productCategory: "",
      optionalReviews: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    try {
      const response = await generatePersonas(data);
      setResult(response);
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">HyperPersona</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your product description into detailed customer personas with AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={<User className="text-primary" />}
          title="AI-Generated Personas"
          description="Get detailed customer personas based on your product description"
          index={0}
        />
        <FeatureCard
          icon={<Target className="text-primary" />}
          title="Research Prompts"
          description="Discover key questions to validate and expand your understanding"
          index={1}
        />
        <FeatureCard
          icon={<Megaphone className="text-primary" />}
          title="Marketing Channels"
          description="Learn where to find and engage your ideal customers"
          index={2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Provide information about your product to generate accurate personas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product in detail, including key features, benefits, and differentiators..." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The more detailed, the better the personas will be.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Marketing Software, Health Product, SaaS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="optionalReviews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Reviews (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste any existing customer reviews or feedback..." 
                          className="min-h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Including real feedback can improve persona accuracy.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Personas...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate Personas
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>
                AI-generated personas and marketing recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personas">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personas">Personas</TabsTrigger>
                  <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="channels">Channels</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personas" className="space-y-4 mt-4">
                  {result.personas.map((persona: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center">
                          <User className="mr-2 h-5 w-5 text-primary" />
                          {persona.name}, {persona.age}
                        </CardTitle>
                        <CardDescription>{persona.occupation}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Pain Points</h4>
                            <ul className="list-disc pl-5 text-sm">
                              {persona.painPoints.map((point: string, idx: number) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Goals</h4>
                            <ul className="list-disc pl-5 text-sm">
                              {persona.goals.map((goal: string, idx: number) => (
                                <li key={idx}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Interests</h4>
                              <ul className="list-disc pl-5 text-sm">
                                {persona.interests.map((interest: string, idx: number) => (
                                  <li key={idx}>{interest}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Habits</h4>
                              <ul className="list-disc pl-5 text-sm">
                                {persona.habits.map((habit: string, idx: number) => (
                                  <li key={idx}>{habit}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="reasoning" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">AI Reasoning</h3>
                      <p className="text-muted-foreground">{result.reasoning}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="research" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">Research Prompts</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {result.researchPrompts.map((prompt: string, idx: number) => (
                          <li key={idx}>{prompt}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="channels" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">Recommended Marketing Channels</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {result.marketingChannels.map((channel: string, idx: number) => (
                          <li key={idx}>{channel}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Export feature coming soon!",
                    description: "In the full version, you'll be able to export these insights.",
                  });
                }}
              >
                Export Insights
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex items-center justify-center min-h-[300px]">
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Fill out the form and generate customer personas to see results here.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="h-16 rounded-md bg-muted animate-pulse"></div>
                <div className="h-16 rounded-md bg-muted animate-pulse"></div>
                <div className="h-16 rounded-md bg-muted animate-pulse"></div>
                <div className="h-16 rounded-md bg-muted animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HyperPersona;
