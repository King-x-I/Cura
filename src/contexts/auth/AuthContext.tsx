
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthState, UserType } from "./types";
import { logUser, createConsumerProfile, createProviderProfile, signOutUser } from "./utils";
import { useCheckUserType } from "./useCheckUserType";

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();
  const { checkUserType, checkAdminStatus, isProviderApproved } = useCheckUserType();

  useEffect(() => {
    console.log("Setting up auth context...");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid deadlocks with Supabase client
          setTimeout(async () => {
            const detectedType = await checkUserType(session.user.id);
            
            if (detectedType) {
              setUserType(detectedType);
            } else if (checkAdminStatus(session.user)) {
              setUserType("admin");
            } else if (session.user.user_metadata?.user_type) {
              setUserType(session.user.user_metadata.user_type);
            }
            
            setIsLoading(false);
          }, 0);
        } else {
          setUserType(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const detectedType = await checkUserType(session.user.id);
          
          if (detectedType) {
            setUserType(detectedType);
          } else if (checkAdminStatus(session.user)) {
            setUserType("admin");
          } else if (session.user.user_metadata?.user_type) {
            setUserType(session.user.user_metadata.user_type);
          }
          
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, userType: "consumer" | "provider") => {
    setIsLoading(true);
    console.log(`Attempting to sign in as ${userType} with email: ${email}`);
    
    try {
      // First, sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log("Sign in successful:", logUser(data.user));
      
      // Then, check if the user exists in the appropriate details table
      const tableName = userType === "consumer" ? "consumer_details" : "provider_details";
      
      const { data: profileData, error: profileError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();
      
      console.log(`${userType} profile check:`, profileData ? "Found" : "Not found", profileError);
      
      if (profileError) {
        console.error(`Error checking ${userType} profile:`, profileError);
        // Don't throw here, just log the error and continue
      }
      
      // If profile doesn't exist, create it
      if (!profileData) {
        console.log(`${userType} profile not found, creating one...`);
        if (userType === "consumer") {
          await createConsumerProfile(
            data.user.id, 
            email, 
            data.user.user_metadata.full_name || email.split('@')[0]
          );
        } else {
          await createProviderProfile(
            data.user.id, 
            email, 
            data.user.user_metadata.full_name || email.split('@')[0]
          );
        }
      }
      
      setUserType(userType);
      toast.success("Login successful!");
      navigate(`/${userType}/dashboard`);
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // Re-throw to be caught by the component
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/auth/google-callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userType: "consumer" | "provider") => {
    setIsLoading(true);
    console.log(`Signing up as ${userType} with email: ${email}, name: ${fullName}`);
    try {
      // Sign up the user with auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (error) throw error;
      console.log("Sign up successful:", logUser(data.user));

      // Let the database trigger handle profile creation
      setUserType(userType);
      toast.success("Account created successfully! Please verify your email if required.");
      
      // Navigate to dashboard after signup
      navigate(`/${userType}/dashboard`);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    const success = await signOutUser();
    if (success) {
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userType,
        isLoading,
        isProviderApproved,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
