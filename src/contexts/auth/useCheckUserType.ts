
import { useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserType, ProviderDetails } from "./types";

export const useCheckUserType = () => {
  const [isProviderApproved, setIsProviderApproved] = useState(false);
  
  const checkUserType = useCallback(async (userId: string): Promise<UserType> => {
    console.log("Checking user type for:", userId);
    try {
      // Check if user is a consumer
      const { data: consumerData, error: consumerError } = await supabase
        .from("consumer_details")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      console.log("Consumer check:", consumerData ? "Found" : "Not found", consumerError);

      if (!consumerError && consumerData) {
        console.log("User is a consumer");
        return "consumer";
      }

      // Check if user is a provider
      const { data: providerData, error: providerError } = await supabase
        .from("provider_details")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      console.log("Provider check:", providerData ? "Found" : "Not found", providerError);

      if (!providerError && providerData) {
        console.log("User is a provider");
        // Cast providerData to ProviderDetails to access is_approved safely
        const providerDetails = providerData as ProviderDetails;
        setIsProviderApproved(providerDetails.is_approved || false);
        return "provider";
      }

      return null;
    } catch (error) {
      console.error("Error checking user type:", error);
      return null;
    }
  }, []);

  const checkAdminStatus = useCallback((user: User | null): boolean => {
    if (!user) return false;
    
    // Check if user is an admin based on email
    return user.email?.endsWith('@admin.com') || user.email === 'admin@example.com';
  }, []);

  return { 
    checkUserType, 
    checkAdminStatus, 
    isProviderApproved 
  };
};
