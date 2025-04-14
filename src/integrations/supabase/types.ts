export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_status: string
          consumer_id: string | null
          created_at: string | null
          date_time: string
          id: string
          location_drop: string | null
          location_pickup: string | null
          payment_mode: string | null
          payment_status: string | null
          price_estimate: number | null
          provider_id: string | null
          service_details: Json
          service_type: string
          transaction_id: string | null
        }
        Insert: {
          booking_status?: string
          consumer_id?: string | null
          created_at?: string | null
          date_time: string
          id?: string
          location_drop?: string | null
          location_pickup?: string | null
          payment_mode?: string | null
          payment_status?: string | null
          price_estimate?: number | null
          provider_id?: string | null
          service_details: Json
          service_type: string
          transaction_id?: string | null
        }
        Update: {
          booking_status?: string
          consumer_id?: string | null
          created_at?: string | null
          date_time?: string
          id?: string
          location_drop?: string | null
          location_pickup?: string | null
          payment_mode?: string | null
          payment_status?: string | null
          price_estimate?: number | null
          provider_id?: string | null
          service_details?: Json
          service_type?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumer_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_details"
            referencedColumns: ["id"]
          },
        ]
      }
      consumer_details: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          profile_picture: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          profile_picture?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_picture?: string | null
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          id: string
          payment_mode: string | null
          provider_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          payment_mode?: string | null
          provider_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          payment_mode?: string | null
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "earnings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_details"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          seen: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          seen?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          seen?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      provider_details: {
        Row: {
          address: string | null
          age: number | null
          bank_account_name: string | null
          bank_account_number: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          experience_years: number | null
          full_name: string | null
          govt_id_number: string | null
          govt_id_type: string | null
          govt_id_url: string | null
          id: string
          ifsc_code: string | null
          is_approved: boolean | null
          is_online: boolean | null
          languages: string | null
          license_expiry_date: string | null
          license_number: string | null
          license_url: string | null
          location: string | null
          phone: string | null
          profile_picture: string | null
          resume_url: string | null
          service_type: string | null
          skills: string | null
          upi_id: string | null
          vehicle_type: string | null
          working_hours_from: string | null
          working_hours_to: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          experience_years?: number | null
          full_name?: string | null
          govt_id_number?: string | null
          govt_id_type?: string | null
          govt_id_url?: string | null
          id: string
          ifsc_code?: string | null
          is_approved?: boolean | null
          is_online?: boolean | null
          languages?: string | null
          license_expiry_date?: string | null
          license_number?: string | null
          license_url?: string | null
          location?: string | null
          phone?: string | null
          profile_picture?: string | null
          resume_url?: string | null
          service_type?: string | null
          skills?: string | null
          upi_id?: string | null
          vehicle_type?: string | null
          working_hours_from?: string | null
          working_hours_to?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          experience_years?: number | null
          full_name?: string | null
          govt_id_number?: string | null
          govt_id_type?: string | null
          govt_id_url?: string | null
          id?: string
          ifsc_code?: string | null
          is_approved?: boolean | null
          is_online?: boolean | null
          languages?: string | null
          license_expiry_date?: string | null
          license_number?: string | null
          license_url?: string | null
          location?: string | null
          phone?: string | null
          profile_picture?: string | null
          resume_url?: string | null
          service_type?: string | null
          skills?: string | null
          upi_id?: string | null
          vehicle_type?: string | null
          working_hours_from?: string | null
          working_hours_to?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          booking_id: string | null
          consumer_id: string | null
          created_at: string | null
          id: string
          provider_id: string | null
          rating: number | null
          review: string | null
        }
        Insert: {
          booking_id?: string | null
          consumer_id?: string | null
          created_at?: string | null
          id?: string
          provider_id?: string | null
          rating?: number | null
          review?: string | null
        }
        Update: {
          booking_id?: string | null
          consumer_id?: string | null
          created_at?: string | null
          id?: string
          provider_id?: string | null
          rating?: number | null
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumer_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_details"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
