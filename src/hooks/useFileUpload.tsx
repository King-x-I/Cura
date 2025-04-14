
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploadOptions {
  bucket: string;
  folder?: string;
  fileTypes?: string[];
  maxSizeMB?: number;
}

interface FileUploadReturn {
  uploadFile: (file: File) => Promise<string | null>;
  deleteFile: (filePath: string) => Promise<boolean>;
  uploading: boolean;
  progress: number;
}

export const useFileUpload = (options: FileUploadOptions): FileUploadReturn => {
  const { bucket, folder = "", fileTypes, maxSizeMB = 5 } = options;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): boolean => {
    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }

    // Check file type if specified
    if (fileTypes && fileTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !fileTypes.includes(`.${fileExtension}`)) {
        toast.error(`Invalid file type. Allowed types: ${fileTypes.join(", ")}`);
        return false;
      }
    }

    return true;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // Generate storage path based on provided options and file details
      const userId = (await supabase.auth.getUser()).data.user?.id || 'unknown';
      const timestamp = Date.now();
      const filePath = folder 
        ? `${folder}/${userId}_${timestamp}.${fileExtension}` 
        : `${userId}_${timestamp}.${fileExtension}`;
      
      // Simple upload without progress tracking
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      // Update progress after upload completes
      setProgress(100);

      if (error) {
        throw error;
      }

      // Get the public URL for the file
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return urlData.publicUrl;
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      // Extract path from URL if needed
      let path = filePath;
      if (filePath.includes(bucket)) {
        path = filePath.split(`${bucket}/`)[1];
      }
      
      const { error } = await supabase.storage.from(bucket).remove([path]);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
      return false;
    }
  };

  return { uploadFile, deleteFile, uploading, progress };
};
