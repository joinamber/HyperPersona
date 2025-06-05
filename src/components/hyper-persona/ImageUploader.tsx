
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2 } from 'lucide-react';

export interface ProductImage {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  productImages: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  productImages, 
  onImagesChange 
}) => {
  const [uploading, setUploading] = useState(false);

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

      onImagesChange([...productImages, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = (indexToRemove: number) => {
    onImagesChange(productImages.filter((_, index) => index !== indexToRemove));
  };

  return (
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
  );
};

export default ImageUploader;
