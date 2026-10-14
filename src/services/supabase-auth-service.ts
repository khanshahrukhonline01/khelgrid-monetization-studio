import { supabase, isSupabaseConfigured, supabaseUrl } from "@/lib/supabase";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import type { Database, AppRole } from "@/types/database";

export interface SupabaseSignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: "athlete" | "coach" | "academy_owner" | "scout" | "user" | "academy";
  primarySport?: string;
  city?: string;
}

export interface SupabaseSignInParams {
  email: string;
  password: string;
}

export interface SupabaseUserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: AppRole;
  primarySport: string;
  secondarySports?: string[];
  city: string;
  avatarUrl?: string;
  bio?: string;
  membershipTier?: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | null;
  requiresEmailConfirmation?: boolean;
}

/**
 * Normalizes app roles to PostgreSQL app_role enum
 */
function normalizeAppRole(role?: string): AppRole {
  if (role === "coach") return "coach";
  if (role === "academy" || role === "academy_owner") return "academy_owner";
  if (role === "scout") return "scout";
  if (role === "admin") return "admin";
  return "athlete";
}

/**
 * Service encapsulating Supabase Authentication, user profile synchronization, and session management.
 */
export class SupabaseAuthService {
  /**
   * Whether the client has a working Supabase configuration.
   */
  public isConfigured(): boolean {
    return isSupabaseConfigured;
  }

