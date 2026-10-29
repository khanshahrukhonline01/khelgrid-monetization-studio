export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = "athlete" | "coach" | "academy_owner" | "scout" | "admin";

export interface Database {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          area: string;
          city: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          sports: string[];
          amenities: string[];
          price_per_hour: number;
          rating: number;
          reviews_count: number;
          featured: boolean;
          bookable: boolean;
          image_url: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          operating_hours?: Json | null;
          booking_policies?: Json | null;
          rules_restrictions?: Json | null;
          deleted_at?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["venues"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venues"]["Insert"]>;
      };
      venue_courts: {
        Row: {
          id: string;
          venue_id: string;
          name: string;
          sport: string;
          surface_type: string | null;
          price_per_hour: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["venue_courts"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venue_courts"]["Insert"]>;
      };
      trials: {
        Row: {
          id: string;
          external_id?: string | null;
          venue_id: string | null;
          academy_name: string;
          title: string;
          sport: string;
          city: string;
          state?: string | null;
          venue_name: string | null;
          trial_date: string;
          reporting_time: string | null;
          fee: number;
          fee_label?: string | null;
          spots_total: number;
          spots_available: number;
          tag: string;
          age_category?: string | null;
          gender?: string | null;
          verified_label?: string | null;
          urgency_text?: string | null;
          badge?: string | null;
          eligibility: string | null;
          required_documents: string[];
          selection_process: string | null;
          registration_deadline: string | null;
          source_url: string | null;
          source_label: string | null;
          sources?: Json | null;
          timelines?: Json | null;
          organizer_contacts?: Json | null;
          apply_url?: string | null;
          is_government_quota?: boolean;
          quota_details?: Json | null;
          last_verified: string;
          status: "active" | "upcoming" | "completed" | "cancelled";
          deleted_at?: string | null;
          fts?: unknown | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["trials"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trials"]["Insert"]>;
      };
      coaching_programs: {
        Row: {
          id: string;
          venue_id: string | null;
          title: string;
          coach_name: string;
          sport: string;
          city: string;
          area: string | null;
          level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
          price_per_month: number;
          rating: number;
          reviews_count: number;
          image_url: string | null;
          schedule_details: Json;
          deleted_at?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["coaching_programs"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coaching_programs"]["Insert"]>;
      };
      venue_bookings: {
        Row: {
          id: string;
          venue_id: string;
          court_id: string | null;
          user_id: string | null;
          user_email: string | null;
          user_phone: string | null;
          sport: string;
          booking_date: string;
          start_time: string;
          end_time: string;
          total_price: number;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          idempotency_key?: string | null;
          held_until?: string | null;
          booking_range?: string | null;
          deleted_at?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["venue_bookings"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venue_bookings"]["Insert"]>;
      };
      trial_applications: {
        Row: {
          id: string;
          trial_id: string;
          user_id: string | null;
          athlete_name: string;
          athlete_age: number | null;
          playing_position: string | null;
          contact_phone: string;
          contact_email: string | null;
          sports_cv_data: Json;
          status: "submitted" | "shortlisted" | "rejected" | "attended";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["trial_applications"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trial_applications"]["Insert"]>;
      };
      coaching_enrollments: {
        Row: {
          id: string;
          program_id: string;
          user_id: string | null;
          student_name: string;
          student_age: number | null;
          contact_phone: string;
          status: "pending" | "active" | "paused" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["coaching_enrollments"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coaching_enrollments"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          username: string | null;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          state: string | null;
          country: string;
          role: string;
          plan: string;
          is_verified: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          username?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          role?: string;
          plan?: string;
          is_verified?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          primary_sport: string;
          secondary_sports: string[];
          city: string;
          age_category: string;
          playing_position: string | null;
          bio: string | null;
          skill_level: string;
          membership_tier: string;
          role: AppRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_profiles"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
      sports_achievements: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          title: string;
          sport: string;
          category: "tournament" | "selection" | "award" | "milestone" | "certification";
          level: "Club" | "District" | "State" | "Zonal" | "National";
          organization: string;
          year: number;
          position_rank: string | null;
          description: string | null;
          verified: boolean;
          verification_badge: string | null;
          certificate_url: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["sports_achievements"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sports_achievements"]["Insert"]>;
      };
      user_memberships: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          plan_name: string;
          tier: "free" | "pro" | "elite" | "academy";
          status: "active" | "renewed" | "expired" | "paused";
          sport: string;
          venue_name: string | null;
          valid_from: string;
          valid_until: string;
          auto_renew: boolean;
          perks: string[];
          allocated_hours_per_month: number;
          used_hours_this_month: number;
          price_paid: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_memberships"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_memberships"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: "INSERT" | "UPDATE" | "DELETE";
          old_data: Json | null;
          new_data: Json | null;
          performed_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
      saved_opportunities: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string;
          trial_id: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["saved_opportunities"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["saved_opportunities"]["Insert"]>;
      };
      feedback_tickets: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          type: "bug" | "feature" | "general";
          category: string;
          title: string;
          description: string;
          severity: "low" | "normal" | "high" | "urgent";
          device_info: Json;
          status: "open" | "in_progress" | "resolved" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["feedback_tickets"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["feedback_tickets"]["Insert"]>;
      };
      venue_reviews: {
        Row: {
          id: string;
          venue_id: string;
          user_id: string | null;
          user_name: string;
          rating: number;
          comment: string | null;
          sport: string | null;
          verified_booking: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["venue_reviews"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venue_reviews"]["Insert"]>;
      };
    };
    Functions: {
      get_venue_slot_availability: {
        Args: {
          p_venue_id: string;
          p_booking_date: string;
          p_court_id?: string | null;
        };
        Returns: Array<{
          court_id: string | null;
          start_time: string;
          end_time: string;
          status: string;
          is_held: boolean;
        }>;
      };
      book_venue_slot_atomic: {
        Args: {
          p_venue_id: string;
          p_court_id?: string | null;
          p_sport?: string;
          p_booking_date?: string;
          p_start_time?: string;
          p_end_time?: string;
          p_total_price?: number;
          p_user_email?: string | null;
          p_user_phone?: string | null;
          p_idempotency_key?: string | null;
          p_user_id?: string | null;
          p_status?: string;
          p_hold_duration_minutes?: number | null;
          p_custom_booking_id?: string | null;
        };
        Returns: {
          success: boolean;
          already_processed?: boolean;
          booking_id?: string;
          status?: string;
          total_price?: number;
          held_until?: string | null;
          error_code?: string;
          message: string;
        };
      };
      hold_venue_slot_atomic: {
        Args: {
          p_venue_id: string;
          p_court_id?: string | null;
          p_sport?: string;
          p_booking_date?: string;
          p_start_time?: string;
          p_end_time?: string;
          p_total_price?: number;
          p_user_email?: string | null;
          p_user_phone?: string | null;
          p_idempotency_key?: string | null;
          p_hold_duration_minutes?: number;
        };
        Returns: {
          success: boolean;
          booking_id?: string;
          status?: string;
          total_price?: number;
          held_until?: string | null;
          error_code?: string;
          message: string;
        };
      };
      cancel_venue_booking_atomic: {
        Args: {
          p_booking_id: string;
          p_reason?: string | null;
        };
        Returns: {
          success: boolean;
          booking_id?: string;
          error_code?: string;
          message: string;
        };
      };
      search_trials: {
        Args: {
          p_query?: string | null;
          p_sport?: string | null;
          p_city?: string | null;
          p_category?: string | null;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: Array<Database["public"]["Tables"]["trials"]["Row"] & { rank_score: number }>;
      };
      get_trials_summary_stats: {
        Args: Record<string, never>;
        Returns: {
          total_trials: number;
          active_trials: number;
          govt_quota_trials: number;
          total_vacancies: number;
          distinct_sports: number;
          distinct_cities: number;
          generated_at: string;
        };
      };
      toggle_saved_opportunity: {
        Args: {
          p_user_email: string;
          p_trial_id: string;
          p_notes?: string | null;
        };
        Returns: {
          success: boolean;
          is_saved: boolean;
          trial_id: string;
        };
      };
    };
  };
}
