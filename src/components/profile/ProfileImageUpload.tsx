
import React, { useState, useRef } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, UserCircle } from "lucide-react";

interface ProfileImageUploadProps {
  currentImageUrl: string | null;
  userId: string | null;
  onImageUploaded: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  userId,
  onImageUploaded,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploading, progress } = useFileUpload({
    bucket: "user-assets",
    folder: "profile_pics",
    fileTypes: [".jpg", ".jpeg", ".png", ".webp"],
    maxSizeMB: 2,
  });

  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Create temporary preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Upload file to Supabase
      const fileUrl = await uploadFile(file);
      
      if (fileUrl) {
        onImageUploaded(fileUrl);
        toast.success("Profile picture uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload profile picture");
      // Restore previous image preview if upload fails
      setImagePreview(currentImageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <UserCircle size={64} />
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-sm font-medium">{progress}%</div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <Button 
          type="button" 
          size="sm" 
          variant="outline"
          disabled={uploading}
          onClick={handleButtonClick}
        >
          <User className="mr-2 h-4 w-4" />
          {imagePreview ? "Change Photo" : "Upload Photo"}
        </Button>
        
        <input
          ref={fileInputRef}
          id="profile-picture"
          type="file"
          className="hidden"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        {imagePreview && (
          <button
            type="button"
            className="text-xs text-red-500 mt-2 hover:underline"
            onClick={() => {
              setImagePreview(null);
              onImageUploaded("");
            }}
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;
