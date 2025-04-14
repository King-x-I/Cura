
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session to check user data
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          throw new Error(error?.message || "Failed to authenticate with Google");
        }

        // First, check if user already exists in either table
        const { data: existingConsumer } = await supabase
          .from("consumer_details")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        const { data: existingProvider } = await supabase
          .from("provider_details")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        // If user doesn't exist in either table, create as consumer
        if (!existingConsumer && !existingProvider) {
          // Create consumer profile
          const { error: insertError } = await supabase
            .from("consumer_details")
            .insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata.full_name || 
                        session.user.user_metadata.name || 
                        "Google User",
              profile_picture: session.user.user_metadata.avatar_url || null
            });

          if (insertError) {
            console.error("Error creating consumer profile:", insertError);
            toast.error("Failed to complete your profile setup");
          }
        }

        toast.success("Successfully logged in with Google!");
        
        // If they were already a provider, navigate to provider dashboard
        if (existingProvider) {
          navigate("/provider/dashboard");
        } else {
          // Default to consumer dashboard
          navigate("/consumer/dashboard");
        }
      } catch (error: any) {
        console.error("Google callback error:", error);
        toast.error(error.message || "Authentication failed");
        navigate("/consumer/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
