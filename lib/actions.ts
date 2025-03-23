"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadProfileImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }

    // Limit file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size must be less than 5MB" };
    }

    // Generate a unique filename
    const filename = `profile-${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    revalidatePath("/profile");

    return {
      url: blob.url,
      success: true,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      error: "Failed to upload image",
      success: false,
    };
  }
}