  /**
   * Retrieves the current active Supabase session.
   */
  public async getSession(): Promise<{ session: Session | null; user: User | null }> {
    if (!this.isConfigured()) {
      return { session: null, user: null };
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        return { session: null, user: null };
      }
      return { session: data.session, user: data.session.user };
    } catch (err) {
      console.warn("Failed to get Supabase session:", err);
      return { session: null, user: null };
    }
  }

  /**
   * Retrieves the current Supabase user.
   */
  public async getUser(): Promise<User | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      return data.user;
    } catch {
      return null;
    }
  }

  /**
   * Registers a new user with email and password, and automatically provisions their user profile.
   */
  public async signUp(params: SupabaseSignUpParams): Promise<
    AuthResponse<{
      user: User | null;
      session: Session | null;
      profile?: SupabaseUserProfile | null;
    }>
  > {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          "Supabase authentication is not configured. Please ensure VITE_SUPABASE_ANON_KEY is provided in your environment.",
      };
    }

    try {
      const appRole = normalizeAppRole(params.role);
      const cleanEmail = params.email.trim().toLowerCase();

      // 1. Call Supabase Auth API
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            phone: params.phone?.trim() || "",
            role: appRole,
            primary_sport: params.primarySport || "Cricket",
            city: params.city || "Bengaluru",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to create account",
        };
      }

      const createdUser = data.user;
      if (!createdUser) {
        return {
          success: false,
          error: "Sign-up did not return a valid user object.",
        };
      }

      // Check if email confirmation is required by project settings
      const requiresEmailConfirmation = !data.session && createdUser.identities?.length !== 0;

      // 2. Provision or upsert public.user_profiles row
      let profile: SupabaseUserProfile | null = null;
      try {
        const profilePayload = {
          user_id: createdUser.id,
          full_name: params.fullName.trim(),
          email: cleanEmail,
          phone: params.phone?.trim() || null,
          role: appRole,
          primary_sport: params.primarySport || "Cricket",
          secondary_sports: [],
          city: params.city || "Bengaluru",
          membership_tier: "free",
        };

        const { data: profileRow } = await supabase
          .from("user_profiles")
          .upsert(profilePayload, { onConflict: "user_id" })
          .select()
          .maybeSingle();

        if (profileRow) {
          profile = {
            id: profileRow.id,
            userId: profileRow.user_id || createdUser.id,
            fullName: profileRow.full_name,
            email: profileRow.email || cleanEmail,
            phone: profileRow.phone || undefined,
            role: profileRow.role,
            primarySport: profileRow.primary_sport,
            secondarySports: profileRow.secondary_sports || [],
            city: profileRow.city,
            avatarUrl: profileRow.avatar_url || undefined,
            bio: profileRow.bio || undefined,
            membershipTier: profileRow.membership_tier,
          };
        }
      } catch (profileErr) {
        console.warn("Could not insert user_profiles row on sign up:", profileErr);
      }

      return {
        success: true,
        data: {
          user: createdUser,
          session: data.session,
          profile,
        },
        requiresEmailConfirmation,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected sign-up error occurred.";
      return { success: false, error: message };
    }
  }

  /**
   * Authenticates an existing user with email and password.
   */
  public async signInWithPassword(params: SupabaseSignInParams): Promise<
    AuthResponse<{
      user: User;
      session: Session;
      profile?: SupabaseUserProfile | null;
    }>
  > {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          "Supabase authentication is not configured. Please ensure VITE_SUPABASE_ANON_KEY is set.",
      };
    }

    try {
      const cleanEmail = params.email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: params.password,
      });

      if (error || !data.user || !data.session) {
        return {
          success: false,
          error: error?.message || "Invalid email or password.",
        };
      }

      // Fetch linked profile from user_profiles
      let profile: SupabaseUserProfile | null = null;
      try {
        const { data: profileRow } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (profileRow) {
          profile = {
            id: profileRow.id,
            userId: profileRow.user_id || data.user.id,
            fullName: profileRow.full_name,
            email: profileRow.email || cleanEmail,
            phone: profileRow.phone || undefined,
            role: profileRow.role,
            primarySport: profileRow.primary_sport,
            secondarySports: profileRow.secondary_sports || [],
            city: profileRow.city,
            avatarUrl: profileRow.avatar_url || undefined,
            bio: profileRow.bio || undefined,
            membershipTier: profileRow.membership_tier,
          };
        }
      } catch (profileErr) {
        console.warn("Could not fetch user profile on sign in:", profileErr);
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
          profile,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in.";
      return { success: false, error: message };
    }
  }

  /**
   * Initiates Google OAuth Sign-In or Sign-Up via Supabase.
   */
  public async signInWithGoogle(
    redirectTo?: string,
  ): Promise<AuthResponse<{ url?: string | null }>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Supabase authentication is not configured in this environment.",
      };
    }

    try {
      const targetRedirect =
        redirectTo ||
        (typeof window !== "undefined" ? `${window.location.origin}/login` : undefined);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: targetRedirect,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: { url: data.url },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate Google sign-in.";
      return { success: false, error: message };
    }
  }

  /**
   * Signs out the current user and invalidates their session.
   */
  public async signOut(): Promise<AuthResponse<void>> {
    if (!this.isConfigured()) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign out.";
      return { success: false, error: message };
    }
  }

  /**
   * Sends a password reset email via Supabase Auth.
   */
  public async resetPasswordForEmail(
    email: string,
    redirectTo?: string,
  ): Promise<AuthResponse<void>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Supabase is not configured." };
    }

    try {
      const targetRedirect =
        redirectTo ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/forgot-password?mode=reset`
          : undefined);

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: targetRedirect,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Password reset request failed.";
      return { success: false, error: message };
    }
  }

  /**
   * Updates user's password once authorized via recovery token/session.
   */
  public async updatePassword(newPassword: string): Promise<AuthResponse<void>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Supabase is not configured." };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      return { success: false, error: message };
    }
  }

  /**
   * Subscribes to Supabase authentication state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
   */
  public onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void {
    if (!this.isConfigured()) {
      return () => {};
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  /**
   * Retrieves or creates profile data for a specific user ID.
   */
  public async getUserProfile(userId: string): Promise<SupabaseUserProfile | null> {
    if (!this.isConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id || userId,
        fullName: data.full_name,
        email: data.email || "",
        phone: data.phone || undefined,
        role: data.role,
        primarySport: data.primary_sport,
        secondarySports: data.secondary_sports || [],
        city: data.city,
        avatarUrl: data.avatar_url || undefined,
        bio: data.bio || undefined,
        membershipTier: data.membership_tier,
      };
    } catch {
      return null;
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
export default supabaseAuthService;
