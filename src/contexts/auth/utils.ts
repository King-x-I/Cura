
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Clean up user details to avoid debug logs cluttering
export const logUser = (user: User | null) => {
  if (!user) return null;
  const { id, email } = user;
  return { id, email };
};

// Create consumer profile
export const createConsumerProfile = async (userId: string, email: string, fullName: string) => {
  try {
    const { error: insertError } = await supabase
      .from("consumer_details")
      .insert({
        id: userId,
        email: email,
        full_name: fullName || email.split('@')[0],
      });
    
    if (insertError) {
      console.error("Error creating consumer profile:", insertError);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error creating consumer profile:", error);
    return false;
  }
};

// Create provider profile
export const createProviderProfile = async (userId: string, email: string, fullName: string) => {
  try {
    const { error: insertError } = await supabase
      .from("provider_details")
      .insert({
        id: userId,
        email: email,
        full_name: fullName || email.split('@')[0],
        is_approved: false,
      });
    
    if (insertError) {
      console.error("Error creating provider profile:", insertError);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error creating provider profile:", error);
    return false;
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
    toast.success("You've been logged out successfully");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to sign out");
    return false;
  }
};
