
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

// Comprehensive list of category tags
export const CATEGORY_TAGS = [
  // Technology & Electronics
  'Technology', 'Electronics', 'Software', 'Mobile Apps', 'Gaming', 'Smart Home', 'Wearables', 'Audio', 'Video', 'Photography',
  
  // Fashion & Beauty
  'Fashion', 'Clothing', 'Accessories', 'Jewelry', 'Beauty', 'Skincare', 'Cosmetics', 'Hair Care', 'Footwear', 'Bags',
  
  // Health & Wellness
  'Health', 'Wellness', 'Fitness', 'Nutrition', 'Medical', 'Mental Health', 'Supplements', 'Exercise Equipment', 'Healthcare',
  
  // Home & Living
  'Home & Garden', 'Furniture', 'Kitchen', 'Appliances', 'Decor', 'Cleaning', 'Storage', 'Bedding', 'Lighting', 'Tools',
  
  // Food & Beverage
  'Food', 'Beverages', 'Snacks', 'Gourmet', 'Dietary', 'Cooking', 'Baking', 'Coffee', 'Tea',
  
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
  'Budget', 'Mid-Range', 'Premium', 'Affordable', 'Value', 'High-End', 'Economy'
];

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  errorMessage?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategories, 
  onCategoryToggle,
  errorMessage
}) => {
  return (
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
                <button type="button" onClick={() => onCategoryToggle(category)}>
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
                onClick={() => onCategoryToggle(category)}
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
      
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CategorySelector;
