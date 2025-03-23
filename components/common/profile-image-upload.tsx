"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ProfileImageUploadProps {
  currentImage: string | null | undefined;
  name: string | null | undefined;
  onImageUploaded: (url: string) => void;
}

export function ProfileImageUpload({
  currentImage,
  name,
  onImageUploaded,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload the file
    setIsUploading(true);

    try {
      if (currentImage) {
        await DeleteFile(currentImage);
      }
      const url = await uploadFile(file);

      return url;
    } catch (error) {
      toast("An unexpected error occurred. Please try again.");
      console.log(error);
      // Reset preview if upload failed
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Create a FormData object to hold the file
    const formData = new FormData();
    formData.append("file", file);

    // Send the file to the server
    const response = await fetch("/api/file", {
      method: "POST",
      body: formData,
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();

    // Handle the response based on the status
    if (response.status === 200) {
      onImageUploaded(data.url); // Call the callback with the uploaded image URL
      toast.success("Your profile picture has been updated successfully.");
    } else {
      toast.error(data.error || "Failed to upload image. Please try again.");
      setPreviewUrl(null); // Reset preview if upload failed
    }

    return data.url; // Return the URL of the uploaded image
  };

  const DeleteFile = async (url: string): Promise<boolean> => {
    // Create a FormData object to hold the file

    // Send the file to the server
    const response = await fetch("/api/file/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true; // Return the URL of the uploaded image
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Use preview URL if available, otherwise use current image
  const displayImage =
    previewUrl || currentImage || "/placeholder.svg?height=100&width=100";
  const initials = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="h-24 w-24">
          <AvatarImage src={displayImage} alt={name || "Profile"} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-0 cursor-pointer right-0 rounded-full opacity-90 shadow-md"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4 " />
          )}
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
