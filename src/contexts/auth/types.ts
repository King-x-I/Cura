
import { Session, User } from "@supabase/supabase-js";

export type UserType = "consumer" | "provider" | "admin" | null;

export interface AuthState {
  user: User | null;
  session: Session | null;
  userType: UserType;
  isLoading: boolean;
  isProviderApproved: boolean;
  signIn: (email: string, password: string, userType: "consumer" | "provider") => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, userType: "consumer" | "provider") => Promise<void>;
  signOut: () => Promise<void>;
}

export interface ConsumerDetails {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  profile_picture: string | null;
  created_at: string | null;
}

export interface ProviderDetails {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  profile_picture: string | null;
  is_approved: boolean | null;
  // Add other provider fields as needed
  [key: string]: any; // Allow other provider fields
}
